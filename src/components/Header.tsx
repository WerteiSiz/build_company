import { Button } from "./ui/button";

interface HeaderProps {
  currentUser?: {
    name: string;
    role: 'engineer' | 'manager' | 'director';
  } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Header({ currentUser, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-primary">FixFlow</h1>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {currentUser && (
                <>
                  <a href="#dashboard" className="text-muted-foreground hover:text-primary">
                    Дашборд
                  </a>
                  <a href="#defects" className="text-muted-foreground hover:text-primary">
                    Дефекты
                  </a>
                  {(currentUser.role === 'manager' || currentUser.role === 'director') && (
                    <a href="#reports" className="text-muted-foreground hover:text-primary">
                      Отчеты
                    </a>
                  )}
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {currentUser.name} ({currentUser.role === 'engineer' ? 'Инженер' : 
                   currentUser.role === 'manager' ? 'Менеджер' : 'Руководитель'})
                </span>
                <Button variant="outline" onClick={onLogout}>
                  Выйти
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin}>
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}