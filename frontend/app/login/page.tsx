'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        throw new Error('ورود ناموفق بود');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      
      // هدایت به dashboard - بدون alert
      router.push('/dashboard');
      
    } catch (err) {
      setError('ورود ناموفق بود. لطفا اطلاعات را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ورود به پنل تزئین دکور
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            برای تست از ایمیل و رمز دلخواه استفاده کنید
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              ایمیل یا شماره موبایل
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="test@tazein.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              رمز عبور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <h3 className="font-bold">برای تست:</h3>
          <p>ایمیل: test@tazein.com</p>
          <p>رمز: 123456</p>
          <p>سرور روی: http://localhost:3001</p>
        </div>
      </div>
    </div>
  );
}