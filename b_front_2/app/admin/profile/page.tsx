"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Calendar,
  Bell,
  Shield,
  Building,
  Phone,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"

// Данные организатора
const organizerData = {
  firstName: "Алексей",
  lastName: "Петров",
  email: "alexey.petrov@fastbuy.ru",
  organization: "ООО Спорт-Ивент",
  phone: "+7 (495) 123-45-67",
  bankDetails: "АО Сбербанк, р/с 40702810123450000123",
  registrationDate: "10.01.2023",
  daysInService: 480,
  lastLogin: "12.05.2024",
  ip: "192.168.1.***",
}

// Данные о матчах (убрал черновики)
const matchesData = [
  {
    id: 1,
    homeTeam: "Локомотив",
    awayTeam: "Спартак М",
    date: "2025-06-08",
    time: "18:00",
    venue: "Москва, Лужники Арена",
    city: "Москва",
    totalSeats: 500,
    bookedSeats: 150,
    status: "active", // active, completed
    createdDate: "2024-05-01",
  },
  {
    id: 2,
    homeTeam: "ЦСКА",
    awayTeam: "Краснодар",
    date: "2025-06-15",
    time: "19:30",
    venue: "Москва, ВЭБ Арена",
    city: "Москва",
    totalSeats: 400,
    bookedSeats: 120,
    status: "active",
    createdDate: "2024-05-02",
  },
  {
    id: 3,
    homeTeam: "Зенит",
    awayTeam: "Динамо",
    date: "2024-05-01",
    time: "17:00",
    venue: "Санкт-Петербург, Газпром Арена",
    city: "Санкт-Петербург",
    totalSeats: 600,
    bookedSeats: 0,
    status: "completed",
    createdDate: "2024-04-01",
  },
  {
    id: 4,
    homeTeam: "Спартак М",
    awayTeam: "Ростов",
    date: "2024-04-15",
    time: "16:00",
    venue: "Москва, Открытие Банк Арена",
    city: "Москва",
    totalSeats: 450,
    bookedSeats: 0,
    status: "completed",
    createdDate: "2024-03-15",
  },
  {
    id: 5,
    homeTeam: "Рубин",
    awayTeam: "Ахмат",
    date: "2024-03-28",
    time: "18:30",
    venue: "Казань, Ак Барс Арена",
    city: "Казань",
    totalSeats: 350,
    bookedSeats: 0,
    status: "completed",
    createdDate: "2024-02-28",
  },
]

// Данные о бронированиях для конкретного матча
const bookingsData = [
  {
    id: 1,
    userName: "Иван Иванов",
    userEmail: "ivan@example.com",
    sector: "VIP",
    row: 2,
    seat: 15,
    price: 8000,
    status: "booked",
    bookingDate: "01.05.2024",
  },
  {
    id: 2,
    userName: "Петр Петров",
    userEmail: "petr@example.com",
    sector: "Премиум",
    row: 4,
    seat: 10,
    price: 5000,
    status: "booked",
    bookingDate: "02.05.2024",
  },
  {
    id: 3,
    userName: "Анна Сидорова",
    userEmail: "anna@example.com",
    sector: "Стандарт",
    row: 7,
    seat: 22,
    price: 2500,
    status: "booked",
    bookingDate: "03.05.2024",
  },
]

const cities = ["Все города", "Москва", "Санкт-Петербург", "Казань", "Краснодар"]
const statuses = [
  { value: "all", label: "Все статусы" },
  { value: "active", label: "Активные" },
  { value: "completed", label: "Завершенные" },
]

export default function OrganizerProfilePage() {
  const [activeTab, setActiveTab] = useState("matches")
  const [firstName, setFirstName] = useState(organizerData.firstName)
  const [lastName, setLastName] = useState(organizerData.lastName)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // Состояния для управления матчами
  const [isCreatingMatch, setIsCreatingMatch] = useState(false)
  const [isEditingMatch, setIsEditingMatch] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const [isViewingBookings, setIsViewingBookings] = useState(false)

  // Состояния для фильтрации и сортировки матчей
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("Все города")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Состояния для формы создания/редактирования матча
  const [matchForm, setMatchForm] = useState({
    homeTeam: "",
    awayTeam: "",
    date: "",
    time: "",
    venue: "",
    sectors: [] as { id: string; name: string; price: number; rows: string; seats: string }[],
  })

  // Фильтрация и сортировка матчей
  const filteredAndSortedMatches = useMemo(() => {
    const filtered = matchesData.filter((match) => {
      // Поиск по командам и месту проведения
      const matchesSearch =
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.venue.toLowerCase().includes(searchTerm.toLowerCase())

      // Фильтр по городу
      const matchesCity = cityFilter === "Все города" || match.city === cityFilter

      // Фильтр по статусу
      const matchesStatus = statusFilter === "all" || match.status === statusFilter

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
        case "venue":
          comparison = a.venue.localeCompare(b.venue)
          break
        case "bookings":
          comparison = a.bookedSeats - b.bookedSeats
          break
        case "createdDate":
          comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          break
        case "city":
          comparison = a.city.localeCompare(b.city)
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
    setSortOrder("asc")
  }

  // Обработчики для профиля
  const handleProfileSave = () => {
    setIsEditingProfile(false)
    alert("Профиль успешно обновлен")
  }

  const handlePasswordChange = () => {
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
    alert("Аккаунт успешно удален")
    window.location.href = "/login"
  }

  // Обработчики для управления матчами
  const handleCreateMatch = () => {
    setIsCreatingMatch(true)
    setMatchForm({
      homeTeam: "",
      awayTeam: "",
      date: "",
      time: "",
      venue: "",
      sectors: [],
    })
  }

  const handleEditMatch = (matchId: number) => {
    const match = matchesData.find((m) => m.id === matchId)
    if (match) {
      setSelectedMatch(matchId)
      setIsEditingMatch(true)
      // В реальном приложении здесь бы загружались данные о матче с сервера
      setMatchForm({
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date: match.date,
        time: match.time,
        venue: match.venue,
        sectors: [], // Загружаем пустой массив секторов
      })
    }
  }

  const handleViewBookings = (matchId: number) => {
    setSelectedMatch(matchId)
    setIsViewingBookings(true)
  }

  const handleDeleteMatch = (matchId: number) => {
    if (confirm(`Вы уверены, что хотите удалить матч #${matchId}?`)) {
      // В реальном приложении здесь был бы запрос на удаление
      alert(`Матч #${matchId} удален`)
    }
  }

  const handleSaveMatch = () => {
    // В реальном приложении здесь был бы запрос на сохранение
    if (isCreatingMatch) {
      alert("Матч успешно создан")
      setIsCreatingMatch(false)
    } else if (isEditingMatch) {
      alert(`Матч #${selectedMatch} успешно обновлен`)
      setIsEditingMatch(false)
    }
    setSelectedMatch(null)
  }

  const handleAddSector = () => {
    setMatchForm({
      ...matchForm,
      sectors: [
        ...matchForm.sectors,
        { id: `sector-${matchForm.sectors.length + 1}`, name: "", price: 0, rows: "", seats: "" },
      ],
    })
  }

  const handleRemoveSector = (index: number) => {
    const newSectors = [...matchForm.sectors]
    newSectors.splice(index, 1)
    setMatchForm({
      ...matchForm,
      sectors: newSectors,
    })
  }

  const handleSectorChange = (index: number, field: string, value: string | number) => {
    const newSectors = [...matchForm.sectors]
    newSectors[index] = { ...newSectors[index], [field]: value }
    setMatchForm({
      ...matchForm,
      sectors: newSectors,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#438D69] text-white">Активный</Badge>
      case "completed":
        return <Badge className="bg-[#C7C7C7] text-white">Завершен</Badge>
      default:
        return <Badge className="bg-[#C7C7C7] text-white">Неизвестно</Badge>
    }
  }

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return <Badge className="bg-[#3D6D56] text-white">Забронирован</Badge>
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
            <div className="flex items-center space-x-4">
              <Badge className="bg-[#438D69] text-white">Организатор</Badge>
              <Button variant="ghost" className="text-[#3D6D56] hover:text-[#438D69]" asChild>
                <Link href="/admin/profile">
                  <User className="w-4 h-4 mr-2" />
                  Кабинет
                </Link>
              </Button>
            </div>
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
                    <h3 className="text-xl font-semibold text-gray-900">{organizerData.firstName}</h3>
                    <h3 className="text-xl font-semibold text-gray-900">{organizerData.lastName}</h3>
                    <p className="text-[#C7C7C7] mt-2">{organizerData.email}</p>
                    <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                      <div className="flex items-center space-x-2 mb-2">
                        <Building className="w-4 h-4 text-[#C7C7C7]" />
                        <p className="text-sm text-[#C7C7C7]">{organizerData.organization}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-[#C7C7C7]" />
                        <p className="text-sm text-[#C7C7C7]">{organizerData.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 flex-grow">
                    <div className="text-sm text-[#C7C7C7]">
                      <span>Всего матчей: </span>
                      <span className="font-medium">{matchesData.length}</span>
                    </div>
                    <div className="text-sm text-[#C7C7C7]">
                      <span>Активных матчей: </span>
                      <span className="font-medium">{matchesData.filter((m) => m.status === "active").length}</span>
                    </div>
                    <div className="text-sm text-[#C7C7C7]">
                      <span>В сервисе: </span>
                      <span className="font-medium">{organizerData.daysInService} дней</span>
                    </div>
                  </div>

                  {/* Добавляем пустое пространство для растяжения карточки */}
                  <div className="flex-grow min-h-[200px]"></div>

                  {/* Дополнительная информация внизу */}
                  <div className="pt-6 border-t border-[#F3F4F6]">
                    <p className="text-sm text-[#C7C7C7]">Последний вход: {organizerData.lastLogin}</p>
                    <p className="text-sm text-[#C7C7C7] mt-1">IP: {organizerData.ip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex w-full mb-8">
              <Button
                onClick={() => setActiveTab("matches")}
                className={`flex-1 py-3 rounded-xl font-medium ${
                  activeTab === "matches" ? "text-white" : "bg-[#F3F4F6] text-[#C7C7C7] hover:bg-[#F3F4F6]/80"
                }`}
                style={{
                  backgroundColor: activeTab === "matches" ? "#3D6D56" : undefined,
                }}
              >
                Управление матчами
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

            {/* Matches Management Content */}
            {activeTab === "matches" && (
              <div className="space-y-6">
                {/* Matches Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Управление матчами</h2>
                  <Button
                    onClick={handleCreateMatch}
                    className="rounded-xl text-white"
                    style={{ backgroundColor: "#3D6D56" }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Создать матч
                  </Button>
                </div>

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
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <div className="flex-1">
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger className="h-10 w-full bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
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
                  </div>

                  <div className="flex-1">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-10 w-full bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
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
                  </div>

                  <div className="flex-1">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-10 w-full bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
                        <SelectValue placeholder="Сортировка..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">По дате матча</SelectItem>
                        <SelectItem value="createdDate">По дате создания</SelectItem>
                        <SelectItem value="team">По команде</SelectItem>
                        <SelectItem value="venue">По месту проведения</SelectItem>
                        <SelectItem value="bookings">По количеству броней</SelectItem>
                        <SelectItem value="city">По городу</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Button
                      onClick={toggleSortOrder}
                      variant="outline"
                      className="h-10 w-full border-[#F3F4F6] text-[#3D6D56] hover:bg-[#3D6D56]/10 rounded-xl"
                    >
                      {sortOrder === "asc" ? (
                        <SortAsc className="w-4 h-4 mr-2" />
                      ) : (
                        <SortDesc className="w-4 h-4 mr-2" />
                      )}
                      {sortOrder === "asc" ? "По возрастанию" : "По убыванию"}
                    </Button>
                  </div>

                  <div className="flex-1">
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="h-10 w-full border-[#CD6060]/20 text-[#CD6060] hover:bg-[#CD6060]/10 rounded-xl"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Сбросить
                    </Button>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="flex justify-between items-center">
                  <p className="text-[#C7C7C7]">
                    Найдено {filteredAndSortedMatches.length} из {matchesData.length} матчей
                  </p>
                </div>

                {/* Matches List */}
                {filteredAndSortedMatches.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAndSortedMatches.map((match) => (
                      <Card
                        key={match.id}
                        className="border-0 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white shadow-sm"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="space-y-3 mb-4 md:mb-0">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {match.homeTeam} - {match.awayTeam}
                                </h3>
                                {getStatusBadge(match.status)}
                              </div>
                              <div className="space-y-1 text-[#C7C7C7]">
                                <p className="text-sm">
                                  {formatDate(match.date)}, {match.time}
                                </p>
                                <p className="text-sm">{match.venue}</p>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
                              <div className="grid grid-cols-2 gap-2 md:mr-4">
                                <div className="text-center p-2 bg-[#F3F4F6] rounded-lg">
                                  <p className="text-xs text-[#C7C7C7]">Всего</p>
                                  <p className="font-semibold">{match.totalSeats}</p>
                                </div>
                                <div className="text-center p-2 bg-[#3D6D56]/10 rounded-lg">
                                  <p className="text-xs text-[#3D6D56]">Бронь</p>
                                  <p className="font-semibold text-[#3D6D56]">{match.bookedSeats}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleViewBookings(match.id)}
                                  variant="outline"
                                  className="rounded-xl border-[#F3F4F6] text-[#3D6D56] hover:bg-[#3D6D56]/10"
                                  disabled={match.bookedSeats === 0}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleEditMatch(match.id)}
                                  variant="outline"
                                  className="rounded-xl border-[#F3F4F6] text-[#3D6D56] hover:bg-[#3D6D56]/10"
                                  disabled={match.status === "completed"}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteMatch(match.id)}
                                  variant="outline"
                                  className="rounded-xl text-[#CD6060] border-[#CD6060]/20 hover:bg-[#CD6060]/10"
                                  disabled={match.status === "completed" || match.bookedSeats > 0}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Матчи не найдены</h3>
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

                {/* Create/Edit Match Dialog */}
                <Dialog
                  open={isCreatingMatch || isEditingMatch}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsCreatingMatch(false)
                      setIsEditingMatch(false)
                      setSelectedMatch(null)
                    }
                  }}
                >
                  <DialogContent className="sm:max-w-[600px] bg-white">
                    <DialogHeader>
                      <DialogTitle>{isCreatingMatch ? "Создание нового матча" : "Редактирование матча"}</DialogTitle>
                      <DialogDescription className="text-[#C7C7C7]">
                        Заполните информацию о матче и доступных секторах
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="homeTeam">Домашняя команда</Label>
                          <Input
                            id="homeTeam"
                            value={matchForm.homeTeam}
                            onChange={(e) => setMatchForm({ ...matchForm, homeTeam: e.target.value })}
                            className="h-10 bg-[#F3F4F6] border-0 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="awayTeam">Гостевая команда</Label>
                          <Input
                            id="awayTeam"
                            value={matchForm.awayTeam}
                            onChange={(e) => setMatchForm({ ...matchForm, awayTeam: e.target.value })}
                            className="h-10 bg-[#F3F4F6] border-0 rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Дата</Label>
                          <Input
                            id="date"
                            type="date"
                            value={matchForm.date}
                            onChange={(e) => setMatchForm({ ...matchForm, date: e.target.value })}
                            className="h-10 bg-[#F3F4F6] border-0 rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Время</Label>
                          <Input
                            id="time"
                            type="time"
                            value={matchForm.time}
                            onChange={(e) => setMatchForm({ ...matchForm, time: e.target.value })}
                            className="h-10 bg-[#F3F4F6] border-0 rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="venue">Место проведения</Label>
                        <Input
                          id="venue"
                          value={matchForm.venue}
                          onChange={(e) => setMatchForm({ ...matchForm, venue: e.target.value })}
                          className="h-10 bg-[#F3F4F6] border-0 rounded-xl"
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label>Секторы</Label>
                          <Button
                            onClick={handleAddSector}
                            variant="outline"
                            className="h-8 rounded-xl border-[#F3F4F6] text-[#3D6D56]"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Добавить сектор
                          </Button>
                        </div>

                        {matchForm.sectors.length > 0 ? (
                          <div className="space-y-4">
                            {matchForm.sectors.map((sector, index) => (
                              <Card key={index} className="border border-[#F3F4F6] rounded-xl bg-white">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium">Сектор {index + 1}</h4>
                                    <Button
                                      onClick={() => handleRemoveSector(index)}
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-[#CD6060]"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`sector-name-${index}`}>Название</Label>
                                      <Input
                                        id={`sector-name-${index}`}
                                        value={sector.name}
                                        onChange={(e) => handleSectorChange(index, "name", e.target.value)}
                                        className="h-8 bg-[#F3F4F6] border-0 rounded-xl"
                                        placeholder="VIP, Премиум, Стандарт..."
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`sector-price-${index}`}>Цена (руб.)</Label>
                                      <Input
                                        id={`sector-price-${index}`}
                                        type="number"
                                        value={sector.price}
                                        onChange={(e) =>
                                          handleSectorChange(index, "price", Number.parseInt(e.target.value))
                                        }
                                        className="h-8 bg-[#F3F4F6] border-0 rounded-xl"
                                        placeholder="2500"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`sector-rows-${index}`}>Ряды (диапазон)</Label>
                                      <Input
                                        id={`sector-rows-${index}`}
                                        value={sector.rows}
                                        onChange={(e) => handleSectorChange(index, "rows", e.target.value)}
                                        className="h-8 bg-[#F3F4F6] border-0 rounded-xl"
                                        placeholder="1-10"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`sector-seats-${index}`}>Места (диапазон)</Label>
                                      <Input
                                        id={`sector-seats-${index}`}
                                        value={sector.seats}
                                        onChange={(e) => handleSectorChange(index, "seats", e.target.value)}
                                        className="h-8 bg-[#F3F4F6] border-0 rounded-xl"
                                        placeholder="1-20"
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border border-dashed border-[#F3F4F6] rounded-xl">
                            <p className="text-[#C7C7C7] mb-2">Секторы не добавлены</p>
                            <p className="text-sm text-[#C7C7C7]">
                              Нажмите "Добавить сектор" для создания нового сектора
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreatingMatch(false)
                          setIsEditingMatch(false)
                          setSelectedMatch(null)
                        }}
                        className="rounded-xl border-[#C7C7C7] text-[#C7C7C7]"
                      >
                        Отмена
                      </Button>
                      <Button
                        onClick={handleSaveMatch}
                        className="rounded-xl text-white"
                        style={{ backgroundColor: "#3D6D56" }}
                      >
                        {isCreatingMatch ? "Создать" : "Сохранить"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* View Bookings Dialog */}
                <Dialog
                  open={isViewingBookings}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsViewingBookings(false)
                      setSelectedMatch(null)
                    }
                  }}
                >
                  <DialogContent className="sm:max-w-[700px] bg-white">
                    <DialogHeader>
                      <DialogTitle>Бронирования</DialogTitle>
                      <DialogDescription className="text-[#C7C7C7]">
                        {selectedMatch &&
                          `Матч #${selectedMatch}: ${matchesData.find((m) => m.id === selectedMatch)?.homeTeam} - ${matchesData.find((m) => m.id === selectedMatch)?.awayTeam}`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="space-y-4">
                        {bookingsData.map((booking) => (
                          <Card key={booking.id} className="border border-[#F3F4F6] rounded-xl bg-white">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-medium">{booking.userName}</h4>
                                    {getBookingStatusBadge(booking.status)}
                                  </div>
                                  <p className="text-sm text-[#C7C7C7]">{booking.userEmail}</p>
                                  <div className="mt-2 grid grid-cols-3 gap-2">
                                    <div>
                                      <span className="text-xs text-[#C7C7C7]">Сектор:</span>
                                      <p className="text-sm font-medium">{booking.sector}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-[#C7C7C7]">Ряд:</span>
                                      <p className="text-sm font-medium">{booking.row}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs text-[#C7C7C7]">Место:</span>
                                      <p className="text-sm font-medium">{booking.seat}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-0 md:text-right">
                                  <p className="text-sm text-[#C7C7C7]">Дата брони:</p>
                                  <p className="text-sm font-medium">{booking.bookingDate}</p>
                                  <p className="mt-2 font-bold" style={{ color: "#3D6D56" }}>
                                    {booking.price} руб.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          setIsViewingBookings(false)
                          setSelectedMatch(null)
                        }}
                        className="rounded-xl text-white"
                        style={{ backgroundColor: "#3D6D56" }}
                      >
                        Закрыть
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                      <p className="text-gray-800 font-medium">{organizerData.email}</p>
                      <p className="text-xs text-[#C7C7C7]">Электронная почта не может быть изменена</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Building className="w-5 h-5 text-[#C7C7C7]" />
                        <Label htmlFor="organization" className="text-gray-700">
                          Название организации
                        </Label>
                      </div>
                      <p className="text-gray-800 font-medium">{organizerData.organization}</p>
                      <p className="text-xs text-[#C7C7C7]">Название организации не может быть изменено</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-[#C7C7C7]" />
                        <Label htmlFor="phone" className="text-gray-700">
                          Номер телефона
                        </Label>
                      </div>
                      <p className="text-gray-800 font-medium">{organizerData.phone}</p>
                      <p className="text-xs text-[#C7C7C7]">Номер телефона не может быть изменен</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-[#C7C7C7]" />
                        <Label htmlFor="bankDetails" className="text-gray-700">
                          Банковские данные
                        </Label>
                      </div>
                      <p className="text-gray-800 font-medium">{organizerData.bankDetails}</p>
                      <p className="text-xs text-[#C7C7C7]">Банковские данные не могут быть изменены</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-[#C7C7C7]" />
                        <Label className="text-gray-700">Дата регистрации</Label>
                      </div>
                      <p className="text-gray-800 font-medium">{organizerData.registrationDate}</p>
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
                            После удаления аккаунта все ваши данные, включая историю матчей и бронирований, будут
                            удалены.
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
