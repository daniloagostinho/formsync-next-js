'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, user, login, logout, isLoading } = useAuth();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          FormSync Next.js
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Modern form management with Next.js, TypeScript, and React
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isAuthenticated ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome, {user?.name}!
              </h2>
              <p className="text-gray-600 mb-6">
                You are successfully logged in to FormSync.
              </p>
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">TypeScript</h3>
            <p className="text-sm text-gray-600">Type-safe development</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Next.js</h3>
            <p className="text-sm text-gray-600">React framework</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Testing</h3>
            <p className="text-sm text-gray-600">Jest & Cypress</p>
          </div>
        </div>
      </div>
    </div>
  );
}