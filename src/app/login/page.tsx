"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import { InputText } from "@/components/ui/form";
import { useToastStore, useUserStore } from "@/stores";
import { Credentials, login } from "@/services/api";

export default function LoginPage() {
  const { addToast } = useToastStore();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [formData, setFormData] = useState<Credentials>({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      addToast({ type: "error", title: "Missing fields", message: "Please fill in both fields." });
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = await login(formData);
      setUser(payload.user);
      addToast({ type: "success", title: "Logged in", message: `Welcome back, ${payload.user.name}` });
      router.replace("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to complete login.";
      addToast({ type: "error", title: "Login failed", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-neutral-950 via-slate-900 to-slate-800 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.04),transparent_25%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10 lg:py-16">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg shadow-cyan-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Vistra</p>
              <p className="text-sm font-semibold text-white">Document Control</p>
            </div>
          </div>
          <span className="hidden text-sm text-white/60 lg:block">Secure by default. Fast by design.</span>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
            <div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-white/5 blur-xl" />
            <div className="absolute -left-10 bottom-10 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-100">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Enterprise Ready
              </div>
              <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
                Control every file with clarity and confidence.
              </h1>
              <p className="max-w-xl text-base text-white/70 lg:text-lg">
                Vistra keeps your documents organized, auditable, and instantly accessible. Log in to continue where you left off.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Zero-trust access", desc: "Every request is validated server-side." },
                  { title: "Activity insights", desc: "Track updates and comments instantly." },
                  { title: "Version-safe", desc: "Upload with confidence, keep history intact." },
                  { title: "Secure sharing", desc: "Granular permissions for teams." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-white/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative rounded-3xl border border-white/10 bg-white/90 p-8 text-neutral-900 shadow-2xl shadow-black/30 backdrop-blur-xl dark:bg-neutral-950/90 dark:text-white lg:p-10">
            <div className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-300" />
            <div className="space-y-2 pt-2">
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Sign in to manage documents, folders, and approvals.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <InputText
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  containerClassName="space-y-1"
                  className="h-12 rounded-xl border border-neutral-200 bg-white/80 text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/50"
                />
                <InputText
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  containerClassName="space-y-1"
                  className="h-12 rounded-xl border border-neutral-200 bg-white/80 text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/50"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-cyan-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
                  Remember me
                </label>
                <a href="#" className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                block
                isLoading={isSubmitting}
                className="h-12 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-400 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-offset-neutral-950"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-semibold text-neutral-900 underline decoration-2 underline-offset-4 hover:decoration-cyan-400 dark:text-white">
                Create an account
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
