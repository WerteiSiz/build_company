import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Defect {
  id: string;
  projectId: string; // Added project reference
  title: string;
  description: string;
  status: 'Открыт' | 'В работе' | 'Исправлен' | 'Закрыт';
  priority: 'Высокий' | 'Средний' | 'Низкий';
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  photos?: string[]; // Added photos support
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

// Helper functions to serialize/deserialize dates
const serializeProjects = (projects: Project[]) => {
  return JSON.stringify(projects, (key, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  });
};

const deserializeProjects = (data: string): Project[] => {
  return JSON.parse(data, (key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  });
};

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
  },
  {
    id: '2',
    name: 'ТЦ Европа',
    address: 'г. Москва, пр-т Европейский, д. 45',
    description: 'Торговый центр площадью 15000 кв.м',
    status: 'Активный',
    startDate: new Date('2024-03-01'),
    manager: 'М. Иванова',
    photos: [],
    defects: [
      {
        id: 'DEF-002',
        projectId: '2',
        title: 'Протечка кровли',
        description: 'Протечка в зоне фудкорта',
        status: 'Открыт',
        priority: 'Высокий',
        assignee: 'С. Сидоров',
        createdAt: new Date('2024-11-27'),
        updatedAt: new Date('2024-11-27'),
      },
    ],
    progress: 65,
  },
  {
    id: '3',
    name: 'Офис-центр',
    address: 'г. Москва, ул. Деловая, д. 12',
    description: 'Бизнес-центр класса А',
    status: 'Активный',
    startDate: new Date('2024-02-10'),
    manager: 'А. Петров',
    photos: [],
    defects: [
      {
        id: 'DEF-003',
        projectId: '3',
        title: 'Неровный пол',
        description: 'Неровный пол в офисе 301',
        status: 'Исправлен',
        priority: 'Низкий',
        assignee: 'А. Петров',
        createdAt: new Date('2024-11-24'),
        updatedAt: new Date('2024-11-26'),
      },
    ],
    progress: 92,
  },
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
  const [projects, setProjects] = useState<Project[]>(() => {
    // Load from localStorage on init
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fixflow_projects');
        if (stored) {
          return deserializeProjects(stored);
        }
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
      }
    }
    return defaultProjects;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fixflow_employees');
        if (stored) {
          return JSON.parse(stored, (key, value) => {
            if (value && typeof value === 'object' && value.__type === 'Date') {
              return new Date(value.value);
            }
            return value;
          });
        }
      } catch (error) {
        console.error('Error loading employees from localStorage:', error);
      }
    }
    return defaultEmployees;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('fixflow_notifications');
        if (stored) {
          return JSON.parse(stored, (key, value) => {
            if (value && typeof value === 'object' && value.__type === 'Date') {
              return new Date(value.value);
            }
            return value;
          });
        }
      } catch (error) {
        console.error('Error loading notifications from localStorage:', error);
      }
    }
    return [];
  });

  // Save to localStorage whenever projects change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fixflow_projects', serializeProjects(projects));
      } catch (error) {
        console.error('Error saving projects to localStorage:', error);
      }
    }
  }, [projects]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fixflow_employees', JSON.stringify(employees, (key, value) => {
          if (value instanceof Date) {
            return { __type: 'Date', value: value.toISOString() };
          }
          return value;
        }));
      } catch (error) {
        console.error('Error saving employees to localStorage:', error);
      }
    }
  }, [employees]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fixflow_notifications', JSON.stringify(notifications, (key, value) => {
          if (value instanceof Date) {
            return { __type: 'Date', value: value.toISOString() };
          }
          return value;
        }));
      } catch (error) {
        console.error('Error saving notifications to localStorage:', error);
      }
    }
  }, [notifications]);



  const addProject = (project: Omit<Project, 'id' | 'defects' | 'progress'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      defects: [],
      progress: 0,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const addDefectToProject = (projectId: string, defect: Omit<Defect, 'id' | 'projectId'>) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const newDefect: Defect = {
            ...defect,
            id: `DEF-${Date.now()}`,
            projectId: projectId,
          };
          return {
            ...project,
            defects: [...project.defects, newDefect],
          };
        }
        return project;
      })
    );
  };

  const updateDefect = (projectId: string, defectId: string, updates: Partial<Defect>) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            defects: project.defects.map((defect) =>
              defect.id === defectId
                ? { ...defect, ...updates, updatedAt: new Date() }
                : defect
            ),
          };
        }
        return project;
      })
    );
  };

  const addEmployee = (employee: Omit<Employee, 'id' | 'addedAt'>) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
      addedAt: new Date(),
    };
    
    setEmployees((prev) => [...prev, newEmployee]);
    
    // Add notification for new employee
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'new_employee',
      message: `Новый сотрудник! ${newEmployee.name} - ${newEmployee.role === 'engineer' ? 'инженер' : 'менеджер'}`,
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications((prev) => [notification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
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
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}