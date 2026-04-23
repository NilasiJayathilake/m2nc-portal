"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/app/config/appRoutes";
import { signUp } from "@/app/(protected)/services/auth.service";
import type { UserRole } from "@/app/(protected)/services/types";

export default function SignUpPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [role, setRole] = useState<UserRole>("FRIEND");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length >= 8;
  }, [email, password]);

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

            <div className="mt-10 max-w-lg">
              <h1 className="text-5xl font-semibold leading-tight">
                Your city guide is
                <br />
                waiting.
              </h1>
              <p className="mt-4 text-base opacity-80">
                Join a community of locals and newcomers making city transitions
                seamless, warm, and human.
              </p>
            </div>

            <div className="mt-auto max-w-lg rounded-xl border border-(--card) bg-(--card) p-5 text-(--text)">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-(--background)" />
                <div>
                  <div className="font-semibold">Julian Rivers</div>
                  <div className="text-xs text-(--neutral)">
                    Local Expert in Austin, TX
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-(--neutral)">
                “Moving here was daunting until I connected with M2NC. Now
                I&apos;m the one showing others the best hidden taco spots!”
              </p>
            </div>
          </div>
        </section>

        <section className="bg-(--background) px-6 py-8 lg:px-10">
          <div className="mx-auto flex min-h-full w-full max-w-xl flex-col">
            <div className="my-auto">
              <div className="mx-auto w-full max-w-md">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Create Account
                </h2>
                <p className="mt-2 text-sm text-(--neutral)">
                  Choose your path and start your journey.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("NEW_COMER")}
                    className={
                      "rounded-xl border px-4 py-4 text-sm font-semibold " +
                      (role === "NEW_COMER"
                        ? "bg-(--primary) text-(--card) border-(--primary)"
                        : "bg-(--card) text-(--text)")
                    }
                    aria-pressed={role === "NEW_COMER"}
                  >
                    Newcomer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("FRIEND")}
                    className={
                      "rounded-xl border px-4 py-4 text-sm font-semibold " +
                      (role === "FRIEND"
                        ? "bg-(--primary) text-(--card) border-(--primary)"
                        : "bg-(--card) text-(--text)")
                    }
                    aria-pressed={role === "FRIEND"}
                  >
                    Friend
                  </button>
                </div>

                <form
                  className="mt-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setError(null);

                    startTransition(async () => {
                      try {
                        await signUp({
                          name: name.trim().length ? name.trim() : undefined,
                          email: email.trim(),
                          password,
                          role,
                        });

                        router.push(appRoutes.auth.login);
                      } catch (err) {
                        const message =
                          err instanceof Error ? err.message : "Sign up failed";
                        setError(message);
                      }
                    });
                  }}
                >
                  <label className="block">
                    <span className="text-xs font-semibold tracking-widest text-(--neutral)">
                      FULL NAME
                    </span>
                    <input
                      className="mt-2 w-full rounded-xl border bg-(--background) px-4 py-3 outline-none focus:border-(--primary)"
                      placeholder="Julian Rivers"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="text-xs font-semibold tracking-widest text-(--neutral)">
                      EMAIL ADDRESS
                    </span>
                    <input
                      className="mt-2 w-full rounded-xl border bg-(--background) px-4 py-3 outline-none focus:border-(--primary)"
                      type="email"
                      placeholder="julian@concierge.city"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="text-xs font-semibold tracking-widest text-(--neutral)">
                      PASSWORD
                    </span>
                    <input
                      className="mt-2 w-full rounded-xl border bg-(--background) px-4 py-3 outline-none focus:border-(--primary)"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <span className="mt-2 block text-xs text-(--neutral)">
                      Minimum 8 characters.
                    </span>
                  </label>

                  {error ? (
                    <p className="mt-3 text-sm text-(--tertiary)">{error}</p>
                  ) : null}

                  <button
                    className="mt-6 w-full rounded-xl bg-(--primary) px-4 py-3 font-semibold text-(--card) disabled:opacity-60"
                    type="submit"
                    disabled={!canSubmit || isPending}
                  >
                    {isPending ? "Creating…" : "Get Started →"}
                  </button>
                </form>

                <div className="mt-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-(--neutral) opacity-30" />
                  <div className="text-[10px] font-semibold tracking-widest text-(--neutral)">
                    OR REGISTER WITH
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
                  Already have an account?{" "}
                  <Link
                    className="font-semibold text-(--primary)"
                    href={appRoutes.auth.login}
                  >
                    Log In
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
