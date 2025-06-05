"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Mail, Building, ArrowLeft, CheckCircle, AlertCircle, Shield } from "lucide-react"

export default function AdminForgotPasswordPage() {
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
            <div className="flex justify-center mb-4">
              <Badge className="bg-[#438D69] text-white px-4 py-2">
                <Building className="w-4 h-4 mr-2" />
                Организатор
              </Badge>
            </div>

            <div className="w-16 h-16 bg-[#3D6D56]/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-[#3D6D56]" />
            </div>

            <div>
              <h1 className="text-4xl font-medium mb-4" style={{ color: "#3D6D56" }}>
                Письмо отправлено!
              </h1>
              <p className="text-[#C7C7C7] text-lg mb-2">Инструкции по восстановлению пароля отправлены на:</p>
              <p className="font-medium text-gray-900 mb-6">{email}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <p className="text-blue-800 font-medium text-sm">Безопасность организации</p>
                </div>
                <ul className="text-blue-700 text-sm space-y-1 text-left">
                  <li>• Проверьте корпоративную почту</li>
                  <li>• Ссылка действительна 24 часа</li>
                  <li>• При подозрении на взлом - свяжитесь с поддержкой</li>
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
                  href="/admin/login"
                  className="inline-block w-full h-12 bg-white text-[#3D6D56] font-medium rounded-xl flex items-center justify-center hover:bg-[#F3F4F6] transition-colors border border-[#F3F4F6]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Вернуться к входу
                </Link>

                <div className="pt-4 border-t border-[#F3F4F6]">
                  <p className="text-xs text-[#C7C7C7] mb-2">Нужна помощь?</p>
                  <Link href="mailto:support@fastbuy.ru" className="text-sm text-[#3D6D56] hover:underline">
                    Связаться с поддержкой
                  </Link>
                </div>
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
            <div className="flex justify-center mb-4">
              <Badge className="bg-[#438D69] text-white px-4 py-2">
                <Building className="w-4 h-4 mr-2" />
                Организатор
              </Badge>
            </div>
            <h1 className="text-4xl font-medium" style={{ color: "#3D6D56" }}>
              Восстановление доступа
            </h1>
            <p className="text-[#C7C7C7] text-lg">Восстановите доступ к панели управления мероприятиями</p>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <p className="text-orange-800 font-medium text-sm">Важно для организаций</p>
            </div>
            <ul className="text-orange-700 text-sm space-y-1">
              <li>• Используйте корпоративный email</li>
              <li>• Ссылка действительна 24 часа</li>
              <li>• При проблемах обращайтесь в поддержку</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email организации
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="organization@company.com"
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
              <p className="text-[#C7C7C7] text-sm">Введите email, указанный при регистрации организации</p>
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
                href="/admin/login"
                className="font-medium hover:underline transition-colors"
                style={{ color: "#3D6D56" }}
              >
                Войти в панель
              </Link>
            </p>
            <div className="pt-4 border-t border-[#F3F4F6] space-y-2">
              <Link
                href="/admin/signup"
                className="block text-sm text-[#C7C7C7] hover:text-[#3D6D56] transition-colors"
              >
                Подать заявку на регистрацию
              </Link>
              <Link
                href="mailto:support@fastbuy.ru"
                className="block text-sm text-[#C7C7C7] hover:text-[#3D6D56] transition-colors"
              >
                Связаться с поддержкой
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
