import { useState, useMemo } from "react";
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useProjects } from "./ProjectContext";

export function EmployeeStatistics() {
  const { employees, projects } = useProjects();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  // Calculate statistics for all employees
  const employeeStats = useMemo(() => {
    return employees.map(employee => {
      // Get all defects assigned to this employee
      const employeeDefects = projects.flatMap(project =>
        project.defects.filter(defect => defect.assignee === employee.name)
      );

      const total = employeeDefects.length;
      const completed = employeeDefects.filter(d => d.status === 'Исправлен' || d.status === 'Закрыт').length;
      const inProgress = employeeDefects.filter(d => d.status === 'В работе').length;
      const notStarted = employeeDefects.filter(d => d.status === 'Открыт').length;

      const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
      const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
      const notStartedPercent = total > 0 ? Math.round((notStarted / total) * 100) : 0;

      // Get projects where this employee works
      const employeeProjects = projects.filter(project =>
        project.defects.some(defect => defect.assignee === employee.name) ||
        (employee.role === 'manager' && project.manager === employee.name)
      );

      return {
        employee,
        total,
        completed,
        inProgress,
        notStarted,
        completedPercent,
        inProgressPercent,
        notStartedPercent,
        projects: employeeProjects,
      };
    });
  }, [employees, projects]);

  const selectedStats = selectedEmployee
    ? employeeStats.find(s => s.employee.id === selectedEmployee)
    : null;

  return (
    <div className="space-y-6">
      {/* Employee Selector */}
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Статистика работы сотрудников</h3>
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Выберите сотрудника
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground"
          >
            <option value="">-- Выберите сотрудника --</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} ({employee.role === 'engineer' ? 'Инженер' : 'Менеджер'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Employee Stats */}
      {selectedStats && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Всего задач"
              value={selectedStats.total.toString()}
              icon={<BarChart3 className="h-5 w-5" />}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard
              title="Завершено"
              value={selectedStats.completed.toString()}
              subtitle={`${selectedStats.completedPercent}%`}
              icon={<CheckCircle className="h-5 w-5" />}
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatCard
              title="В процессе"
              value={selectedStats.inProgress.toString()}
              subtitle={`${selectedStats.inProgressPercent}%`}
              icon={<Clock className="h-5 w-5" />}
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
            <StatCard
              title="Не начаты"
              value={selectedStats.notStarted.toString()}
              subtitle={`${selectedStats.notStartedPercent}%`}
              icon={<AlertCircle className="h-5 w-5" />}
              color="text-red-600"
              bgColor="bg-red-50"
            />
          </div>

          {/* Progress Bar */}
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h4 className="font-medium text-card-foreground mb-4">Прогресс выполнения</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-700">Завершено</span>
                  <span className="text-green-700">{selectedStats.completedPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedStats.completedPercent}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-orange-700">В процессе</span>
                  <span className="text-orange-700">{selectedStats.inProgressPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedStats.inProgressPercent}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-red-700">Не начаты</span>
                  <span className="text-red-700">{selectedStats.notStartedPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedStats.notStartedPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tasks by Project */}
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h4 className="font-medium text-card-foreground mb-4">Задачи по объектам</h4>
            <div className="space-y-4">
              {selectedStats.projects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет задач на объектах
                </p>
              ) : (
                selectedStats.projects.map(project => {
                  const projectDefects = project.defects.filter(
                    d => d.assignee === selectedStats.employee.name
                  );
                  const projectCompleted = projectDefects.filter(
                    d => d.status === 'Исправлен' || d.status === 'Закрыт'
                  ).length;
                  const projectInProgress = projectDefects.filter(
                    d => d.status === 'В работе'
                  ).length;
                  const projectNotStarted = projectDefects.filter(
                    d => d.status === 'Открыт'
                  ).length;

                  return (
                    <div key={project.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-card-foreground">{project.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            Всего задач: {projectDefects.length}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {project.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-2 bg-green-50 rounded">
                          <p className="text-lg font-bold text-green-700">{projectCompleted}</p>
                          <p className="text-xs text-green-600">Завершено</p>
                        </div>
                        <div className="p-2 bg-orange-50 rounded">
                          <p className="text-lg font-bold text-orange-700">{projectInProgress}</p>
                          <p className="text-xs text-orange-600">В процессе</p>
                        </div>
                        <div className="p-2 bg-red-50 rounded">
                          <p className="text-lg font-bold text-red-700">{projectNotStarted}</p>
                          <p className="text-xs text-red-600">Не начаты</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* All Employees Summary */}
      {!selectedEmployee && (
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <h4 className="font-medium text-card-foreground mb-4">Общая статистика по всем сотрудникам</h4>
          <div className="space-y-3">
            {employeeStats.map(stat => (
              <div key={stat.employee.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-card-foreground">{stat.employee.name}</h5>
                    <p className="text-xs text-muted-foreground">
                      {stat.employee.role === 'engineer' ? 'Инженер' : 'Менеджер'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-card-foreground">
                      {stat.total} {stat.total === 1 ? 'задача' : 'задач'}
                    </p>
                    <p className="text-xs text-green-600">
                      {stat.completedPercent}% завершено
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                    ✓ {stat.completed}
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">
                    ⏳ {stat.inProgress}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                    ○ {stat.notStarted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color, bgColor }: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
      <div className={`${bgColor} ${color} p-2 rounded-lg w-fit mb-2`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-card-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
      {subtitle && (
        <p className="text-xs text-primary mt-1">{subtitle}</p>
      )}
    </div>
  );
}
