import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

const upcomingMatches = [
  {
    id: 1,
    homeTeam: "Спартак",
    awayTeam: "ЦСКА",
    date: "2024-02-15",
    time: "19:00",
    venue: "Открытие Арена",
    status: "Доступно для брони",
    price: "от 2500₽",
  },
  {
    id: 2,
    homeTeam: "Зенит",
    awayTeam: "Динамо",
    date: "2024-02-18",
    time: "16:30",
    venue: "Газпром Арена",
    status: "Доступно для брони",
    price: "от 3000₽",
  },
  {
    id: 3,
    homeTeam: "Локомотив",
    awayTeam: "Краснодар",
    date: "2024-02-22",
    time: "20:00",
    venue: "РЖД Арена",
    status: "Скоро откроется",
    price: "от 2000₽",
  },
]

export default function HomePage() {
  redirect("/login")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">TB</span>
              </div>
              <span className="text-xl font-bold">TicketBook</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/matches" className="text-muted-foreground hover:text-foreground">
                Матчи
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground">
                Как это работает
              </Link>
              <Link href="#contact" className="text-muted-foreground hover:text-foreground">
                Контакты
              </Link>
            </nav>
            <Button asChild>
              <Link href="/login">Войти</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Забронируй билеты
            <br />
            <span className="text-primary">до официальной продажи</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Получи гарантированную возможность купить билеты на самые популярные матчи. Предварительное бронирование без
            риска и переплат.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="#matches">Посмотреть матчи</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">Как это работает</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Гарантия брони</h3>
              <p className="text-muted-foreground">Забронированные билеты гарантированно будут доступны для покупки</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстрое бронирование</h3>
              <p className="text-muted-foreground">
                Забронируй билеты за несколько кликов до начала официальных продаж
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Лучшие места</h3>
              <p className="text-muted-foreground">Приоритетный доступ к самым популярным секторам стадиона</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section id="matches" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ближайшие матчи</h2>
            <p className="text-muted-foreground">Доступные для предварительного бронирования</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={match.status === "Доступно для брони" ? "default" : "secondary"}>
                      {match.status}
                    </Badge>
                    <span className="text-sm font-medium text-primary">{match.price}</span>
                  </div>
                  <CardTitle className="text-center">
                    {match.homeTeam} vs {match.awayTeam}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(match.date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                    })}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {match.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {match.venue}
                  </div>
                  <Button
                    className="w-full mt-4"
                    disabled={match.status !== "Доступно для брони"}
                    asChild={match.status === "Доступно для брони"}
                  >
                    {match.status === "Доступно для брони" ? (
                      <Link href={`/booking/${match.id}`}>Забронировать</Link>
                    ) : (
                      "Скоро откроется"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Простой процесс предварительного бронирования билетов
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Выбери матч</h3>
              <p className="text-sm text-muted-foreground">Найди интересующий матч в списке доступных для брони</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Забронируй место</h3>
              <p className="text-sm text-muted-foreground">Выбери сектор и количество билетов для бронирования</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Получи уведомление</h3>
              <p className="text-sm text-muted-foreground">Мы сообщим, когда начнется официальная продажа билетов</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Купи билет</h3>
              <p className="text-sm text-muted-foreground">Оплати забронированный билет по специальной ссылке</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">TB</span>
                </div>
                <span className="text-xl font-bold">TicketBook</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Сервис предварительного бронирования билетов на спортивные события
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Сервис</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Как это работает
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Правила бронирования
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Помощь
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Обратная связь
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>support@ticketbook.ru</p>
                <p>+7 (495) 123-45-67</p>
                <p>Москва, ул. Примерная, 1</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TicketBook. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
