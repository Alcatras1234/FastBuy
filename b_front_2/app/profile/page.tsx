"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Calendar, Bell, Shield, Download, X, Search, Filter, SortAsc, SortDesc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"

const userData = {
  firstName: "Гордей",
  lastName: "Зуев",
  email: "gordey.zuev@gmail.com",
  registrationDate: "15.04.2024",
  daysInService: 39,
  lastLogin: "12.05.2024",
  ip: "192.168.1.***",
}

// Обновим массив userBookings, добавив больше матчей и правильные статусы
const userBookings = [
  {
    id: 1,
    homeTeam: "Локомотив",
    awayTeam: "Спартак М",
    date: "2025-06-08",
    time: "18:00",
    venue: "Москва, Лужники Арена",
    city: "Москва",
    sector: "A",
    row: 2,
    seat: 25,
    price: 1900,
    status: "purchased", // purchased, booked, completed
    isFuture: true,
    bookingDate: "2024-05-01",
  },
  {
    id: 2,
    homeTeam: "ЦСКА",
    awayTeam: "Краснодар",
    date: "2025-06-15",
    time: "19:30",
    venue: "Москва, ВЭБ Арена",
    city: "Москва",
    sector: "B",
    row: 4,
    seat: 16,
    price: 2300,
    status: "booked",
    isFuture: true,
    bookingDate: "2024-05-02",
  },
  {
    id: 3,
    homeTeam: "Зенит",
    awayTeam: "Динамо",
    date: "2024-05-01",
    time: "17:00",
    venue: "Санкт-Петербург, Газпром Арена",
    city: "Санкт-Петербург",
    sector: "C",
    row: 8,
    seat: 42,
    price: 2100,
    status: "completed",
    isFuture: false,
    bookingDate: "2024-04-01",
  },
  {
    id: 4,
    homeTeam: "Спартак М",
    awayTeam: "Ростов",
    date: "2024-04-15",
    time: "16:00",
    venue: "Москва, Открытие Банк Арена",
    city: "Москва",
    sector: "D",
    row: 5,
    seat: 18,
    price: 1800,
    status: "completed",
    isFuture: false,
    bookingDate: "2024-03-15",
  },
  {
    id: 5,
    homeTeam: "Рубин",
    awayTeam: "Ахмат",
    date: "2024-03-28",
    time: "18:30",
    venue: "Казань, Ак Барс Арена",
    city: "Казань",
    sector: "A",
    row: 3,
    seat: 12,
    price: 1500,
    status: "completed",
    isFuture: false,
    bookingDate: "2024-02-28",
  },
  {
    id: 6,
    homeTeam: "Локомотив",
    awayTeam: "Крылья Советов",
    date: "2024-03-10",
    time: "15:00",
    venue: "Москва, РЖД Арена",
    city: "Москва",
    sector: "B",
    row: 7,
    seat: 22,
    price: 1700,
    status: "completed",
    isFuture: false,
    bookingDate: "2024-02-10",
  },
  {
    id: 7,
    homeTeam: "Краснодар",
    awayTeam: "Зенит",
    date: "2025-07-20",
    time: "20:00",
    venue: "Краснодар, Краснодар Стадион",
    city: "Краснодар",
    sector: "VIP",
    row: 1,
    seat: 10,
    price: 3500,
    status: "booked",
    isFuture: true,
    bookingDate: "2024-05-10",
  },
]

const cities = ["Все города", "Москва", "Санкт-Петербург", "Казань", "Краснодар"]
const statuses = [
  { value: "all", label: "Все статусы" },
  { value: "purchased", label: "Куплены" },
  { value: "booked", label: "Забронированы" },
  { value: "completed", label: "Прошедшие" },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("bookings")
  const [firstName, setFirstName] = useState(userData.firstName)
  const [lastName, setLastName] = useState(userData.lastName)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // Состояния для фильтрации и сортировки броней
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("Все города")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const totalSpent = userBookings.reduce((sum, booking) => sum + booking.price, 0)
  const totalBookings = userBookings.length

  // Фильтрация и сортировка броней
  const filteredAndSortedBookings = useMemo(() => {
    const filtered = userBookings.filter((booking) => {
      // Поиск по командам и месту проведения
      const matchesSearch =
        booking.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.venue.toLowerCase().includes(searchTerm.toLowerCase())

      // Фильтр по городу
      const matchesCity = cityFilter === "Все города" || booking.city === cityFilter

      // Фильтр по статусу
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter

      return matchesSearch && matchesCity && matchesStatus
    })

    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "team":
          comparison = a.homeTeam.localeCompare(b.homeTeam)
          break
        case "city":
          comparison = a.city.localeCompare(b.city)
          break
        case "bookingDate":
          comparison = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchTerm, cityFilter, statusFilter, sortBy, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCityFilter("Все города")
    setStatusFilter("all")
    setSortBy("date")
    setSortOrder("desc")
  }

  const handleProfileSave = () => {
    // Здесь будет логика сохранения изменений профиля
    setIsEditingProfile(false)
    alert("Профиль успешно обновлен")
  }

  const handlePasswordChange = () => {
    // Здесь будет логика изменения пароля
    if (newPassword !== confirmPassword) {
      alert("Пароли не совпадают")
      return
    }
    setIsChangingPassword(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    alert("Пароль успешно изменен")
  }

  const handleDeleteAccount = () => {
    // Здесь будет логика удаления аккаунта
    alert("Аккаунт успешно удален")
    window.location.href = "/login"
  }

  const handleCancelBooking = (bookingId: number) => {
    // Здесь будет логика отмены брони
    alert(`Бронь #${bookingId} отменена`)
  }

  const handleDownloadTicket = (bookingId: number) => {
    // Здесь будет логика скачивания билета
    alert(`Скачивание билета #${bookingId}`)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "purchased":
        return "Куплен"
      case "booked":
        return "Забронирован"
      case "completed":
        return "Прошел"
      default:
        return "Неизвестно"
    }
  }

  const getStatusBadge = (status: string, isFuture: boolean) => {
    if (!isFuture) {
      return <Badge className="bg-[#C7C7C7] text-white">Прошел</Badge>
    }

    switch (status) {
      case "purchased":
        return <Badge className="bg-[#3D6D56] text-white">Куплен</Badge>
      case "booked":
        return <Badge className="bg-[#F0BE6A] text-white">Забронирован</Badge>
      default:
        return <Badge className="bg-[#C7C7C7] text-white">Неизвестно</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-[#F3F4F6]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-0 h-full shadow-sm">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="space-y-6 flex-grow">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{userData.firstName}</h3>
                    <h3 className="text-xl font-semibold text-gray-900">{userData.lastName}</h3>
                    <p className="text-[#C7C7C7] mt-2">{userData.email}</p>
                  </div>

                  <div className="space-y-4 pt-4 flex-grow">
                    <div className="text-sm text-[#C7C7C7]">
                      <span>Всего броней: </span>
                      <span className="font-medium">{totalBookings}</span>
                    </div>
                    <div className="text-sm text-[#C7C7C7]">
                      <span>Потрачено: </span>
                      <span className="font-medium">{totalSpent} ₽</span>
                    </div>
                    <div className="text-sm text-[#C7C7C7]">
                      <span>В сервисе: </span>
                      <span className="font-medium">{userData.daysInService} дней</span>
                    </div>
                  </div>

                  {/* Добавляем пустое пространство для растяжения карточки */}
                  <div className="flex-grow min-h-[200px]"></div>

                  {/* Дополнительная информация внизу */}
                  <div className="pt-6 border-t border-[#F3F4F6]">
                    <p className="text-sm text-[#C7C7C7]">Последний вход: {userData.lastLogin}</p>
                    <p className="text-sm text-[#C7C7C7] mt-1">IP: {userData.ip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs - теперь на всю ширину */}
            <div className="flex w-full mb-8">
              <Button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 py-3 rounded-xl font-medium ${
                  activeTab === "bookings" ? "text-white" : "bg-[#F3F4F6] text-[#C7C7C7] hover:bg-[#F3F4F6]/80"
                }`}
                style={{
                  backgroundColor: activeTab === "bookings" ? "#3D6D56" : undefined,
                }}
              >
                Мои брони
              </Button>
              <Button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-3 rounded-xl font-medium mx-4 ${
                  activeTab === "profile" ? "text-white" : "bg-[#F3F4F6] text-[#C7C7C7] hover:bg-[#F3F4F6]/80"
                }`}
                style={{
                  backgroundColor: activeTab === "profile" ? "#3D6D56" : undefined,
                }}
              >
                Профиль
              </Button>
              <Button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-3 rounded-xl font-medium ${
                  activeTab === "settings" ? "text-white" : "bg-[#F3F4F6] text-[#C7C7C7] hover:bg-[#F3F4F6]/80"
                }`}
                style={{
                  backgroundColor: activeTab === "settings" ? "#3D6D56" : undefined,
                }}
              >
                Настройки
              </Button>
            </div>

            {/* Bookings Content */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Input
                    placeholder="Поиск по командам или месту проведения..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 pl-4 pr-12 bg-white border-[#F3F4F6] rounded-xl shadow-sm focus:ring-2 focus:border-transparent focus:ring-[#3D6D56]"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
                </div>

                {/* Filters and Sorting */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="h-10 bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
                      <SelectValue placeholder="Город..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
                      <SelectValue placeholder="Статус..." />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10 bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
                      <SelectValue placeholder="Сортировка..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">По дате матча</SelectItem>
                      <SelectItem value="bookingDate">По дате брони</SelectItem>
                      <SelectItem value="team">По команде</SelectItem>
                      <SelectItem value="city">По городу</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={toggleSortOrder}
                    variant="outline"
                    className="h-10 border-[#F3F4F6] text-[#3D6D56] hover:bg-[#3D6D56]/10 rounded-xl"
                  >
                    {sortOrder === "asc" ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                    {sortOrder === "asc" ? "По возрастанию" : "По убыванию"}
                  </Button>

                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="h-10 border-[#CD6060]/20 text-[#CD6060] hover:bg-[#CD6060]/10 rounded-xl"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Сбросить
                  </Button>
                </div>

                {/* Results Summary */}
                <div className="flex justify-between items-center">
                  <p className="text-[#C7C7C7]">
                    Найдено {filteredAndSortedBookings.length} из {userBookings.length} броней
                  </p>
                </div>

                {/* Bookings List */}
                {filteredAndSortedBookings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAndSortedBookings.map((booking) => (
                      <Card
                        key={booking.id}
                        className="border-0 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white shadow-sm"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="space-y-3 mb-4 md:mb-0 flex-grow">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {booking.homeTeam} - {booking.awayTeam}
                                </h3>
                                {getStatusBadge(booking.status, booking.isFuture)}
                              </div>
                              <div className="space-y-1 text-[#C7C7C7]">
                                <p className="text-sm">
                                  {formatDate(booking.date)}, {booking.time}
                                </p>
                                <p className="text-sm">{booking.venue}</p>
                              </div>
                              <div className="text-sm text-gray-700 space-y-1">
                                <p>
                                  Сектор {booking.sector}, ряд {booking.row}, место {booking.seat}
                                </p>
                                <p className="font-semibold" style={{ color: "#3D6D56" }}>
                                  {booking.price} ₽
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-2 md:ml-4">
                              {booking.status === "purchased" && booking.isFuture && (
                                <Button
                                  onClick={() => handleDownloadTicket(booking.id)}
                                  className="h-10 text-white text-sm rounded-xl"
                                  style={{ backgroundColor: "#3D6D56" }}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Скачать билет
                                </Button>
                              )}

                              {booking.status === "booked" && booking.isFuture && (
                                <Button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  variant="outline"
                                  className="h-10 text-[#CD6060] border-[#CD6060]/20 hover:bg-[#CD6060]/10 text-sm rounded-xl"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Отменить бронь
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-[#C7C7C7]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Брони не найдены</h3>
                      <p className="text-[#C7C7C7] mb-6">Попробуйте изменить параметры поиска или фильтры</p>
                      <Button
                        onClick={clearFilters}
                        className="text-white rounded-xl"
                        style={{ backgroundColor: "#3D6D56" }}
                      >
                        Сбросить фильтры
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Content */}
            {activeTab === "profile" && (
              <Card className="bg-white border-0 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Информация профиля</h3>
                    {!isEditingProfile ? (
                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        className="rounded-xl text-white"
                        style={{ backgroundColor: "#3D6D56" }}
                      >
                        Редактировать
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setIsEditingProfile(false)}
                          variant="outline"
                          className="rounded-xl border-[#C7C7C7] text-[#C7C7C7]"
                        >
                          Отмена
                        </Button>
                        <Button
                          onClick={handleProfileSave}
                          className="rounded-xl text-white"
                          style={{ backgroundColor: "#3D6D56" }}
                        >
                          Сохранить
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-[#C7C7C7]" />
                          <Label htmlFor="firstName" className="text-gray-700">
                            Имя
                          </Label>
                        </div>
                        {isEditingProfile ? (
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-12 bg-[#F3F4F6] border-0 rounded-xl"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">{firstName}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-[#C7C7C7]" />
                          <Label htmlFor="lastName" className="text-gray-700">
                            Фамилия
                          </Label>
                        </div>
                        {isEditingProfile ? (
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="h-12 bg-[#F3F4F6] border-0 rounded-xl"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">{lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-[#C7C7C7]" />
                        <Label htmlFor="email" className="text-gray-700">
                          Электронная почта
                        </Label>
                      </div>
                      <p className="text-gray-800 font-medium">{userData.email}</p>
                      <p className="text-xs text-[#C7C7C7]">Электронная почта не может быть изменена</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-[#C7C7C7]" />
                        <Label className="text-gray-700">Дата регистрации</Label>
                      </div>
                      <p className="text-gray-800 font-medium">{userData.registrationDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings Content */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Настройки уведомлений */}
                <Card className="bg-white border-0 rounded-2xl shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Bell className="w-5 h-5 text-[#C7C7C7]" />
                      <h3 className="text-xl font-semibold">Настройки уведомлений</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Уведомления по электронной почте</p>
                          <p className="text-sm text-[#C7C7C7]">Получать уведомления о бронированиях и новостях</p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                          className="data-[state=checked]:bg-[#3D6D56]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Настройки безопасности */}
                <Card className="bg-white border-0 rounded-2xl shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Shield className="w-5 h-5 text-[#C7C7C7]" />
                      <h3 className="text-xl font-semibold">Безопасность</h3>
                    </div>

                    {/* Изменение пароля */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-medium text-gray-800">Изменение пароля</p>
                          <p className="text-sm text-[#C7C7C7]">Обновите свой пароль для повышения безопасности</p>
                        </div>
                        {!isChangingPassword ? (
                          <Button
                            onClick={() => setIsChangingPassword(true)}
                            className="rounded-xl text-white"
                            style={{ backgroundColor: "#3D6D56" }}
                          >
                            Изменить
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => {
                                setIsChangingPassword(false)
                                setCurrentPassword("")
                                setNewPassword("")
                                setConfirmPassword("")
                              }}
                              variant="outline"
                              className="rounded-xl border-[#C7C7C7] text-[#C7C7C7]"
                            >
                              Отмена
                            </Button>
                            <Button
                              onClick={handlePasswordChange}
                              className="rounded-xl text-white"
                              style={{ backgroundColor: "#3D6D56" }}
                            >
                              Сохранить
                            </Button>
                          </div>
                        )}
                      </div>

                      {isChangingPassword && (
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Текущий пароль</Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="h-12 bg-[#F3F4F6] border-0 rounded-xl"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">Новый пароль</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="h-12 bg-[#F3F4F6] border-0 rounded-xl"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="h-12 bg-[#F3F4F6] border-0 rounded-xl"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Удаление аккаунта */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-medium text-gray-800">Удаление аккаунта</p>
                          <p className="text-sm text-[#C7C7C7]">Удаление аккаунта приведет к потере всех данных</p>
                        </div>
                        {!isDeletingAccount ? (
                          <Button
                            onClick={() => setIsDeletingAccount(true)}
                            variant="destructive"
                            className="rounded-xl bg-[#CD6060] hover:bg-[#CD6060]/90"
                          >
                            Удалить
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => setIsDeletingAccount(false)}
                              variant="outline"
                              className="rounded-xl border-[#C7C7C7] text-[#C7C7C7]"
                            >
                              Отмена
                            </Button>
                            <Button
                              onClick={handleDeleteAccount}
                              variant="destructive"
                              className="rounded-xl bg-[#CD6060] hover:bg-[#CD6060]/90"
                            >
                              Подтвердить
                            </Button>
                          </div>
                        )}
                      </div>

                      {isDeletingAccount && (
                        <div className="mt-4 p-4 bg-[#CD6060]/10 border border-[#CD6060]/20 rounded-xl">
                          <p className="text-[#CD6060] font-medium">Внимание! Это действие необратимо.</p>
                          <p className="text-[#CD6060] text-sm mt-1">
                            После удаления аккаунта все ваши данные, включая историю бронирований, будут удалены.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
