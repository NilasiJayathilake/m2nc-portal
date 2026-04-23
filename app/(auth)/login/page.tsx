"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/app/config/appRoutes";
import { login } from "@/app/(protected)/services/auth.service";

type EntryRole = "NEW_COMER" | "FRIEND";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<EntryRole>("NEW_COMER");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.length > 0,
    [email, password],
  );

  return (
    <main className="min-h-screen">
      <div className="min-h-screen grid lg:grid-cols-2">
        <section
          className="hidden lg:flex p-10 text-(--card)"
          style={{
            background:
              "linear-gradient(135deg, var(--primary), var(--secondary))",
          }}
        >
          <div className="flex w-full flex-col">
            <div className="text-sm font-semibold tracking-wide">
              Move2NewCity
            </div>

            <div className="mt-auto max-w-lg">
              <h1 className="text-5xl font-semibold leading-tight">
                Your city.
                <br />
                Your people.
              </h1>
              <p className="mt-4 text-base opacity-80">
                The digital concierge for your next big move. Whether
                you&apos;re arriving or guiding, we&apos;re here to help you
                belong.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-9 w-9 rounded-full border border-(--card) bg-(--card) opacity-30" />
                  <div className="h-9 w-9 rounded-full border border-(--card) bg-(--card) opacity-30" />
                  <div className="h-9 w-9 rounded-full border border-(--card) bg-(--card) opacity-30" />
                </div>
                <div className="text-xs tracking-wide opacity-80">
                  + 12K ACTIVE FRIENDS
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-(--background) px-6 py-8 lg:px-10">
          <div className="mx-auto flex min-h-full w-full max-w-xl flex-col">
            <header className="flex items-center justify-end text-sm">
              <span className="text-(--neutral)">Need help?</span>
              <a
                className="ml-2 font-semibold text-(--primary)"
                href="mailto:support@m2nc.com"
              >
                Contact Support
              </a>
            </header>

            <div className="my-auto">
              <div className="mx-auto w-full max-w-md">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-(--neutral)">
                  Choose how you want to enter Move2NewCity today.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("NEW_COMER")}
                    className={
                      "rounded-xl border bg-(--card) p-4 text-left " +
                      (selectedRole === "NEW_COMER" ? "border-(--primary)" : "")
                    }
                    aria-pressed={selectedRole === "NEW_COMER"}
                  >
                    <div className="text-sm font-semibold">
                      I&apos;m a Newcomer
                    </div>
                    <div className="mt-1 text-xs text-(--neutral)">
                      Find a city &amp; discover local experts
                    </div>
                    <div className="mt-3 text-xs font-semibold text-(--primary)">
                      GO TO DISCOVERY →
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("FRIEND")}
                    className={
                      "rounded-xl border bg-(--card) p-4 text-left " +
                      (selectedRole === "FRIEND" ? "border-(--primary)" : "")
                    }
                    aria-pressed={selectedRole === "FRIEND"}
                  >
                    <div className="text-sm font-semibold">
                      I&apos;m a Friend
                    </div>
                    <div className="mt-1 text-xs text-(--neutral)">
                      Set up your expert digital twin
                    </div>
                    <div className="mt-3 text-xs font-semibold text-(--tertiary)">
                      START SETUP →
                    </div>
                  </button>
                </div>

                <form
                  className="mt-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setError(null);

                    startTransition(async () => {
                      try {
                        await login(
                          { email: email.trim(), password },
                          { remember: true },
                        );
                        router.push(appRoutes.dashboard);
                      } catch (err) {
                        const message =
                          err instanceof Error ? err.message : "Login failed";
                        setError(message);
                      }
                    });
                  }}
                >
                  <label className="block">
                    <span className="text-xs font-semibold tracking-widest text-(--neutral)">
                      EMAIL ADDRESS
                    </span>
                    <input
                      className="mt-2 w-full rounded-xl border bg-(--background) px-4 py-3 outline-none focus:border-(--primary)"
                      type="email"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </label>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-widest text-(--neutral)">
                        PASSWORD
                      </span>
                      <a
                        className="text-xs font-semibold text-(--primary)"
                        href="mailto:support@m2nc.com"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <input
                      className="mt-2 w-full rounded-xl border bg-(--background) px-4 py-3 outline-none focus:border-(--primary)"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  {error ? (
                    <p className="mt-3 text-sm text-(--tertiary)">{error}</p>
                  ) : null}

                  <button
                    className="mt-6 w-full rounded-xl bg-(--primary) px-4 py-3 font-semibold text-(--card) disabled:opacity-60"
                    type="submit"
                    disabled={!canSubmit || isPending}
                  >
                    {isPending ? "Signing in…" : "Sign In to My Dashboard"}
                  </button>
                </form>

                <div className="mt-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-(--neutral) opacity-30" />
                  <div className="text-[10px] font-semibold tracking-widest text-(--neutral)">
                    OR CONTINUE WITH
                  </div>
                  <div className="h-px flex-1 bg-(--neutral) opacity-30" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled
                    className="rounded-xl border bg-(--card) px-4 py-3 text-sm font-semibold text-(--neutral) disabled:opacity-60"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    disabled
                    className="rounded-xl border bg-(--card) px-4 py-3 text-sm font-semibold text-(--neutral) disabled:opacity-60"
                  >
                    Facebook
                  </button>
                </div>

                <p className="mt-8 text-center text-sm text-(--neutral)">
                  Don&apos;t have an account?{" "}
                  <Link
                    className="font-semibold text-(--primary)"
                    href={appRoutes.auth.signUp}
                  >
                    Start your journey
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
