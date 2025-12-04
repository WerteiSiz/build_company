import { useState } from "react";
import { Building, ArrowLeft, LogIn, Wrench, Users, Crown } from "lucide-react";

interface AuthPageProps {
  onLogin: (role: string) => void;
  onBack: () => void;
}

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleLogin = () => {
    if (selectedRole) {
      onLogin(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card p-8 rounded-lg shadow-lg border border-border w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold text-card-foreground">FixFlow</h1>
          </div>
          <p className="text-muted-foreground">Вход в систему</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-6 mb-8">
          <p className="text-card-foreground font-medium">Выберите вашу роль:</p>
          
          <RoleOption
            id="engineer"
            title="Инженер"
            description="Регистрация и обновление дефектов"
            icon={<Wrench className="h-6 w-6" />}
            color="text-green-600"
            bgColor="bg-green-50"
            selected={selectedRole === "engineer"}
            onSelect={() => setSelectedRole("engineer")}
          />

          <RoleOption
            id="manager"
            title="Менеджер"
            description="Управление проектами и назначение задач"
            icon={<Users className="h-6 w-6" />}
            color="text-orange-600"
            bgColor="bg-orange-50"
            selected={selectedRole === "manager"}
            onSelect={() => setSelectedRole("manager")}
          />

          <RoleOption
            id="director"
            title="Руководитель"
            description="Аналитика и общий контроль"
            icon={<Crown className="h-6 w-6" />}
            color="text-primary"
            bgColor="bg-primary/10"
            selected={selectedRole === "director"}
            onSelect={() => setSelectedRole("director")}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>
          
          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center"
          >
            <LogIn className="h-4 w-4" />
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleOption({ 
  id, 
  title, 
  description, 
  icon, 
  color, 
  bgColor, 
  selected, 
  onSelect 
}: {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        selected 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`${bgColor} ${color} p-2 rounded-lg`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <input
          type="radio"
          name="role"
          value={id}
          checked={selected}
          onChange={onSelect}
          className="mt-1"
        />
      </div>
    </div>
  );
}