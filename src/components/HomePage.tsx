import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, Users, BarChart3, Shield } from "lucide-react";

interface HomePageProps {
  onLogin: () => void;
}

export function HomePage({ onLogin }: HomePageProps) {
  const features = [
    {
      icon: CheckCircle,
      title: "Управление дефектами",
      description: "Регистрируйте, отслеживайте и контролируйте устранение дефектов на строительных объектах"
    },
    {
      icon: Users,
      title: "Разграничение ролей",
      description: "Инженеры, менеджеры и руководители - каждый имеет доступ к необходимым функциям"
    },
    {
      icon: BarChart3,
      title: "Аналитика и отчетность",
      description: "Формируйте детальные отчеты и анализируйте эффективность работы"
    },
    {
      icon: Shield,
      title: "Контроль качества",
      description: "Повышайте прозрачность работы и минимизируйте потерю информации"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl mb-6 text-primary">
            FixFlow
          </h1>
          <p className="text-xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Централизованная система управления дефектами на строительных объектах. 
            Контролируйте качество, повышайте прозрачность работы и минимизируйте потери информации.
          </p>
          <Button 
            size="lg" 
            onClick={onLogin}
            className="bg-accent hover:bg-accent/90"
          >
            Начать работу
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4 text-primary">
              Возможности системы
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              FixFlow предоставляет все необходимые инструменты для эффективного управления 
              дефектами на строительных объектах
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto mb-4 bg-secondary rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4 text-primary">
              Роли пользователей
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Каждая роль имеет специфические права доступа и функции для оптимальной работы
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-primary">Инженер</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Регистрация новых дефектов</li>
                  <li>• Обновление статусов дефектов</li>
                  <li>• Добавление комментариев</li>
                  <li>• Загрузка фотографий и документов</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-primary">Менеджер</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Назначение исполнителей</li>
                  <li>• Контроль сроков выполнения</li>
                  <li>• Формирование отчетов</li>
                  <li>• Управление приоритетами</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-primary">Руководитель</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Просмотр аналитики</li>
                  <li>• Агрегированные отчеты</li>
                  <li>• Контроль качества работ</li>
                  <li>• Принятие управленческих решений</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">
            Готовы начать?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Войдите в систему и начните эффективно управлять дефектами уже сегодня
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={onLogin}
          >
            Войти в систему
          </Button>
        </div>
      </section>
    </div>
  );
}