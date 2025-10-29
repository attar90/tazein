'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  publicPrice: number;
  partnerPrice: number;
  status: boolean;
  images: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    }
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('access_token');
       const response = await fetch('http://localhost:3001/wordpress/local-products', {
         headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Load products error:', error);
    }
  };

  const syncWithWordPress = async () => {
    setSyncLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3001/wordpress/sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ همگام‌سازی موفق\n${result.synced} محصول جدید\n${result.updated} محصول آپدیت شد`);
        loadProducts(); // بارگذاری مجدد محصولات
      } else {
        const error = await response.json();
        alert(`❌ خطا در همگام‌سازی: ${error.message || 'خطای ناشناخته'}`);
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('❌ خطا در ارتباط با سرور');
    } finally {
      setSyncLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری پنل مدیریت...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">تزئین دکور</h1>
          <p className="text-sm text-gray-600">پنل مدیریت</p>
        </div>
        
        <nav className="mt-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-right px-6 py-3 flex items-center space-x-2 space-x-reverse ${
              activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>📊</span>
            <span>داشبورد</span>
          </button>

          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full text-right px-6 py-3 flex items-center space-x-2 space-x-reverse ${
              activeTab === 'products' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>📦</span>
            <span>محصولات</span>
            {products.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {products.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full text-right px-6 py-3 flex items-center space-x-2 space-x-reverse ${
              activeTab === 'orders' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>📋</span>
            <span>سفارشات</span>
          </button>

          <button 
            onClick={() => setActiveTab('invoices')}
            className={`w-full text-right px-6 py-3 flex items-center space-x-2 space-x-reverse ${
              activeTab === 'invoices' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>🧾</span>
            <span>فاکتورها</span>
          </button>

          <button 
            onClick={() => setActiveTab('suppliers')}
            className={`w-full text-right px-6 py-3 flex items-center space-x-2 space-x-reverse ${
              activeTab === 'suppliers' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>🏢</span>
            <span>تأمین‌کنندگان</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {activeTab === 'dashboard' && 'داشبورد اصلی'}
                {activeTab === 'products' && 'مدیریت محصولات'}
                {activeTab === 'orders' && 'مدیریت سفارشات'}
                {activeTab === 'invoices' && 'فاکتورها'}
                {activeTab === 'suppliers' && 'تأمین‌کنندگان'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-right">
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">
                  {user?.role === 'ADMIN' ? 'مدیر سیستم' : 
                   user?.role === 'OPERATOR' ? 'اپراتور' : 'همکار'}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)}
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm transition duration-200"
              >
                خروج
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">تعداد محصولات</p>
                      <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-xl">📦</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">سفارشات فعال</p>
                      <p className="text-2xl font-bold text-gray-800">۰</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-xl">📋</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">فاکتورهای جدید</p>
                      <p className="text-2xl font-bold text-gray-800">۰</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-xl">🧾</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">تأمین‌کنندگان</p>
                      <p className="text-2xl font-bold text-gray-800">۱</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 text-xl">🏢</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">عملیات سریع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 space-x-reverse"
                  >
                    <span>➕</span>
                    <span>محصول جدید</span>
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 space-x-reverse">
                    <span>🛒</span>
                    <span>سفارش جدید</span>
                  </button>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 space-x-reverse">
                    <span>🏢</span>
                    <span>تأمین‌کننده جدید</span>
                  </button>
                  <button 
                    onClick={syncWithWordPress}
                    disabled={syncLoading}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50"
                  >
                    <span>🔄</span>
                    <span>{syncLoading ? 'در حال همگام‌سازی...' : 'همگام‌سازی وردپرس'}</span>
                  </button>
                </div>
              </div>

              {/* Recent Products */}
              {products.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">آخرین محصولات</h3>
                  <div className="space-y-3">
                    {products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600">📦</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.sku}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-800">{product.publicPrice.toLocaleString()} تومان</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* تب محصولات */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">مدیریت محصولات</h3>
                <div className="flex space-x-3 space-x-reverse">
                  <button 
                    onClick={syncWithWordPress}
                    disabled={syncLoading}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2 space-x-reverse disabled:opacity-50"
                  >
                    <span>🔄</span>
                    <span>{syncLoading ? 'در حال همگام‌سازی...' : 'همگام‌سازی با وردپرس'}</span>
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2 space-x-reverse">
                    <span>➕</span>
                    <span>محصول جدید</span>
                  </button>
                </div>
              </div>

              {/* لیست محصولات */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  {products.length > 0 ? (
                    <>
                      <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 border-b pb-3 mb-4">
                        <div>محصول</div>
                        <div>کد کالا</div>
                        <div>قیمت عمومی</div>
                        <div>قیمت همکار</div>
                        <div>عملیات</div>
                      </div>
                      
                      <div className="space-y-3">
                        {products.map((product) => (
                          <div key={product.id} className="grid grid-cols-5 gap-4 items-center py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3 space-x-reverse">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600">📦</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{product.name}</p>
                                <p className="text-xs text-gray-500">وضعیت: {product.status ? 'فعال' : 'غیرفعال'}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-700">{product.sku}</p>
                            </div>
                            <div>
                              <p className="text-gray-700">{product.publicPrice.toLocaleString()} تومان</p>
                            </div>
                            <div>
                              <p className="text-green-600 font-medium">{product.partnerPrice.toLocaleString()} تومان</p>
                            </div>
                            <div className="flex space-x-2 space-x-reverse">
                              <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm">
                                ویرایش
                              </button>
                              <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm">
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-lg mb-2">هنوز محصولی وجود ندارد</p>
                      <p className="text-sm mb-4">برای شروع، محصولات را از وردپرس همگام‌سازی کنید</p>
                      <button 
                        onClick={syncWithWordPress}
                        disabled={syncLoading}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                      >
                        {syncLoading ? 'در حال همگام‌سازی...' : 'همگام‌سازی با وردپرس'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* سایر تب‌ها */}
          {activeTab !== 'dashboard' && activeTab !== 'products' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeTab === 'orders' && '📋'}
                  {activeTab === 'invoices' && '🧾'}
                  {activeTab === 'suppliers' && '🏢'}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeTab === 'orders' && 'مدیریت سفارشات'}
                  {activeTab === 'invoices' && 'سیستم فاکتورها'}
                  {activeTab === 'suppliers' && 'مدیریت تأمین‌کنندگان'}
                </h3>
                <p className="text-gray-600">این بخش به زودی راه‌اندازی خواهد شد</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}