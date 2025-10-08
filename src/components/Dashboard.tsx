import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, CheckCircle, Clock, Users, TrendingUp } from "lucide-react";

interface DashboardProps {
  userRole: 'engineer' | 'manager' | 'director';
}

export function Dashboard({ userRole }: DashboardProps) {
  // Моковые данные
  const defectStats = [
    { name: 'Открытые', value: 15, color: '#550B14' },
    { name: 'В работе', value: 23, color: '#7E6961' },
    { name: 'На проверке', value: 8, color: '#CBC0B2' },
    { name: 'Закрытые', value: 45, color: '#4A2C21' }
  ];

  const monthlyDefects = [
    { month: 'Янв', defects: 12 },
    { month: 'Фев', defects: 19 },
    { month: 'Мар', defects: 15 },
    { month: 'Апр', defects: 27 },
    { month: 'Май', defects: 22 },
    { month: 'Июн', defects: 18 }
  ];

  const recentDefects = [
    { id: 'DEF-001', title: 'Трещина в стене', priority: 'Высокий', status: 'Открыт', assignee: 'И. Петров' },
    { id: 'DEF-002', title: 'Протечка в кровле', priority: 'Критический', status: 'В работе', assignee: 'А. Сидоров' },
    { id: 'DEF-003', title: 'Неровность пола', priority: 'Средний', status: 'На проверке', assignee: 'М. Иванов' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Критический': return 'destructive';
      case 'Высокий': return 'default';
      case 'Средний': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Открыт': return 'destructive';
      case 'В работе': return 'default';
      case 'На проверке': return 'secondary';
      case 'Закрыт': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Дашборд</h1>
          <p className="text-muted-foreground">
            {userRole === 'engineer' && 'Управление дефектами'}
            {userRole === 'manager' && 'Контроль и управление проектами'}
            {userRole === 'director' && 'Аналитика и отчетность'}
          </p>
        </div>
        {userRole === 'engineer' && (
          <Button>Создать дефект</Button>
        )}
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Всего дефектов</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">91</div>
            <p className="text-xs text-muted-foreground">
              +12% с прошлого месяца
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Открытые</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">15</div>
            <p className="text-xs text-muted-foreground">
              Требуют внимания
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Закрытые</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">45</div>
            <p className="text-xs text-muted-foreground">
              49% от общего числа
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Эффективность</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">78%</div>
            <p className="text-xs text-muted-foreground">
              +5% с прошлого месяца
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График статусов дефектов */}
        <Card>
          <CardHeader>
            <CardTitle>Распределение по статусам</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={defectStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {defectStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* График динамики дефектов */}
        <Card>
          <CardHeader>
            <CardTitle>Динамика дефектов</CardTitle>
            <CardDescription>Количество дефектов по месяцам</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyDefects}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="defects" fill="#4A2C21" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Таблица последних дефектов */}
      <Card>
        <CardHeader>
          <CardTitle>Последние дефекты</CardTitle>
          <CardDescription>Недавно зарегистрированные дефекты</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDefects.map((defect) => (
              <div key={defect.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{defect.id}</span>
                    <Badge variant={getPriorityColor(defect.priority) as any}>
                      {defect.priority}
                    </Badge>
                  </div>
                  <h4 className="mt-1">{defect.title}</h4>
                  {userRole !== 'engineer' && (
                    <p className="text-sm text-muted-foreground">
                      Исполнитель: {defect.assignee}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(defect.status) as any}>
                    {defect.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Просмотр
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}