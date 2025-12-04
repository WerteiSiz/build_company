// Simple toast implementation
let toastId = 0;

export const toast = {
  success: (message: string) => {
    showToast(message, 'success');
  },
  error: (message: string) => {
    showToast(message, 'error');
  },
  info: (message: string) => {
    showToast(message, 'info');
  },
};

function showToast(message: string, type: 'success' | 'error' | 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const id = `toast-${toastId++}`;
  const toast = document.createElement('div');
  toast.id = id;
  toast.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 250px;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
    background-color: ${
      type === 'success' ? '#10b981' : 
      type === 'error' ? '#ef4444' : 
      '#3b82f6'
    };
  `;
  toast.textContent = message;

  container.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Add animations to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
