"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ArrowLeft, CreditCard, User, Info, Ticket } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

// Mock data - в реальном приложении это будет загружаться из API
const matchData = {
  1: {
    homeTeam: "Спартак",
    awayTeam: "ЦСКА",
    date: "2024-02-15",
    time: "19:00",
    venue: "Открытие Арена",
    sectors: [
      { id: "vip", name: "VIP", price: 8000, available: true, rows: [1, 2, 3, 4, 5] },
      { id: "premium", name: "Премиум", price: 5000, available: true, rows: [1, 2, 3, 4, 5, 6, 7, 8] },
      { id: "standard", name: "Стандарт", price: 2500, available: true, rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { id: "fan", name: "Фан-сектор", price: 1500, available: false, rows: [1, 2, 3, 4, 5, 6] },
    ],
  },
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const [selectedSector, setSelectedSector] = useState("")
  const [selectedRow, setSelectedRow] = useState("")
  const [ticketCount, setTicketCount] = useState("1")
  const [agreed, setAgreed] = useState(false)
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")

  const match = matchData[params.id as keyof typeof matchData]

  if (!match) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Матч не найден</h1>
          <Link href="/matches">
            <Button className="text-white rounded-xl" style={{ backgroundColor: "#3D6D56" }}>
              Вернуться к матчам
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const selectedSectorData = match.sectors.find((s) => s.id === selectedSector)
  const totalPrice = selectedSectorData ? selectedSectorData.price * Number.parseInt(ticketCount) : 0

  // Сброс выбранного ряда при смене сектора
  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId)
    setSelectedRow("") // Сбрасываем ряд при смене сектора
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика отправки брони
    alert("Бронь успешно оформлена! Мы свяжемся с вами, когда начнется официальная продажа.")
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-[#F3F4F6]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/matches"
              className="flex items-center space-x-3 text-[#3D6D56] hover:text-[#438D69] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Назад к матчам</span>
            </Link>
            <Link href="/" className="flex items-center">
              <Image src="/fastbuy-logo.png" alt="FastBuy" width={120} height={32} className="h-8 w-auto" />
            </Link>
            <Button variant="ghost" className="text-[#3D6D56] hover:text-[#438D69]" asChild>
              <Link href="/profile">
                <User className="w-4 h-4 mr-2" />
                Кабинет
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Match Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-0 h-full shadow-sm">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="space-y-6 flex-grow">
                  <div>
                    <Badge className="bg-[#3D6D56] text-white border-0 mb-4">Предварительная бронь</Badge>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{match.homeTeam}</h2>
                    <h2 className="text-xl font-bold text-gray-900">{match.awayTeam}</h2>
                  </div>

                  <div className="space-y-4 pt-4 flex-grow">
                    <div className="flex items-center text-[#C7C7C7]">
                      <Calendar className="w-4 h-4 mr-3" />
                      <span className="text-sm">
                        {new Date(match.date).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-[#C7C7C7]">
                      <Clock className="w-4 h-4 mr-3" />
                      <span className="text-sm">{match.time}</span>
                    </div>
                    <div className="flex items-center text-[#C7C7C7]">
                      <MapPin className="w-4 h-4 mr-3" />
                      <span className="text-sm">{match.venue}</span>
                    </div>
                  </div>

                  {/* Добавляем пустое пространство для растяжения карточки */}
                  <div className="flex-grow min-h-[100px]"></div>

                  {/* Итого внизу */}
                  {selectedSectorData && (
                    <div className="pt-6 border-t border-[#F3F4F6]">
                      <h4 className="font-semibold text-gray-900 mb-2">Итого к бронированию:</h4>
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#C7C7C7]">Сектор:</span>
                          <span className="font-medium">{selectedSectorData.name}</span>
                        </div>
                        {selectedRow && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#C7C7C7]">Ряд:</span>
                            <span className="font-medium">{selectedRow}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#C7C7C7]">Количество:</span>
                          <span className="font-medium">{ticketCount}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#C7C7C7]">Итого:</span>
                        <span className="text-lg font-bold text-gray-900">{totalPrice}₽</span>
                      </div>
                      <p className="text-xs text-[#C7C7C7] mt-2">* Оплата после начала продаж</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Выбор билетов */}
              <Card className="bg-white border-0 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Ticket className="w-5 h-5" style={{ color: "#3D6D56" }} />
                    <h3 className="text-xl font-semibold text-gray-900">Выбор билетов</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="sector" className="text-gray-700 font-medium">
                        Выберите сектор
                      </Label>
                      <Select value={selectedSector} onValueChange={handleSectorChange}>
                        <SelectTrigger className="h-12 bg-[#F3F4F6] border-0 rounded-xl focus:ring-2 focus:ring-[#3D6D56]">
                          <SelectValue placeholder="Выберите сектор" />
                        </SelectTrigger>
                        <SelectContent>
                          {match.sectors.map((sector) => (
                            <SelectItem key={sector.id} value={sector.id} disabled={!sector.available}>
                              <div className="flex items-center justify-between w-full">
                                <span>{sector.name}</span>
                                <span className="ml-4">{sector.price}₽</span>
                                {!sector.available && (
                                  <Badge variant="secondary" className="ml-2 bg-[#C7C7C7] text-white">
                                    Недоступно
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="row" className="text-gray-700 font-medium">
                        Выберите ряд
                      </Label>
                      <Select value={selectedRow} onValueChange={setSelectedRow} disabled={!selectedSector}>
                        <SelectTrigger className="h-12 bg-[#F3F4F6] border-0 rounded-xl focus:ring-2 focus:ring-[#3D6D56]">
                          <SelectValue placeholder="Выберите ряд" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedSectorData?.rows.map((row) => (
                            <SelectItem key={row} value={row.toString()}>
                              Ряд {row}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="tickets" className="text-gray-700 font-medium">
                        Количество билетов
                      </Label>
                      <Select value={ticketCount} onValueChange={setTicketCount}>
                        <SelectTrigger className="h-12 bg-[#F3F4F6] border-0 rounded-xl focus:ring-2 focus:ring-[#3D6D56]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "билет" : num < 5 ? "билета" : "билетов"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Личные данные */}
              <Card className="bg-white border-0 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <User className="w-5 h-5" style={{ color: "#3D6D56" }} />
                    <h3 className="text-xl font-semibold text-gray-900">Личные данные</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Имя
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ваше имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 bg-[#F3F4F6] border-0 rounded-xl focus:ring-2 focus:ring-[#3D6D56]"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="surname" className="text-gray-700 font-medium">
                        Фамилия
                      </Label>
                      <Input
                        id="surname"
                        placeholder="Ваша фамилия"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="h-12 bg-[#F3F4F6] border-0 rounded-xl focus:ring-2 focus:ring-[#3D6D56]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-[#F3F4F6] border-0 rounded-xl focus:ring-2 focus:ring-[#3D6D56]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Важная информация */}
              <Card className="bg-[#F3F4F6] border-0 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Info className="w-5 h-5" style={{ color: "#3D6D56" }} />
                    <h3 className="text-lg font-semibold text-gray-900">Важная информация</h3>
                  </div>
                  <div className="space-y-3 text-sm text-[#C7C7C7]">
                    <div className="flex items-start space-x-2">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: "#3D6D56" }}
                      ></div>
                      <p>Оплата происходит только после начала официальных продаж</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: "#3D6D56" }}
                      ></div>
                      <p>Вы получите уведомление за 24 часа до начала продаж</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: "#3D6D56" }}
                      ></div>
                      <p>Бронь действительна в течение 48 часов с момента открытия продаж</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Согласие и кнопка */}
              <Card className="bg-white border-0 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={agreed}
                        onCheckedChange={(checked) => setAgreed(checked as boolean)}
                        className="mt-1 data-[state=checked]:bg-[#3D6D56] data-[state=checked]:border-[#3D6D56]"
                      />
                      <Label htmlFor="terms" className="text-sm text-[#C7C7C7] leading-relaxed">
                        Я согласен с{" "}
                        <Link href="#" className="hover:underline" style={{ color: "#3D6D56" }}>
                          условиями бронирования
                        </Link>{" "}
                        и{" "}
                        <Link href="#" className="hover:underline" style={{ color: "#3D6D56" }}>
                          политикой конфиденциальности
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-white text-lg font-medium rounded-xl transition-all hover:shadow-lg"
                      style={{ backgroundColor: "#3D6D56" }}
                      disabled={!selectedSector || !agreed}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Забронировать билеты
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
