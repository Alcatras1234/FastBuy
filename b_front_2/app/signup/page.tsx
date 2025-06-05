"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Check, X } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    terms?: string
    general?: string
  }>({})
  const [success, setSuccess] = useState("")

  const passwordRequirements = [
    { text: "Минимум 8 символов", met: password.length >= 8 },
    { text: "Содержит буквы", met: /[a-zA-Zа-яА-Я]/.test(password) },
    { text: "Содержит цифры", met: /\d/.test(password) },
  ]

  const validateForm = () => {
    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
      terms?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "Введите имя"
    } else if (name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа"
    }

    if (!email) {
      newErrors.email = "Введите email"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Введите корректный email"
    }

    if (!password) {
      newErrors.password = "Введите пароль"
    } else if (password.length < 8) {
      newErrors.password = "Пароль должен содержать минимум 8 символов"
    } else if (!/[a-zA-Zа-яА-Я]/.test(password)) {
      newErrors.password = "Пароль должен содержать буквы"
    } else if (!/\d/.test(password)) {
      newErrors.password = "Пароль должен содержать цифры"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Подтвердите пароль"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают"
    }

    if (!agreeToTerms) {
      newErrors.terms = "Необходимо согласиться с условиями"
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

    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false)
      setSuccess("Регистрация успешна! Проверьте email для подтверждения.")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 bg-[#F3F4F6] flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-medium mb-2" style={{ color: "#3D6D56" }}>
              Создать аккаунт
            </h1>
            <p className="text-[#C7C7C7]">Присоединяйтесь к FastBuy</p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Полное имя
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors({ ...errors, name: undefined })
                  }}
                  className={`h-12 pl-12 bg-white border-[#F3F4F6] rounded-xl placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
                    errors.name ? "border-[#CD6060] focus:ring-[#CD6060]" : ""
                  }`}
                  required
                />
              </div>
              {errors.name && <p className="text-[#CD6060] text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
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
                  className={`h-12 pl-12 bg-white border-[#F3F4F6] rounded-xl placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
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
                  placeholder="Создайте пароль"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  className={`h-12 pl-12 pr-12 bg-white border-[#F3F4F6] rounded-xl placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
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
                <div className="space-y-1 mt-2">
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
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
                  }}
                  className={`h-12 pl-12 pr-12 bg-white border-[#F3F4F6] rounded-xl placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
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

            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => {
                    setAgreeToTerms(checked as boolean)
                    if (errors.terms) setErrors({ ...errors, terms: undefined })
                  }}
                  className="mt-1 data-[state=checked]:bg-[#3D6D56] data-[state=checked]:border-[#3D6D56]"
                />
                <Label htmlFor="terms" className="text-sm text-[#C7C7C7] leading-relaxed cursor-pointer">
                  Я согласен с{" "}
                  <Link href="#" className="hover:underline" style={{ color: "#3D6D56" }}>
                    условиями использования
                  </Link>{" "}
                  и{" "}
                  <Link href="#" className="hover:underline" style={{ color: "#3D6D56" }}>
                    политикой конфиденциальности
                  </Link>
                </Label>
              </div>
              {errors.terms && <p className="text-[#CD6060] text-sm">{errors.terms}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-white font-medium rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: "#3D6D56" }}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Регистрация...</span>
                </div>
              ) : (
                "Зарегистрироваться"
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-[#C7C7C7]">
              Уже есть аккаунт?{" "}
              <Link
                href="/login"
                className="font-medium hover:underline transition-colors"
                style={{ color: "#3D6D56" }}
              >
                Войти
              </Link>
            </p>
            <div className="pt-4 border-t border-[#F3F4F6]">
              <Link href="/admin/signup" className="text-sm text-[#C7C7C7] hover:text-[#3D6D56] transition-colors">
                Регистрация для организаторов
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
