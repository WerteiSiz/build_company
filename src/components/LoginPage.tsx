import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface LoginPageProps {
  onLogin: (user: { name: string; role: 'engineer' | 'manager' | 'director' }) => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password && formData.role) {
      // Симуляция авторизации
      const name = formData.email.split('@')[0];
      onLogin({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        role: formData.role as 'engineer' | 'manager' | 'director'
      });
    }
  };

  const demoUsers = [
    { email: 'engineer@example.com', role: 'engineer', name: 'Инженер Иванов' },
    { email: 'manager@example.com', role: 'manager', name: 'Менеджер Петров' },
    { email: 'director@example.com', role: 'director', name: 'Директор Сидоров' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            ← Назад на главную
          </Button>
          <h1 className="text-3xl text-primary mb-2">FixFlow</h1>
          <p className="text-muted-foreground">Войдите в свою учетную запись</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Авторизация</CardTitle>
            <CardDescription>
              Введите ваши учетные данные для входа в систему
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Роль</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineer">Инженер</SelectItem>
                    <SelectItem value="manager">Менеджер</SelectItem>
                    <SelectItem value="director">Руководитель</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Демо аккаунты</CardTitle>
            <CardDescription>
              Используйте эти аккаунты для тестирования системы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        email: user.email,
                        password: '123456',
                        role: user.role
                      });
                    }}
                  >
                    Выбрать
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}