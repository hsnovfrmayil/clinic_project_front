"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-context";
import { oauthStartUrl } from "@/lib/api/auth";
import { toErrorMessage } from "@/lib/api/client";

type Mode = "login" | "register";
type Step = "form" | "otp";
type Gender = "male" | "female";

const SOCIAL = [
  { id: "yandex" as const, label: "Яндекс", bg: "#FC3F1D", mark: "Я" },
  { id: "vk" as const, label: "VK", bg: "#0077FF", mark: "VK" },
];

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-24 text-center text-sm text-silver">
          Загрузка…
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { login, register, verifyOtp, isAuthenticated, user, logout, hydrated } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [birthDate, setBirthDate] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const isLogin = mode === "login";

  const title = useMemo(() => {
    if (step === "otp") return "Подтверждение";
    return isLogin ? "Вход" : "Регистрация";
  }, [isLogin, step]);

  const goHome = () => router.push(next);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      if (step === "otp") {
        if (otp.trim().length !== 6) {
          setError("Введите 6-значный код");
          return;
        }
        await verifyOtp(email.trim(), otp.trim());
        await login({ email: email.trim(), password });
        goHome();
        return;
      }

      if (!email.trim() || !password.trim()) {
        setError("Заполните все поля");
        return;
      }
      if (password.trim().length < 6) {
        setError("Пароль должен быть не короче 6 символов");
        return;
      }

      if (isLogin) {
        await login({ email: email.trim(), password });
        goHome();
        return;
      }

      if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
        setError("Укажите имя, фамилию и телефон");
        return;
      }
      if (!birthDate) {
        setError("Укажите дату рождения");
        return;
      }

      await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
        gender,
        birth_date: birthDate,
      });
      setStep("otp");
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-4.5rem)] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 15% 20%, rgba(176,190,204,0.22), transparent 55%), radial-gradient(ellipse 40% 35% at 90% 85%, rgba(203,184,138,0.1), transparent 50%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-7xl lg:grid-cols-2">
        <aside className="hidden flex-col justify-between border-r border-line px-10 py-16 lg:flex xl:px-14">
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ion">
              EONAGE Account
            </span>
            <h1 className="mt-6 max-w-sm font-display text-5xl leading-[1.05] tracking-tight xl:text-[3.5rem]">
              Клиника
              <br />
              из будущего
            </h1>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-silver">
              Один аккаунт для каталога, бонусов и записи на процедуры.
            </p>
          </div>
          <div className="space-y-5 text-sm text-silver-dim">
            <p className="max-w-xs leading-relaxed">
              Наука. Красота. Технологии — в одном личном кабинете.
            </p>
            <div className="h-px w-16 bg-line" />
            <p className="text-[11px] uppercase tracking-[0.14em]">
              Москва · EONAGE Clinic
            </p>
          </div>
        </aside>

        <section className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
          <Link
            href="/"
            className="mb-10 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.1em] text-silver transition-colors hover:text-ion"
          >
            <ArrowLeft size={14} />
            На главную
          </Link>

          <div className="w-full max-w-[400px]">
            {hydrated && isAuthenticated ? (
              <>
                <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
                  Аккаунт
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-silver">
                  {[user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
                    user?.email ||
                    "Пользователь"}
                </p>
                {user?.email && (
                  <p className="mt-1 text-sm text-silver-dim">{user.email}</p>
                )}
                {user?.phone && (
                  <p className="mt-1 text-sm text-silver-dim">{user.phone}</p>
                )}
                <div className="mt-6 rounded-2xl border border-line bg-panel px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                    Бонусный баланс
                  </p>
                  <p className="mt-2 font-display text-3xl text-mist">
                    {Number(user?.balance ?? 0)}
                  </p>
                </div>
                <Button
                  type="button"
                  className="mt-8 w-full"
                  onClick={() => {
                    logout();
                  }}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
            <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-silver">
              {step === "otp"
                ? `Код отправлен на ${email}`
                : isLogin
                  ? "Войдите по email и паролю"
                  : "Создайте аккаунт — код придёт на email"}
            </p>

            {step === "form" && (
              <div className="mt-8 flex items-center gap-6 border-b border-line">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className={clsx(
                    "relative pb-3 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors",
                    isLogin ? "text-mist" : "text-silver-dim hover:text-silver"
                  )}
                >
                  Вход
                  {isLogin && (
                    <span className="absolute inset-x-0 -bottom-px h-px bg-mist" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  className={clsx(
                    "relative pb-3 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors",
                    !isLogin ? "text-mist" : "text-silver-dim hover:text-silver"
                  )}
                >
                  Регистрация
                  {!isLogin && (
                    <span className="absolute inset-x-0 -bottom-px h-px bg-mist" />
                  )}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {step === "otp" ? (
                <label className="block">
                  <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                    Код из письма
                  </span>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="482910"
                    className="input tracking-[0.3em]"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </label>
              ) : (
                <>
                  {mode === "register" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                            Имя
                          </span>
                          <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="input"
                            autoComplete="given-name"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                            Фамилия
                          </span>
                          <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="input"
                            autoComplete="family-name"
                          />
                        </label>
                      </div>
                      <label className="block">
                        <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                          Телефон
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+994501234567"
                          className="input"
                          autoComplete="tel"
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                            Пол
                          </span>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as Gender)}
                            className="input"
                          >
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                            Дата рождения
                          </span>
                          <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="input"
                            autoComplete="bday"
                          />
                        </label>
                      </div>
                    </>
                  )}

                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="input"
                      autoComplete="email"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                      Пароль
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                    />
                  </label>
                </>
              )}

              {error && <p className="text-sm text-gold">{error}</p>}

              <Button type="submit" className="w-full" disabled={pending}>
                {pending
                  ? "Подождите…"
                  : step === "otp"
                    ? "Подтвердить"
                    : isLogin
                      ? "Войти"
                      : "Создать аккаунт"}
              </Button>
            </form>

            {step === "form" && (
              <>
                <p className="mt-6 text-sm text-silver">
                  {isLogin ? (
                    <>
                      Нет аккаунта?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("register");
                          setError("");
                        }}
                        className="text-mist underline-offset-4 transition-colors hover:text-ion hover:underline"
                      >
                        Зарегистрироваться
                      </button>
                    </>
                  ) : (
                    <>
                      Уже есть аккаунт?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setError("");
                        }}
                        className="text-mist underline-offset-4 transition-colors hover:text-ion hover:underline"
                      >
                        Войти
                      </button>
                    </>
                  )}
                </p>

                <div className="mt-10">
                  <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-silver-dim">
                    Быстрый вход
                  </p>
                  <div className="flex items-center gap-3">
                    {SOCIAL.map((item) => (
                      <a
                        key={item.id}
                        href={oauthStartUrl(item.id)}
                        aria-label={`Войти через ${item.label}`}
                        title={item.label}
                        className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
                        style={{ backgroundColor: item.bg }}
                      >
                        {item.mark}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
