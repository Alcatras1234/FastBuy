"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Check,
  X,
  Building,
  Phone,
  FileText,
} from "lucide-react"

export default function AdminSignupPage() {
  const [organizationName, setOrganizationName] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [description, setDescription] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    organizationName?: string
    contactName?: string
    email?: string
    phone?: string
    password?: string
    confirmPassword?: string
    description?: string
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
      organizationName?: string
      contactName?: string
      email?: string
      phone?: string
      password?: string
      confirmPassword?: string
      description?: string
      terms?: string
    } = {}

    if (!organizationName.trim()) {
      newErrors.organizationName = "Введите название организации"
    } else if (organizationName.trim().length < 3) {
      newErrors.organizationName = "Название должно содержать минимум 3 символа"
    }

    if (!contactName.trim()) {
      newErrors.contactName = "Введите контактное лицо"
    } else if (contactName.trim().length < 2) {
      newErrors.contactName = "Имя должно содержать минимум 2 символа"
    }

    if (!email) {
      newErrors.email = "Введите email"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Введите корректный email"
    }

    if (!phone) {
      newErrors.phone = "Введите номер телефона"
    } else if (!/^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Введите корректный номер телефона"
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

    if (!description.trim()) {
      newErrors.description = "Опишите вашу организацию"
    } else if (description.trim().length < 20) {
      newErrors.description = "Описание должно содержать минимум 20 символов"
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
      setSuccess("Заявка отправлена! Мы рассмотрим её в течение 2-3 рабочих дней и свяжемся с вами.")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 bg-[#F3F4F6] flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Badge className="bg-[#438D69] text-white px-4 py-2">
                <Building className="w-4 h-4 mr-2" />
                Организатор
              </Badge>
            </div>
            <h1 className="text-4xl font-medium mb-2" style={{ color: "#3D6D56" }}>
              Заявка на регистрацию
            </h1>
            <p className="text-[#C7C7C7]">Станьте партнером FastBuy</p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-gray-700 font-medium">
                Название организации
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                <Input
                  id="organizationName"
                  type="text"
                  placeholder="ООО Спорт-Ивент"
                  value={organizationName}
                  onChange={(e) => {
                    setOrganizationName(e.target.value)
                    if (errors.organizationName) setErrors({ ...errors, organizationName: undefined })
                  }}
                  className={`h-12 pl-12 bg-white border-[#F3F4F6] rounded-xl placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
                    errors.organizationName ? "border-[#CD6060] focus:ring-[#CD6060]" : ""
                  }`}
                  required
                />
              </div>
              {errors.organizationName && <p className="text-[#CD6060] text-sm">{errors.organizationName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-gray-700 font-medium">
                Контактное лицо
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                <Input
                  id="contactName"
                  type="text"
                  placeholder="Иван Иванов"
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value)
                    if (errors.contactName) setErrors({ ...errors, contactName: undefined })
                  }}
                  className={`h-12 pl-12 bg-white border-[#F3F4F6] rounded-xl placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
                    errors.contactName ? "border-[#CD6060] focus:ring-[#CD6060]" : ""
                  }`}
                  required
                />
              </div>
              {errors.contactName && <p className="text-[#CD6060] text-sm">{errors.contactName}</p>}
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
                  placeholder="contact@company.com"
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
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Телефон
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (495) 123-45-67"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (errors.phone) setErrors({ ...errors, phone: undefined })
                  }}
                  className={`h-12 pl-12 bg-white border-[#F3F4F6] rounded-xl placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent ${
                    errors.phone ? "border-[#CD6060] focus:ring-[#CD6060]" : ""
                  }`}
                  required
                />
              </div>
              {errors.phone && <p className="text-[#CD6060] text-sm">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">
                Описание деятельности
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-[#C7C7C7]" />
                <Textarea
                  id="description"
                  placeholder="Опишите вашу организацию и виды мероприятий, которые вы проводите..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (errors.description) setErrors({ ...errors, description: undefined })
                  }}
                  className={`min-h-[80px] pl-12 bg-white border-[#F3F4F6] rounded-xl placeholder:text-[#C7C7C7] focus:ring-2 focus:ring-[#3D6D56] focus:border-transparent resize-none ${
                    errors.description ? "border-[#CD6060] focus:ring-[#CD6060]" : ""
                  }`}
                  required
                />
              </div>
              {errors.description && <p className="text-[#CD6060] text-sm">{errors.description}</p>}
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
                    условиями партнерства
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
                  <span>Отправка заявки...</span>
                </div>
              ) : (
                "Подать заявку"
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-[#C7C7C7]">
              Уже есть аккаунт?{" "}
              <Link
                href="/admin/login"
                className="font-medium hover:underline transition-colors"
                style={{ color: "#3D6D56" }}
              >
                Войти
              </Link>
            </p>
            <div className="pt-4 border-t border-[#F3F4F6]">
              <Link href="/signup" className="text-sm text-[#C7C7C7] hover:text-[#3D6D56] transition-colors">
                Регистрация для пользователей
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
