import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { CompactHero, Field, PageShell } from "@/components/head-spa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Přihlášení | Head Spa By Kratochvílová" },
      {
        name: "description",
        content:
          "Přihlaste se k rezervaci, účtu a administraci Head Spa By Kratochvílová.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate({ to: isAdmin ? "/admin" : "/account", replace: true });
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const processSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register") {
      if (
        !form.firstName.trim() ||
        !form.lastName.trim() ||
        !form.phone.trim()
      ) {
        setError("Vyplňte prosím všechna povinná pole.");
        return;
      }
      if (form.password.length < 6) {
        setError("Heslo musí mít alespoň 6 znaků.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Hesla se neshodují.");
        return;
      }
    }

    setSubmitting(true);

    try {
      if (mode === "login") {
        const result = await signIn(form.email, form.password);
        if (result.error) {
          setError(result.error);
          return;
        }
        setSuccess("Přihlášení proběhlo úspěšně.");
        navigate({ to: isAdmin ? "/admin" : "/account", replace: true });
      } else {
        const result = await signUp({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
        if (result.error) {
          setError(result.error);
          return;
        }
        setSuccess("Registrace proběhla úspěšně. Nyní jste přihlášeni.");
        navigate({ to: "/account", replace: true });
      }
    } catch {
      setError("Při přihlášení se něco nepodařilo. Zkuste to prosím znovu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <CompactHero />
      <main className="mx-auto max-w-5xl px-6 pb-24 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-card p-8 md:p-10">
            <span className="eyebrow">Head Spa By Kratochvílová</span>
            <h1 className="section-heading">
              {mode === "login" ? "Přihlášení" : "Registrace"}
            </h1>
            <p className="max-w-md leading-8 text-muted-foreground">
              Pro rezervaci, správu termínů a přístup do zákaznického účtu se
              přihlaste s vaším e-mailem a heslem.
            </p>

            <div className="mt-8 flex gap-3 rounded-full border border-border bg-background p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Přihlásit se
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Registrovat
              </button>
            </div>

            <form
              onSubmit={processSubmit}
              className="mt-8 space-y-5"
              noValidate
            >
              {mode === "register" && (
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Jméno">
                    <input
                      value={form.firstName}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          firstName: event.target.value,
                        }))
                      }
                      placeholder="Jméno"
                    />
                  </Field>
                  <Field label="Příjmení">
                    <input
                      value={form.lastName}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          lastName: event.target.value,
                        }))
                      }
                      placeholder="Příjmení"
                    />
                  </Field>
                </div>
              )}

              {mode === "register" && (
                <Field label="Telefon">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="+420 777 123 456"
                  />
                </Field>
              )}

              <Field label={t.common.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="vas@email.cz"
                />
              </Field>

              <Field label={t.common.password}>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="••••••••"
                />
              </Field>

              {mode === "register" && (
                <Field label="Potvrdit heslo">
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    placeholder="••••••••"
                  />
                </Field>
              )}

              {error && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </p>
              )}

              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={submitting}
              >
                {submitting
                  ? "Odesílám..."
                  : mode === "login"
                    ? "Přihlásit se"
                    : "Vytvořit účet"}
                <ArrowRight />
              </Button>
            </form>
          </div>

          <div className="surface-card p-8 md:p-10">
            <div className="flex items-center gap-3 text-foreground">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                <LockKeyhole />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Bezpečný přístup
                </p>
                <h2 className="font-serif text-3xl">Zákaznický účet</h2>
              </div>
            </div>

            <div className="mt-8 space-y-5 text-sm leading-7 text-muted-foreground">
              <div className="flex gap-3 rounded-lg border border-border bg-background p-4">
                <UserRound className="mt-1 h-5 w-5 text-primary" />
                <p>
                  Váš účet vám umožní spravovat rezervace, sledovat platby a
                  přístup k osobním údajům.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="font-semibold text-foreground">Administrace</p>
                <p className="mt-2">
                  Pouze uživatel s rolí administrátora má přístup na panel
                  /admin po přihlášení.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Zpět na hlavní stránku <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
