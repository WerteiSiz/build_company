import { Building, Users, BarChart3, ArrowRight } from "lucide-react";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Building className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">FixFlow</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Централизованное управление дефектами на строительных объектах
          </p>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Основные возможности
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Building className="h-8 w-8" />}
              title="Управление дефектами"
              description="Создание, отслеживание и контроль исправления дефектов"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Разграничение ролей"
              description="Инженеры, менеджеры и руководители с разными правами доступа"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Аналитика и отчеты"
              description="Детальная статистика и экспорт отчетов по проектам"
            />
          </div>
        </div>

        {/* Roles */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Роли пользователей
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard
              title="Инженер"
              features={[
                "Регистрация дефектов",
                "Обновление статусов",
                "Добавление комментариев"
              ]}
              color="bg-green-500"
            />
            <RoleCard
              title="Менеджер"
              features={[
                "Назначение исполнителей",
                "Контроль сроков",
                "Управление объектами"
              ]}
              color="bg-orange-500"
            />
            <RoleCard
              title="Руководитель"
              features={[
                "Просмотр аналитики",
                "Формирование отчетов",
                "Общий контроль"
              ]}
              color="bg-primary"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="h-5 w-5" />
            Начать работу
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-center text-card-foreground">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
}

function RoleCard({ title, features, color }: {
  title: string;
  features: string[];
  color: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <div className={`${color} text-white px-4 py-2 rounded-lg text-center mb-4`}>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-card-foreground">• {feature}</li>
        ))}
      </ul>
    </div>
  );
}