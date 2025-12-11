import { useState } from 'react';
import { Building, Calendar, User, MapPin, TrendingUp, ChevronDown } from 'lucide-react';
import { useProjects, Project } from './ProjectContext';

interface ProjectListProps {
  onExport?: (project: Project) => void;
}

export function ProjectList({ onExport }: ProjectListProps) {
  const { projects } = useProjects();
  const [statusFilter, setStatusFilter] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = statusFilter === 'Все' || project.status === statusFilter;
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Активный':
        return 'bg-green-100 text-green-800';
      case 'На паузе':
        return 'bg-orange-100 text-orange-800';
      case 'Завершен':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDefectStatusColor = (status: string) => {
    switch (status) {
      case 'В работе':
        return 'bg-orange-100 text-orange-800';
      case 'Открыт':
        return 'bg-red-100 text-red-800';
      case 'Исправлен':
        return 'bg-green-100 text-green-800';
      case 'Закрыт':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Высокий':
        return 'bg-red-100 text-red-800';
      case 'Средний':
        return 'bg-orange-100 text-orange-800';
      case 'Низкий':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2 text-foreground">Поиск</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию, адресу или менеджеру..."
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">Статус</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Все">Все статусы</option>
              <option value="Активный">Активный</option>
              <option value="На паузе">На паузе</option>
              <option value="Завершен">Завершен</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-card p-8 rounded-lg shadow-sm border border-border text-center">
            <p className="text-muted-foreground">Объекты не найдены</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-card-foreground">{project.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {project.address}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Менеджер: {project.manager}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Начало: {project.startDate.toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {onExport && (
                      <button
                        onClick={() => onExport(project)}
                        className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Экспорт PDF
                      </button>
                    )}
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Детали
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedProject === project.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="text-card-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-semibold text-card-foreground">
                      {project.defects.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Всего дефектов</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-semibold text-green-600">
                      {project.defects.filter((d) => d.status === 'Исправлен').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Исправлено</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-semibold text-orange-600">
                      {project.defects.filter((d) => d.status === 'В работе').length}
                    </div>
                    <div className="text-xs text-muted-foreground">В работе</div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedProject === project.id && (
                  <div className="mt-6 pt-6 border-t border-border space-y-4">
                    {project.description && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2">Описание</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    )}

                    {project.photos.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2">Фотографии</h4>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                          {project.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`${project.name} - фото ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {project.defects.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2">Дефекты</h4>
                        <div className="space-y-2">
                          {project.defects.map((defect) => (
                            <div
                              key={defect.id}
                              className="p-3 border border-border rounded-lg bg-background"
                            >
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-primary">{defect.id}</span>
                                    <span className="text-sm font-medium text-card-foreground">
                                      {defect.title}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {defect.description}
                                  </p>
                                  {defect.assignee && (
                                    <p className="text-xs text-muted-foreground">
                                      Ответственный: {defect.assignee}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getPriorityColor(
                                      defect.priority
                                    )}`}
                                  >
                                    {defect.priority}
                                  </span>
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${getDefectStatusColor(
                                      defect.status
                                    )}`}
                                  >
                                    {defect.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
