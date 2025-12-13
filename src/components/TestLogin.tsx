import React, { useState } from "react";

export function TestLogin({ onLogin }: { onLogin?: (role: string) => void }) {
  const csrf = "dev-csrf-token";
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '').trim();

    // predefined demo accounts
    const accounts: Record<string, { user: string; pass: string }> = {
      engineer: { user: 'engineer', pass: 'demo' },
      manager: { user: 'manager', pass: 'demo' },
      director: { user: 'director', pass: 'demo' },
    };

    const matched = Object.entries(accounts).find(([, cred]) => cred.user === username && cred.pass === password);
    if (matched) {
      const role = matched[0];
      if (onLogin) {
        onLogin(role);
      } else {
        try {
          window.history.pushState({}, '', '/dashboard');
        } catch {}
        // fallback: reload to dashboard route
        window.location.href = '/';
      }
      return;
    }

    setError('Неверный логин или пароль. Доступны: engineer/demo, manager/demo, director/demo');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="bg-card p-8 rounded shadow w-full max-w-md">
        <meta name="csrf-token" content={csrf} />
        <h2 className="text-xl font-bold mb-4">Авторизация (тестовая страница)</h2>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="_csrf" value={csrf} />
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1">Логин</label>
            <input id="username" name="username" type="text" className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">Пароль</label>
            <input id="password" name="password" type="password" className="w-full px-3 py-2 border rounded" />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Войти</button>
            <div className="text-sm text-muted-foreground">
              Демо-учётные записи: engineer/demo · manager/demo · director/demo
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
