import { useState } from "react";
import { Building, LogOut, TrendingUp, BarChart3, Users, Download, Calendar, Filter } from "lucide-react";
import { useProjects } from "./ProjectContext";
import { ProjectList } from "./ProjectList";
import { EmployeeManagement } from "./EmployeeManagement";
import { EmployeeStatistics } from "./EmployeeStatistics";
import { NotificationBanner } from "./NotificationBanner";
import { exportProjectToPDF } from "./utils/pdfExport";
import { toast } from "./utils/toast";

interface DirectorDashboardProps {
  onLogout: () => void;
}

export function DirectorDashboard({ onLogout }: DirectorDashboardProps) {
  const { projects } = useProjects();
  const [showProjectList, setShowProjectList] = useState(false);
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false);
  const [showEmployeeStatistics, setShowEmployeeStatistics] = useState(false);

  // Calculate real statistics
  const totalDefects = projects.reduce((sum, project) => sum + project.defects.length, 0);
  const fixedDefects = projects.reduce(
    (sum, project) => sum + project.defects.filter(d => d.status === 'Исправлен' || d.status === 'Закрыт').length,
    0
  );
  const activeProjects = projects.filter(p => p.status === 'Активный').length;
  const efficiency = totalDefects > 0 ? Math.round((fixedDefects / totalDefects) * 100) : 0;

  // Priority distribution
  const highPriority = projects.reduce(
    (sum, project) => sum + project.defects.filter(d => d.priority === 'Высокий').length,
    0
  );
  const mediumPriority = projects.reduce(
    (sum, project) => sum + project.defects.filter(d => d.priority === 'Средний').length,
    0
  );
  const lowPriority = projects.reduce(
    (sum, project) => sum + project.defects.filter(d => d.priority === 'Низкий').length,
    0
  );

  const handleExportPDF = async (project: any) => {
    try {
      await exportProjectToPDF(project);
      toast.success(`Отчет по объекту "${project.name}" успешно экспортирован`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Ошибка при экспорте отчета');
    }
  };

  const handleExportAll = async () => {
    try {
      for (const project of projects) {
        await exportProjectToPDF(project);
      }
      toast.success(`Экспортировано ${projects.length} отчетов`);
    } catch (error) {
      console.error('Error exporting PDFs:', error);
      toast.error('Ошибка при экспорте отчетов');
    }
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
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Отчеты
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select className="text-sm border border-border rounded px-2 py-1">
                <option>Месяц</option>
                <option>Квартал</option>
                <option>Год</option>
              </select>
            </div>
            <span className="text-sm text-muted-foreground">Директор</span>
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
        <h2 className="text-2xl font-bold text-foreground mb-8">Отчеты и аналитика</h2>

        {/* Notifications */}
        <NotificationBanner />

        {/* Quick Actions */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Быстрые действия</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setShowEmployeeManagement(!showEmployeeManagement)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Users className="h-4 w-4" />
              {showEmployeeManagement ? 'Скрыть управление сотрудниками' : 'Управление сотрудниками'}
            </button>
            <button 
              onClick={() => setShowEmployeeStatistics(!showEmployeeStatistics)}
              className="flex items-center gap-2 border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              {showEmployeeStatistics ? 'Скрыть статистику сотрудников' : 'Статистика сотрудников'}
            </button>
            <button 
              onClick={() => setShowProjectList(!showProjectList)}
              className="flex items-center gap-2 border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Filter className="h-4 w-4" />
              {showProjectList ? 'Скрыть список объектов' : 'Показать список объектов'}
            </button>
            <button 
              onClick={handleExportAll}
              className="flex items-center gap-2 border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" />
              Экспортировать все отчеты
            </button>
          </div>
        </div>

        {/* Employee Management */}
        {showEmployeeManagement && (
          <div className="mb-8">
            <EmployeeManagement />
          </div>
        )}

        {/* Employee Statistics */}
        {showEmployeeStatistics && (
          <div className="mb-8">
            <EmployeeStatistics />
          </div>
        )}

        {/* Project List */}
        {showProjectList && (
          <div className="mb-8">
            <ProjectList onExport={handleExportPDF} />
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Общая эффективность"
            value={`${efficiency}%`}
            icon={<TrendingUp className="h-6 w-6" />}
            badge={efficiency >= 80 ? "Отлично" : efficiency >= 60 ? "Хорошо" : "Требует внимания"}
            badgeColor={efficiency >= 80 ? "bg-green-100 text-green-800" : efficiency >= 60 ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}
          />
          <MetricCard
            title="Всего дефектов"
            value={totalDefects.toString()}
            icon={<BarChart3 className="h-6 w-6" />}
          />
          <MetricCard
            title="Активных объектов"
            value={activeProjects.toString()}
            icon={<Building className="h-6 w-6" />}
          />
          <MetricCard
            title="Исправлено дефектов"
            value={fixedDefects.toString()}
            icon={<Users className="h-6 w-6" />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Defects Dynamics */}
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Динамика дефектов</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p>График динамики дефектов по месяцам</p>
                <p className="text-sm">Исправлено vs В работе</p>
              </div>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Распределение по приоритетам</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-800 font-bold">{highPriority}</span>
                  </div>
                  <p className="text-sm text-red-800">Высокий</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-orange-800 font-bold">{mediumPriority}</span>
                  </div>
                  <p className="text-sm text-orange-800">Средний</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-800 font-bold">{lowPriority}</span>
                  </div>
                  <p className="text-sm text-green-800">Низкий</p>
                </div>
              </div>
            </div>
          </div>

          {/* Efficiency Trend */}
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Тренд эффективности</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p>Линейный график эффективности</p>
                <p className="text-sm">По неделям (70% - 100%)</p>
              </div>
            </div>
          </div>

          {/* Object Performance */}
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Производительность по объектам</h3>
            <div className="space-y-4">
              {projects.map(project => (
                <ObjectProgress 
                  key={project.id}
                  name={project.name} 
                  progress={project.progress} 
                  fixed={project.defects.filter(d => d.status === 'Исправлен').length} 
                  total={project.defects.length} 
                />
              ))}
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground">Нет объектов</p>
              )}
            </div>
          </div>
        </div>

        {/* Export Reports */}
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Экспорт отчетов по объектам</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map(project => (
              <ExportCard
                key={project.id}
                title={project.name}
                description={`Детальный отчет по объекту: ${project.defects.length} дефектов`}
                format="PDF"
                period={project.startDate.toLocaleDateString('ru-RU')}
                onExport={() => handleExportPDF(project)}
              />
            ))}
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-3 text-center py-8">
                Нет объектов для экспорта
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon, badge, badgeColor }: {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}) {
  const isPositive = change?.startsWith('+');
  
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="text-primary p-2 bg-primary/10 rounded-lg">
          {icon}
        </div>
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {change}
          </span>
        )}
        {badge && (
          <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-card-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
}

function ObjectProgress({ name, progress, fixed, total }: {
  name: string;
  progress: number;
  fixed: number;
  total: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-card-foreground">{name}</span>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 mb-1">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">Исправлено: {fixed} из {total}</p>
    </div>
  );
}

function ExportCard({ title, description, format, period, onExport }: {
  title: string;
  description: string;
  format: string;
  period: string;
  onExport?: () => void;
}) {
  return (
    <div className="border-2 border-dashed border-border p-4 rounded-lg hover:border-primary/50 transition-colors">
      <h4 className="font-medium text-card-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="flex gap-2 mb-3">
        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
          {format}
        </span>
        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
          {period}
        </span>
      </div>
      <button 
        onClick={onExport}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 text-sm rounded-lg hover:bg-primary/90 transition-colors w-full justify-center"
      >
        <Download className="h-4 w-4" />
        Скачать
      </button>
    </div>
  );
}