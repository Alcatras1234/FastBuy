"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, User, Filter, SortAsc, SortDesc, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useMemo } from "react"

const allMatches = [
  {
    id: 1,
    homeTeam: "Локомотив",
    awayTeam: "Спартак М",
    date: "2025-03-08",
    time: "18:00",
    venue: "Лужники Арена",
    city: "Москва",
    availableSeats: 150,
    totalSeats: 500,
    price: 1200,
    status: "available", // available, sold_out, upcoming
  },
  {
    id: 2,
    homeTeam: "ЦСКА",
    awayTeam: "Краснодар",
    date: "2025-03-15",
    time: "19:30",
    venue: "ВЭБ Арена",
    city: "Москва",
    availableSeats: 80,
    totalSeats: 400,
    price: 1800,
    status: "available",
  },
  {
    id: 3,
    homeTeam: "Зенит",
    awayTeam: "Динамо",
    date: "2025-03-22",
    time: "16:00",
    venue: "Газпром Арена",
    city: "Санкт-Петербург",
    availableSeats: 0,
    totalSeats: 600,
    price: 2200,
    status: "sold_out",
  },
  {
    id: 4,
    homeTeam: "Спартак М",
    awayTeam: "Ростов",
    date: "2025-04-05",
    time: "17:00",
    venue: "Открытие Банк Арена",
    city: "Москва",
    availableSeats: 300,
    totalSeats: 450,
    price: 1500,
    status: "upcoming",
  },
  {
    id: 5,
    homeTeam: "Рубин",
    awayTeam: "Ахмат",
    date: "2025-04-12",
    time: "18:30",
    venue: "Ак Барс Арена",
    city: "Казань",
    availableSeats: 200,
    totalSeats: 350,
    price: 1000,
    status: "available",
  },
  {
    id: 6,
    homeTeam: "Краснодар",
    awayTeam: "Локомотив",
    date: "2025-04-19",
    time: "20:00",
    venue: "Краснодар Стадион",
    city: "Краснодар",
    availableSeats: 120,
    totalSeats: 300,
    price: 1300,
    status: "available",
  },
]

const cities = ["Все города", "Москва", "Санкт-Петербург", "Казань", "Краснодар"]
const statuses = [
  { value: "all", label: "Все матчи" },
  { value: "available", label: "Доступны для брони" },
  { value: "sold_out", label: "Билеты закончились" },
  { value: "upcoming", label: "Скоро откроется" },
]

export default function MatchesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("Все города")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [priceRange, setPriceRange] = useState("all")

  const filteredAndSortedMatches = useMemo(() => {
    const filtered = allMatches.filter((match) => {
      // Поиск по командам и месту проведения
      const matchesSearch =
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.venue.toLowerCase().includes(searchTerm.toLowerCase())

      // Фильтр по городу
      const matchesCity = cityFilter === "Все города" || match.city === cityFilter

      // Фильтр по статусу
      const matchesStatus = statusFilter === "all" || match.status === statusFilter

      // Фильтр по цене
      let matchesPrice = true
      if (priceRange === "low") matchesPrice = match.price <= 1200
      else if (priceRange === "medium") matchesPrice = match.price > 1200 && match.price <= 1800
      else if (priceRange === "high") matchesPrice = match.price > 1800

      return matchesSearch && matchesCity && matchesStatus && matchesPrice
    })

    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "price":
          comparison = a.price - b.price
          break
        case "team":
          comparison = a.homeTeam.localeCompare(b.homeTeam)
          break
        case "availability":
          comparison = b.availableSeats - a.availableSeats
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
  }, [searchTerm, cityFilter, statusFilter, sortBy, sortOrder, priceRange])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const getStatusBadge = (status: string, availableSeats: number) => {
    switch (status) {
      case "available":
        return <Badge className="bg-[#3D6D56] text-white">Доступно для брони</Badge>
      case "sold_out":
        return <Badge className="bg-[#CD6060] text-white">Билеты закончились</Badge>
      case "upcoming":
        return <Badge className="bg-[#F0BE6A] text-white">Скоро откроется</Badge>
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

  const clearFilters = () => {
    setSearchTerm("")
    setCityFilter("Все города")
    setStatusFilter("all")
    setPriceRange("all")
    setSortBy("date")
    setSortOrder("asc")
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
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Бронирование билетов</h1>
          <p className="text-lg text-[#C7C7C7]">Найдите и забронируйте билеты на интересующие матчи</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Input
              placeholder="Поиск по командам или месту проведения..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-4 pr-12 text-lg bg-white border-[#F3F4F6] rounded-xl shadow-sm focus:ring-2 focus:border-transparent focus:ring-[#3D6D56]"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C7C7C7]" />
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="h-12 bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
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
              <SelectTrigger className="h-12 bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
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

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="h-12 bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
                <SelectValue placeholder="Цена..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Любая цена</SelectItem>
                <SelectItem value="low">До 1200₽</SelectItem>
                <SelectItem value="medium">1200₽ - 1800₽</SelectItem>
                <SelectItem value="high">От 1800₽</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 bg-white border-[#F3F4F6] rounded-xl text-[#C7C7C7]">
                <SelectValue placeholder="Сортировка..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">По дате</SelectItem>
                <SelectItem value="price">По цене</SelectItem>
                <SelectItem value="team">По команде</SelectItem>
                <SelectItem value="availability">По доступности</SelectItem>
                <SelectItem value="city">По городу</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={toggleSortOrder}
              variant="outline"
              className="h-12 border-[#F3F4F6] text-[#3D6D56] hover:bg-[#3D6D56]/10 rounded-xl"
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
              {sortOrder === "asc" ? "По возрастанию" : "По убыванию"}
            </Button>

            <Button
              onClick={clearFilters}
              variant="outline"
              className="h-12 border-[#CD6060]/20 text-[#CD6060] hover:bg-[#CD6060]/10 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Сбросить
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-[#C7C7C7]">
            Найдено {filteredAndSortedMatches.length} из {allMatches.length} матчей
          </p>
        </div>

        {/* Matches Grid */}
        {filteredAndSortedMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedMatches.map((match) => (
              <Card
                key={match.id}
                className="bg-white border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                        {match.homeTeam}
                        <br />
                        <span className="text-[#3D6D56]">vs</span> {match.awayTeam}
                      </h3>
                      {getStatusBadge(match.status, match.availableSeats)}
                    </div>

                    <div className="space-y-3 text-[#C7C7C7]">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{formatDate(match.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">{match.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {match.city}, {match.venue}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm text-[#C7C7C7]">
                        {match.status === "sold_out" ? (
                          <span>Билеты закончились</span>
                        ) : (
                          <span>
                            {match.availableSeats} из {match.totalSeats} мест
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-[#3D6D56]">От {match.price}₽</div>
                    </div>

                    <Button
                      className="w-full h-12 text-white rounded-xl font-medium transition-colors"
                      style={{
                        backgroundColor: match.status === "available" ? "#3D6D56" : "#C7C7C7",
                      }}
                      disabled={match.status !== "available"}
                      asChild={match.status === "available"}
                    >
                      {match.status === "available" ? (
                        <Link href={`/booking/${match.id}`}>Забронировать</Link>
                      ) : match.status === "sold_out" ? (
                        "Билеты закончились"
                      ) : (
                        "Скоро откроется"
                      )}
                    </Button>
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
              <Button onClick={clearFilters} className="text-white rounded-xl" style={{ backgroundColor: "#3D6D56" }}>
                Сбросить фильтры
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
