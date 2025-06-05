"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Check, X } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string
    confirmPassword?: string
    general?: string
  }>({})

  const passwordRequirements = [
    { text: "Минимум 8 символов", met: password.length >= 8 },
    { text: "Содержит буквы", met: /[a-zA-Zа-яА-Я]/.test(password) },
    { text: "Содержит цифры", met: /\d/.test(password) },
    { text: "Содержит спецсимволы", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  const validateForm = () => {
    const newErrors: {
      password?: string
      confirmPassword?: string
    } = {}

    if (!password) {
      newErrors.password = "Введите новый пароль"
    } else if (password.length < 8) {
      newErrors.password = "Пароль должен содержать минимум 8 символов"
    } else if (!/[a-zA-Zа-яА-Я]/.test(password)) {
      newErrors.password = "Пароль должен содержать буквы"
    } else if (!/\d/.test(password)) {
      newErrors.password = "Пароль должен содержать цифры"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Подтвердите новый пароль"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают"
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
    }, 1500)
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
                Пароль обновлен!
              </h1>
              <p className="text-[#C7C7C7] text-lg">
                Ваш пароль успешно изменен. Теперь вы можете войти в аккаунт с новым паролем.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-block w-full h-14 text-white text-lg font-medium rounded-xl flex items-center justify-center transition-all hover:shadow-lg"
              style={{ backgroundColor: "#3D6D56" }}
            >
              Войти в аккаунт
            </Link>
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
              Новый пароль
            </h1>
            <p className="text-[#C7C7C7] text-lg">Создайте надежный пароль для вашего аккаунта</p>
          </div>

          {errors.general && (
            <div className="flex items-center space-x-2 p-3 bg-[#CD6060]/10 border border-[#CD6060]/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-[#CD6060]" />
              <p className="text-[#CD6060] text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Новый пароль
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Создайте новый пароль"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  className={`h-14 pl-12 pr-12 bg-white border-[#F3F4F6] rounded-xl text-lg placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
                    errors.password ? "border-[#CD6060] focus:ring-[#CD6060]" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C7C7C7] hover:text-[#3D6D56] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="space-y-2 mt-3">
                  <p className="text-sm font-medium text-gray-700">Требования к паролю:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {req.met ? (
                          <Check className="w-3 h-3 text-[#3D6D56]" />
                        ) : (
                          <X className="w-3 h-3 text-[#CD6060]" />
                        )}
                        <span className={`text-xs ${req.met ? "text-[#3D6D56]" : "text-[#CD6060]"}`}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && <p className="text-[#CD6060] text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                Подтвердите пароль
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Повторите новый пароль"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
                  }}
                  className={`h-14 pl-12 pr-12 bg-white border-[#F3F4F6] rounded-xl text-lg placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
                    errors.confirmPassword ? "border-[#CD6060] focus:ring-[#CD6060]" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C7C7C7] hover:text-[#3D6D56] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[#CD6060] text-sm">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !passwordRequirements.every((req) => req.met)}
              className="w-full h-14 text-white text-lg font-medium rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: "#3D6D56" }}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Обновление...</span>
                </div>
              ) : (
                "Обновить пароль"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-sm text-[#C7C7C7] hover:text-[#3D6D56] transition-colors">
              Вернуться к входу
            </Link>
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
