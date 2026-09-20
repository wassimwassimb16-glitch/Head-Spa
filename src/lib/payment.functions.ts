import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
export type PaymentOrderType = "reservation" | "voucher";
type CheckoutInput = { orderId: string; orderType: PaymentOrderType };
type StripeSession = {
  id: string;
  url: string | null;
  payment_status?: string;
  metadata?: Record<string, string>;
};
function tableFor(type: PaymentOrderType) {
  return type === "reservation" ? "reservation_requests" : "voucher_orders";
}
function returnPath(type: PaymentOrderType) {
  return type === "reservation" ? "/account" : "/darkovy-poukaz";
}
function publicOrigin() {
  const request = getRequest();
  return process.env.APP_URL || (request ? new URL(request.url).origin : "");
}
type SupabaseAdminAuth = { auth: { getUser: (token: string) => Promise<{ data: { user: { email?: string } | null }; error: { message?: string } | null }> } };
async function requireCurrentUser(supabaseAdmin: SupabaseAdminAuth) {
  const token = getRequest()
    ?.headers.get("authorization")
    ?.replace(/^Bearer\s+/, "");
  if (!token) throw new Error("You must be signed in to pay.");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user?.email)
    throw new Error("Your session has expired. Please sign in again.");
  return data.user;
}
async function stripeRequest(path: string, init?: RequestInit) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret)
    throw new Error(
      "Stripe is not configured. Add STRIPE_SECRET_KEY to the deployment environment.",
    );
  return fetch("https://api.stripe.com/v1/" + path, {
    ...init,
    headers: { Authorization: "Bearer " + secret, ...(init?.headers ?? {}) },
  });
}
export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: CheckoutInput) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const table = tableFor(data.orderType);
    const currentUser = await requireCurrentUser(supabaseAdmin);
    const { data: order, error } = await supabaseAdmin
      .from(table)
      .select("id, amount_czk, customer_name, email, service_id")
      .eq("id", data.orderId)
      .single();
    if (error || !order) throw new Error("The order could not be found.");
    if (
      String(order.email).toLowerCase() !==
      String(currentUser.email).toLowerCase()
    )
      throw new Error("You can only pay for your own order.");
    const amount = Number(order.amount_czk);
    if (!Number.isInteger(amount) || amount < 100)
      throw new Error("Invalid payment amount.");
    const origin = publicOrigin();
    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("currency", "czk");
    body.set("line_items[0][quantity]", "1");
    body.set("line_items[0][price_data][currency]", "czk");
    body.set("line_items[0][price_data][unit_amount]", String(amount * 100));
    body.set(
      "line_items[0][price_data][product_data][name]",
      data.orderType === "reservation"
        ? "Head Spa reservation — " + String(order.service_id)
        : "Head Spa gift voucher",
    );
    body.set("customer_email", String(order.email));
    body.set("metadata[customer_email]", String(order.email));
    body.set("metadata[order_type]", data.orderType);
    body.set("metadata[order_id]", data.orderId);
    body.set(
      "success_url",
      origin +
        returnPath(data.orderType) +
        "?payment=success&session_id={CHECKOUT_SESSION_ID}",
    );
    body.set(
      "cancel_url",
      origin + returnPath(data.orderType) + "?payment=cancelled",
    );
    const response = await stripeRequest("checkout/sessions", {
      method: "POST",
      body,
    });
    const session = (await response.json()) as StripeSession & {
      error?: { message?: string };
    };
    if (!response.ok || !session.url)
      throw new Error(
        session.error?.message || "Stripe could not create a checkout session.",
      );
    const { error: updateError } = await supabaseAdmin
      .from(table)
      .update({ payment_session_id: session.id })
      .eq("id", data.orderId);
    if (updateError)
      throw new Error("The payment session could not be linked to the order.");
    return { url: session.url };
  });
export const confirmCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    if (!data.sessionId || !/^cs_[A-Za-z0-9_]+$/.test(data.sessionId))
      throw new Error("Invalid payment session.");
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const currentUser = await requireCurrentUser(supabaseAdmin);
    const response = await stripeRequest(
      "checkout/sessions/" + encodeURIComponent(data.sessionId),
    );
    const session = (await response.json()) as StripeSession & {
      error?: { message?: string };
    };
    if (!response.ok || !session.id)
      throw new Error(
        session.error?.message || "The payment could not be verified.",
      );
    if (session.payment_status !== "paid") return { paid: false };
    const orderType = session.metadata?.order_type as
      PaymentOrderType | undefined;
    const orderId = session.metadata?.order_id;
    if (
      !orderType ||
      !orderId ||
      String(session.metadata?.customer_email).toLowerCase() !==
        String(currentUser.email).toLowerCase()
    )
      throw new Error("This payment does not belong to the signed-in account.");
    const { error } = await supabaseAdmin
      .from(tableFor(orderType))
      .update({ status: "paid", payment_session_id: session.id })
      .eq("id", orderId)
      .eq("payment_session_id", session.id);
    if (error)
      throw new Error("Payment succeeded, but the order could not be updated.");
    return { paid: true };
  });
