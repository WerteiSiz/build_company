import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Defect {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'Открыт' | 'В работе' | 'Исправлен' | 'Закрыт';
  priority: 'Высокий' | 'Средний' | 'Низкий';
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  photos?: string[];
}

export interface Employee {
  id: string;
  name: string;
  role: 'engineer' | 'manager';
  addedAt: Date;
}

export interface Notification {
  id: string;
  type: 'new_employee' | 'defect_completed' | 'defect_approved';
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  description: string;
  status: 'Активный' | 'Завершен' | 'На паузе';
  startDate: Date;
  manager: string;
  photos: string[];
  defects: Defect[];
  progress: number;
}

interface ProjectContextType {
  projects: Project[];
  employees: Employee[];
  notifications: Notification[];
  addProject: (project: Omit<Project, 'id' | 'defects' | 'progress'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addDefectToProject: (projectId: string, defect: Omit<Defect, 'id' | 'projectId'>) => void;
  updateDefect: (projectId: string, defectId: string, updates: Partial<Defect>) => void;
  addEmployee: (employee: Omit<Employee, 'id' | 'addedAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const deserializeProjects = (data: string): Project[] => {
  const projects = JSON.parse(data);

  return projects.map((project: any) => ({
    ...project,
    startDate: new Date(project.startDate),
    defects: project.defects.map((d: any) => ({
      ...d,
      createdAt: new Date(d.createdAt),
      updatedAt: new Date(d.updatedAt),
    })),
  }));
};


const deserializeEmployees = (data: string): Employee[] => {
  const list = JSON.parse(data);
  return list.map((emp: any) => ({
    ...emp,
    addedAt: new Date(emp.addedAt),
  }));
};

/* 🔥 Восстановление дат уведомлений */
const deserializeNotifications = (data: string): Notification[] => {
  const list = JSON.parse(data);
  return list.map((n: any) => ({
    ...n,
    timestamp: new Date(n.timestamp),
  }));
};

/* --- Данные по умолчанию --- */

const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'ЖК Новая Москва',
    address: 'г. Москва, ул. Новая, д. 1',
    description: 'Жилой комплекс на 500 квартир',
    status: 'Активный',
    startDate: new Date('2024-01-15'),
    manager: 'А. Петров',
    photos: [],
    defects: [
      {
        id: 'DEF-001',
        projectId: '1',
        title: 'Трещина в стене',
        description: 'Обнаружена трещина в несущей стене на 3 этаже',
        status: 'В работе',
        priority: 'Высокий',
        assignee: 'А. Петров',
        createdAt: new Date('2024-11-26'),
        updatedAt: new Date('2024-11-27'),
      },
      {
        id: 'DEF-004',
        projectId: '1',
        title: 'Неровный пол в квартире 15',
        description: 'Перепад высот более 5мм',
        status: 'Открыт',
        priority: 'Средний',
        assignee: 'М. Иванова',
        createdAt: new Date('2024-11-25'),
        updatedAt: new Date('2024-11-25'),
      },
    ],
    progress: 78,
  }
];

const defaultEmployees: Employee[] = [
  {
    id: '1',
    name: 'А. Петров',
    role: 'manager',
    addedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'М. Иванова',
    role: 'manager',
    addedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'С. Сидоров',
    role: 'engineer',
    addedAt: new Date('2024-01-01'),
  },
];

export function ProjectProvider({ children }: { children: ReactNode }) {
  /* --- Загрузка проектов --- */
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem('fixflow_projects');
      if (stored) return deserializeProjects(stored);
    } catch (e) {}
    return defaultProjects;
  });

  /* --- Загрузка сотрудников --- */
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = localStorage.getItem('fixflow_employees');
      if (stored) return deserializeEmployees(stored);
    } catch {}
    return defaultEmployees;
  });

  /* --- Загрузка уведомлений --- */
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem('fixflow_notifications');
      if (stored) return deserializeNotifications(stored);
    } catch {}
    return [];
  });

  /* --- Сохранение в localStorage --- */
  useEffect(() => {
    localStorage.setItem('fixflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('fixflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('fixflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  /* --- Функции контекста --- */

  const addProject = (project: Omit<Project, 'id' | 'defects' | 'progress'>) => {
    setProjects(prev => [
      ...prev,
      {
        ...project,
        id: Date.now().toString(),
        defects: [],
        progress: 0,
      }
    ]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addDefectToProject = (projectId: string, defect: Omit<Defect, 'id' | 'projectId'>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              defects: [
                ...project.defects,
                {
                  ...defect,
                  id: `DEF-${Date.now()}`,
                  projectId,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            }
          : project
      )
    );
  };

  const updateDefect = (projectId: string, defectId: string, updates: Partial<Defect>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              defects: project.defects.map(defect =>
                defect.id === defectId
                  ? { ...defect, ...updates, updatedAt: new Date() }
                  : defect
              ),
            }
          : project
      )
    );
  };

  const addEmployee = (employee: Omit<Employee, 'id' | 'addedAt'>) => {
    const newEmp: Employee = {
      ...employee,
      id: Date.now().toString(),
      addedAt: new Date(),
    };

    setEmployees(prev => [...prev, newEmp]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'new_employee',
        message: `Новый сотрудник: ${newEmp.name}`,
        timestamp: new Date(),
        read: false,
      },
      ...prev,
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        employees,
        notifications,
        addProject,
        updateProject,
        deleteProject,
        addDefectToProject,
        updateDefect,
        addEmployee,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjects must be used inside ProjectProvider");
  return ctx;
}
