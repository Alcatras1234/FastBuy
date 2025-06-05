"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Building } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [success, setSuccess] = useState("")

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Введите email"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Введите корректный email"
    }

    if (!password) {
      newErrors.password = "Введите пароль"
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess("")

    if (!validateForm()) return

    setIsLoading(true)

    // Имитация запроса - теперь любые корректные данные приводят к успешному входу
    setTimeout(() => {
      setIsLoading(false)
      setSuccess("Вход выполнен успешно!")
      setTimeout(() => {
        window.location.href = "/admin/profile"
      }, 1000)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 bg-[#F3F4F6] flex items-center justify-center px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Badge className="bg-[#438D69] text-white px-4 py-2">
                <Building className="w-4 h-4 mr-2" />
                Организатор
              </Badge>
            </div>
            <h1 className="text-4xl font-medium mb-2" style={{ color: "#3D6D56" }}>
              Вход в систему
            </h1>
            <p className="text-[#C7C7C7]">Панель управления мероприятиями</p>
          </div>

          {/* Демо подсказка */}

          {errors.general && (
            <div className="flex items-center space-x-2 p-3 bg-[#CD6060]/10 border border-[#CD6060]/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-[#CD6060]" />
              <p className="text-[#CD6060] text-sm">{errors.general}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-[#3D6D56]/10 border border-[#3D6D56]/20 rounded-xl">
              <CheckCircle className="w-4 h-4 text-[#3D6D56]" />
              <p className="text-[#3D6D56] text-sm">{success}</p>
            </div>
          )}

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
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Пароль
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
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
              {errors.password && <p className="text-[#CD6060] text-sm">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="data-[state=checked]:bg-[#3D6D56] data-[state=checked]:border-[#3D6D56]"
                />
                <Label htmlFor="remember" className="text-sm text-[#C7C7C7] cursor-pointer">
                  Запомнить меня
                </Label>
              </div>
              <Link href="/admin/forgot-password" className="text-sm text-[#3D6D56] hover:underline transition-colors">
                Забыли пароль?
              </Link>
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
                  <span>Вход...</span>
                </div>
              ) : (
                "Войти в панель"
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-[#C7C7C7]">
              Нет аккаунта организации?{" "}
              <Link
                href="/admin/signup"
                className="font-medium hover:underline transition-colors"
                style={{ color: "#3D6D56" }}
              >
                Подать заявку
              </Link>
            </p>
            <div className="pt-4 border-t border-[#F3F4F6]">
              <Link href="/login" className="text-sm text-[#C7C7C7] hover:text-[#3D6D56] transition-colors">
                Вход для пользователей
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
