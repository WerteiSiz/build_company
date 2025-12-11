import { useState } from "react";
import { Building, LogOut, Users, Briefcase, TrendingUp, BarChart3, Plus, Filter, FileDown } from "lucide-react";
import { useProjects } from "./ProjectContext";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectList } from "./ProjectList";
import { DefectList } from "./DefectList";
import { NotificationBanner } from "./NotificationBanner";
import { exportProjectToPDF } from "./utils/pdfExport";
import { toast } from "./utils/toast";

interface ManagerDashboardProps {
  onLogout: () => void;
}

export function ManagerDashboard({ onLogout }: ManagerDashboardProps) {
  const { projects, updateDefect } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showProjectList, setShowProjectList] = useState(false);
  const [showDefectList, setShowDefectList] = useState(false);

  // Calculate real statistics
  const totalDefects = projects.reduce((sum, project) => sum + project.defects.length, 0);
  const fixedDefects = projects.reduce(
    (sum, project) => sum + project.defects.filter(d => d.status === 'Исправлен' || d.status === 'Закрыт').length,
    0
  );
  const inProgressDefects = projects.reduce(
    (sum, project) => sum + project.defects.filter(d => d.status === 'В работе').length,
    0
  );
  const activeProjects = projects.filter(p => p.status === 'Активный').length;

  const handleExportPDF = async (project: any) => {
    try {
      await exportProjectToPDF(project);
      toast.success(`Отчет по объекту "${project.name}" успешно экспортирован`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Ошибка при экспорте отчета');
    }
  };

  const handleApproveDefect = (projectId: string, defectId: string) => {
    updateDefect(projectId, defectId, { status: 'Закрыт' });
    toast.success('Дефект одобрен и закрыт');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-card-foreground">FixFlow</h1>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-card-foreground hover:text-primary transition-colors">
                Дашборд
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Объекты
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Менеджер</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-8">Дашборд менеджера</h2>

        {/* Notifications */}
        <NotificationBanner />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Всего дефектов"
            value={totalDefects.toString()}
            change=""
            icon={<Briefcase className="h-6 w-6" />}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Исправлено"
            value={fixedDefects.toString()}
            change=""
            icon={<TrendingUp className="h-6 w-6" />}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            title="В работе"
            value={inProgressDefects.toString()}
            change=""
            icon={<Users className="h-6 w-6" />}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <StatCard
            title="Активных объектов"
            value={activeProjects.toString()}
            change=""
            icon={<Building className="h-6 w-6" />}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Быстрые действия</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Добавить объект
            </button>
            <button 
              onClick={() => setShowDefectList(!showDefectList)}
              className="flex items-center gap-2 border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Filter className="h-4 w-4" />
              {showDefectList ? 'Скрыть список дефектов' : 'Показать список дефектов'}
            </button>
            <button 
              onClick={() => setShowProjectList(!showProjectList)}
              className="flex items-center gap-2 border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Filter className="h-4 w-4" />
              {showProjectList ? 'Скрыть список объектов' : 'Показать список объектов'}
            </button>
          </div>
        </div>

        {/* Defect List with Approval */}
        {showDefectList && (
          <div className="mb-8">
            <DefectList 
              userRole="manager"
              onApproveDefect={handleApproveDefect}
            />
          </div>
        )}

        {/* Project List */}
        {showProjectList && (
          <div className="mb-8">
            <ProjectList onExport={handleExportPDF} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Progress */}
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Прогресс по объектам</h3>
            <div className="space-y-4">
              {projects.slice(0, 5).map(project => (
                <ProjectProgress 
                  key={project.id}
                  name={project.name} 
                  progress={project.progress} 
                />
              ))}
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground">Нет объектов</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Последние дефекты</h3>
            <div className="space-y-4">
              {projects
                .flatMap(project => 
                  project.defects.map(defect => ({
                    ...defect,
                    projectName: project.name
                  }))
                )
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .slice(0, 5)
                .map(defect => (
                  <DefectItem
                    key={defect.id}
                    id={defect.id}
                    title={defect.title}
                    status={defect.status}
                    priority={defect.priority}
                    assignee={defect.assignee || 'Не назначен'}
                    time={getRelativeTime(defect.updatedAt)}
                  />
                ))}
              {totalDefects === 0 && (
                <p className="text-sm text-muted-foreground">Нет дефектов</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} мин. назад`;
  } else if (diffHours < 24) {
    return `${diffHours} ч. назад`;
  } else {
    return `${diffDays} дн. назад`;
  }
}

function StatCard({ title, value, change, icon, color, bgColor }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className={`${bgColor} ${color} p-2 rounded-lg`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-card-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

function ProjectProgress({ name, progress }: {
  name: string;
  progress: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-card-foreground">{name}</span>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function DefectItem({ id, title, status, priority, assignee, time }: {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  time: string;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "В работе": return "bg-orange-100 text-orange-800";
      case "Открыт": return "bg-red-100 text-red-800";
      case "Исправлен": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Высокий": return "bg-red-100 text-red-800";
      case "Средний": return "bg-orange-100 text-orange-800";
      case "Низкий": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-3 border border-border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary">{id}</span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          <h4 className="text-sm font-medium text-card-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">{assignee}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(priority)}`}>
            {priority}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}