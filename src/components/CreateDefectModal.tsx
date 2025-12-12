import { useState } from "react";
import { X } from "lucide-react";
import { useProjects } from "./ProjectContext";
import { toast } from "./utils/toast";

interface CreateDefectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserName?: string;
}

export function CreateDefectModal({ isOpen, onClose, currentUserName }: CreateDefectModalProps) {
  const { projects, employees, addDefectToProject } = useProjects();
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    priority: "Средний" as "Высокий" | "Средний" | "Низкий",
    assignee: currentUserName || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.projectId || !formData.title || !formData.description) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    addDefectToProject(formData.projectId, {
      title: formData.title,
      description: formData.description,
      status: "Открыт",
      priority: formData.priority,
      assignee: formData.assignee,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    toast.success("Дефект успешно создан");
    
    setFormData({
      projectId: "",
      title: "",
      description: "",
      priority: "Средний",
      assignee: currentUserName || "",
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Сохранить</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Объект <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground"
              required
            >
              <option value="">Выберите объект</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Название дефекта <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground"
              placeholder="Например: Трещина в стене"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Описание <span className="text-red-500">*</span>
            </label>
            <textarea name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground"
              rows={4}
              placeholder="Подробное описание дефекта..."
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Приоритет
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as "Высокий" | "Средний" | "Низкий" })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground"
            >
              <option value="Низкий">Низкий</option>
              <option value="Средний">Средний</option>
              <option value="Высокий">Высокий</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Исполнитель
            </label>
            <select
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-card-foreground"
            >
              <option value="">Не назначен</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name} ({employee.role === 'engineer' ? 'Инженер' : 'Менеджер'})
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Создать дефект
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border text-card-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}