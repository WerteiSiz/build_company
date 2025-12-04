import { Bell, X } from "lucide-react";
import { useProjects } from "./ProjectContext";

export function NotificationBanner() {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useProjects();

  const unreadNotifications = notifications.filter(n => !n.read);

  if (unreadNotifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Bell className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Новые уведомления ({unreadNotifications.length})
          </h3>
          <div className="mt-2 space-y-2">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between bg-white p-3 rounded shadow-sm"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.timestamp.toLocaleString('ru-RU')}
                  </p>
                </div>
                <button
                  onClick={() => markNotificationAsRead(notification.id)}
                  className="ml-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {unreadNotifications.length > 1 && (
            <button
              onClick={clearAllNotifications}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Отметить все как прочитанные
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
