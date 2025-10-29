import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          به پنل تزئین دکور خوش آمدید
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          سیستم مدیریت محصولات و سفارشات
        </p>
        <div className="space-x-4">
          <Link 
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg font-medium transition duration-200"
          >
            ورود به سیستم
          </Link>
          <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-medium transition duration-200">
            اطلاعات بیشتر
          </button>
        </div>
      </div>
    </div>
  );
}