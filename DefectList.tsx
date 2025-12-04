import { useState, useMemo } from "react";
import { Filter, CheckCircle, XCircle } from "lucide-react";
import { useProjects, Defect } from "./ProjectContext";

interface DefectListProps {
  userRole?: 'engineer' | 'manager' | 'director';
  currentUserName?: string;
  onApproveDefect?: (projectId: string, defectId: string) => void;
}

export function DefectList({ userRole, currentUserName, onApproveDefect }: DefectListProps) {
  const { projects, updateDefect } = useProjects();
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterManager, setFilterManager] = useState<string>("all");

  // Get all defects with project info
  const allDefects = useMemo(() => {
    return projects.flatMap(project =>
      project.defects.map(defect => ({
        ...defect,
        projectName: project.name,
        projectManager: project.manager,
      }))
    );
  }, [projects]);

  // Apply filters
  const filteredDefects = useMemo(() => {
    return allDefects.filter(defect => {
      if (filterProject !== "all" && defect.projectId !== filterProject) return false;
      
      if (filterStatus !== "all") {
        if (filterStatus === "active" && defect.status !== "Открыт" && defect.status !== "В работе") return false;
        if (filterStatus === "completed" && defect.status !== "Исправлен" && defect.status !== "Закрыт") return false;
        if (filterStatus === "notstarted" && defect.status !== "Открыт") return false;
      }
      
      if (filterManager !== "all" && defect.projectManager !== filterManager) return false;

      // For engineer, show only their defects
      if (userRole === 'engineer' && currentUserName && defect.assignee !== currentUserName) return false;
      
      return true;
    });
  }, [allDefects, filterProject, filterStatus, filterManager, userRole, currentUserName]);

  // Get unique managers
  const managers = useMemo(() => {
    const uniqueManagers = new Set(projects.map(p => p.manager));
    return Array.from(uniqueManagers);
  }, [projects]);

  const handleStatusChange = (projectId: string, defectId: string, newStatus: Defect['status']) => {
    updateDefect(projectId, defectId, { status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "В работе": return "bg-orange-100 text-orange-800";
      case "Открыт": return "bg-red-100 text-red-800";
      case "Исправлен": return "bg-green-100 text-green-800";
      case "Закрыт": return "bg-gray-100 text-gray-800";
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
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Список дефектов</h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Найдено: {filteredDefects.length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Объект
          </label>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground text-sm"
          >
            <option value="all">Все объекты</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Статус
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground text-sm"
          >
            <option value="all">Все статусы</option>
            <option value="notstarted">Не начатые</option>
            <option value="active">Активные</option>
            <option value="completed">Завершенные</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Менеджер
          </label>
          <select
            value={filterManager}
            onChange={(e) => setFilterManager(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground text-sm"
          >
            <option value="all">Все менеджеры</option>
            {managers.map((manager) => (
              <option key={manager} value={manager}>
                {manager}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Defects List */}
      <div className="space-y-3">
        {filteredDefects.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Дефекты не найдены
          </p>
        ) : (
          filteredDefects.map((defect) => (
            <div key={defect.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-primary">{defect.id}</span>
                    <span className="text-xs text-muted-foreground">
                      {defect.updatedAt.toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <h4 className="font-medium text-card-foreground mb-1">{defect.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{defect.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-muted-foreground">
                      📍 {defect.projectName}
                    </span>
                    <span className="text-muted-foreground">
                      👤 {defect.assignee || 'Не назначен'}
                    </span>
                    <span className="text-muted-foreground">
                      👔 {defect.projectManager}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getPriorityColor(defect.priority)}`}>
                    {defect.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(defect.status)}`}>
                    {defect.status}
                  </span>
                </div>
              </div>

              {/* Actions for Engineer */}
              {userRole === 'engineer' && defect.assignee === currentUserName && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  {defect.status === 'Открыт' && (
                    <button
                      onClick={() => handleStatusChange(defect.projectId, defect.id, 'В работе')}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors"
                    >
                      Начать работу
                    </button>
                  )}
                  {defect.status === 'В работе' && (
                    <button
                      onClick={() => handleStatusChange(defect.projectId, defect.id, 'Исправлен')}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Отметить как исправлен
                    </button>
                  )}
                </div>
              )}

              {/* Actions for Manager */}
              {userRole === 'manager' && defect.status === 'Исправлен' && onApproveDefect && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => onApproveDefect(defect.projectId, defect.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Одобрить
                  </button>
                  <button
                    onClick={() => handleStatusChange(defect.projectId, defect.id, 'В работе')}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                  >
                    <XCircle className="h-3 w-3" />
                    Вернуть в работу
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
