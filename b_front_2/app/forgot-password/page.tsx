"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [resendTimer, setResendTimer] = useState(0)

  const validateForm = () => {
    const newErrors: { email?: string } = {}

    if (!email) {
      newErrors.email = "Введите email"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Введите корректный email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) return

    setIsLoading(true)
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      // Запускаем таймер для повторной отправки
      setResendTimer(60)
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 1500)
  }

  const handleResend = () => {
    if (resendTimer > 0) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setResendTimer(60)
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 1000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Success message */}
        <div className="flex-1 bg-[#F3F4F6] flex items-center justify-center px-8">
          <div className="w-full max-w-md text-center space-y-8">
            <div className="w-16 h-16 bg-[#3D6D56]/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-[#3D6D56]" />
            </div>

            <div>
              <h1 className="text-4xl font-medium mb-4" style={{ color: "#3D6D56" }}>
                Письмо отправлено!
              </h1>
              <p className="text-[#C7C7C7] text-lg mb-2">Мы отправили инструкции по восстановлению пароля на адрес:</p>
              <p className="font-medium text-gray-900 mb-6">{email}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <p className="text-blue-800 font-medium text-sm">Что делать дальше?</p>
                </div>
                <ul className="text-blue-700 text-sm space-y-1 text-left">
                  <li>• Проверьте папку "Входящие"</li>
                  <li>• Проверьте папку "Спам"</li>
                  <li>• Ссылка действительна 24 часа</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResend}
                  disabled={resendTimer > 0 || isLoading}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-[#3D6D56] text-[#3D6D56] hover:bg-[#3D6D56]/10"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#3D6D56] border-t-transparent rounded-full animate-spin"></div>
                      <span>Отправка...</span>
                    </div>
                  ) : resendTimer > 0 ? (
                    `Повторить через ${resendTimer}с`
                  ) : (
                    "Отправить повторно"
                  )}
                </Button>

                <Link
                  href="/login"
                  className="inline-block w-full h-12 bg-white text-[#3D6D56] font-medium rounded-xl flex items-center justify-center hover:bg-[#F3F4F6] transition-colors border border-[#F3F4F6]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Вернуться к входу
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Logo */}
        <div className="flex-1 bg-[#C7C7C7] flex items-center justify-center">
          <Image src="/fastbuy-logo.png" alt="FastBuy" width={135} height={40} className="h-16 w-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 bg-[#F3F4F6] flex items-center justify-center px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-medium" style={{ color: "#3D6D56" }}>
              Забыли пароль?
            </h1>
            <p className="text-[#C7C7C7] text-lg">Не волнуйтесь, мы поможем вам восстановить доступ к аккаунту</p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-yellow-800 font-medium text-sm">Важно знать</p>
            </div>
            <p className="text-yellow-700 text-sm">Ссылка для восстановления будет действительна в течение 24 часов</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email адрес
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  className={`h-14 pl-12 bg-white border-[#F3F4F6] rounded-xl text-lg placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
                    errors.email ? "border-[#CD6060] focus:ring-[#CD6060]" : ""
                  }`}
                  required
                />
              </div>
              {errors.email && <p className="text-[#CD6060] text-sm">{errors.email}</p>}
              <p className="text-[#C7C7C7] text-sm">Введите email, который вы использовали при регистрации</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-white text-lg font-medium rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: "#3D6D56" }}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Отправка...</span>
                </div>
              ) : (
                "Отправить ссылку"
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-[#C7C7C7]">
              Вспомнили пароль?{" "}
              <Link
                href="/login"
                className="font-medium hover:underline transition-colors"
                style={{ color: "#3D6D56" }}
              >
                Войти
              </Link>
            </p>
            <div className="pt-4 border-t border-[#F3F4F6]">
              <Link href="/signup" className="text-sm text-[#C7C7C7] hover:text-[#3D6D56] transition-colors">
                Нет аккаунта? Зарегистрироваться
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Logo */}
      <div className="flex-1 bg-[#C7C7C7] flex items-center justify-center">
        <Image src="/fastbuy-logo.png" alt="FastBuy" width={135} height={40} className="h-16 w-auto" />
      </div>
    </div>
  )
}
