import React from "react";

export function TestLogin() {
  const csrf = "dev-csrf-token";
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="bg-card p-8 rounded shadow w-full max-w-md">
        <meta name="csrf-token" content={csrf} />
        <h2 className="text-xl font-bold mb-4">Авторизация (тестовая страница)</h2>
        <form action="/api/login" method="POST">
          <input type="hidden" name="_csrf" value={csrf} />
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1">Логин</label>
            <input id="username" name="username" type="text" className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">Пароль</label>
            <input id="password" name="password" type="password" className="w-full px-3 py-2 border rounded" />
          </div>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Войти</button>
        </form>
      </div>
    </div>
  );
}
