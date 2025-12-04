import { useState } from "react";
import { Building, LogOut, AlertTriangle, CheckCircle, Clock, Plus, Filter } from "lucide-react";
import { useProjects } from "./ProjectContext";
import { ProjectList } from "./ProjectList";
import { CreateDefectModal } from "./CreateDefectModal";
import { DefectList } from "./DefectList";
import { NotificationBanner } from "./NotificationBanner";
import { exportProjectToPDF } from "./utils/pdfExport";
import { toast } from "./utils/toast";

interface EngineerDashboardProps {
  onLogout: () => void;
}

// Hardcoded engineer name for demo - in real app, this would come from authentication
const CURRENT_ENGINEER_NAME = "С. Сидоров";

export function EngineerDashboard({ onLogout }: EngineerDashboardProps) {
  const { projects } = useProjects();
  const [showProjectList, setShowProjectList] = useState(false);
  const [isCreateDefectModalOpen, setIsCreateDefectModalOpen] = useState(false);
  const [showDefectList, setShowDefectList] = useState(false);

  // Calculate real statistics for current engineer
  const allDefects = projects.flatMap(p => 
    p.defects.map(d => ({ ...d, projectName: p.name }))
  );
  const myDefects = allDefects.filter(d => d.assignee === CURRENT_ENGINEER_NAME);
  const myTasks = myDefects.filter(d => d.status === 'Открыт' || d.status === 'В работе').length;
  const completedTasks = myDefects.filter(d => d.status === 'Исправлен' || d.status === 'Закрыт').length;
  const inProgressTasks = myDefects.filter(d => d.status === 'В работе').length;

  const handleExportPDF = async (project: any) => {
    try {
      await exportProjectToPDF(project);
      toast.success(`Отчет по объекту "${project.name}" успешно экспортирован`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Ошибка при экспорте отчета');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-card-foreground">FixFlow</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Инженер: {CURRENT_ENGINEER_NAME}</span>
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
        <h2 className="text-2xl font-bold text-foreground mb-8">Дашборд инженера</h2>

        {/* Notifications */}
        <NotificationBanner />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Мои задачи"
            value={myTasks.toString()}
            icon={<AlertTriangle className="h-6 w-6" />}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <StatCard
            title="Выполнено"
            value={completedTasks.toString()}
            icon={<CheckCircle className="h-6 w-6" />}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            title="В работе"
            value={inProgressTasks.toString()}
            icon={<Clock className="h-6 w-6" />}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Быстрые действия</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsCreateDefectModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Создать дефект
            </button>
            <button 
              onClick={() => setShowDefectList(!showDefectList)}
              className="flex items-center gap-2 border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Filter className="h-4 w-4" />
              {showDefectList ? 'Скрыть список дефектов' : 'Показать мои дефекты'}
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

        {/* Defect List with Filtering */}
        {showDefectList && (
          <div className="mb-8">
            <DefectList 
              userRole="engineer" 
              currentUserName={CURRENT_ENGINEER_NAME}
            />
          </div>
        )}

        {/* Project List */}
        {showProjectList && (
          <div className="mb-8">
            <ProjectList onExport={handleExportPDF} />
          </div>
        )}

        {/* Recent Defects */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Мои недавние дефекты</h3>
          <div className="space-y-4">
            {myDefects
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .slice(0, 5)
              .map(defect => (
                <DefectItem
                  key={defect.id}
                  id={defect.id}
                  title={defect.title}
                  status={defect.status}
                  priority={defect.priority}
                  object={defect.projectName}
                />
              ))}
            {myDefects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Нет дефектов</p>
            )}
          </div>
        </div>
      </div>

      {/* Create Defect Modal */}
      <CreateDefectModal 
        isOpen={isCreateDefectModalOpen}
        onClose={() => setIsCreateDefectModalOpen(false)}
        currentUserName={CURRENT_ENGINEER_NAME}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className={`${bgColor} ${color} p-2 rounded-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-card-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

function DefectItem({ id, title, status, priority, object }: {
  id: string;
  title: string;
  status: string;
  priority: string;
  object: string;
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
    <div className="p-4 border border-border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-sm font-medium text-primary">{id}</span>
          <h4 className="font-medium text-card-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{object}</p>
        </div>
        <div className="flex gap-2">
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