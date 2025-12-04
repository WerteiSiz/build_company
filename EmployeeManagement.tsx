import { useState } from "react";
import { Users, Plus, X, UserPlus } from "lucide-react";
import { useProjects } from "./ProjectContext";
import { toast } from "./utils/toast";

export function EmployeeManagement() {
  const { employees, addEmployee } = useProjects();
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "engineer" as "engineer" | "manager",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Введите имя сотрудника");
      return;
    }

    addEmployee({
      name: formData.name,
      role: formData.role,
    });

    toast.success(`Сотрудник ${formData.name} успешно добавлен`);
    
    setFormData({
      name: "",
      role: "engineer",
    });
    
    setIsAddingEmployee(false);
  };

  const engineers = employees.filter(e => e.role === 'engineer');
  const managers = employees.filter(e => e.role === 'manager');

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Управление сотрудниками</h3>
        </div>
        <button
          onClick={() => setIsAddingEmployee(!isAddingEmployee)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Добавить сотрудника
        </button>
      </div>

      {/* Add Employee Form */}
      {isAddingEmployee && (
        <div className="mb-6 p-4 border border-border rounded-lg bg-muted/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  ФИО сотрудника
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground"
                  placeholder="Иванов И.И."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Роль
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "engineer" | "manager" })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground"
                >
                  <option value="engineer">Инженер</option>
                  <option value="manager">Менеджер</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                <UserPlus className="h-4 w-4" />
                Добавить
              </button>
              <button
                type="button"
                onClick={() => setIsAddingEmployee(false)}
                className="flex items-center gap-2 border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <X className="h-4 w-4" />
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Managers */}
        <div>
          <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              Менеджеры ({managers.length})
            </span>
          </h4>
          <div className="space-y-2">
            {managers.map((manager) => (
              <div
                key={manager.id}
                className="p-3 border border-border rounded-lg bg-background"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">{manager.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Добавлен: {manager.addedAt.toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    Менеджер
                  </span>
                </div>
              </div>
            ))}
            {managers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет менеджеров
              </p>
            )}
          </div>
        </div>

        {/* Engineers */}
        <div>
          <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
              Инженеры ({engineers.length})
            </span>
          </h4>
          <div className="space-y-2">
            {engineers.map((engineer) => (
              <div
                key={engineer.id}
                className="p-3 border border-border rounded-lg bg-background"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">{engineer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Добавлен: {engineer.addedAt.toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                    Инженер
                  </span>
                </div>
              </div>
            ))}
            {engineers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Нет инженеров
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
