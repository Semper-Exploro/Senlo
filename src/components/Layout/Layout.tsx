import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { Compass, Users, User, LogOut } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { currentUser, isLoggedIn, logout } = useStore();

  const navItems = [
    { path: '/', label: '发现', icon: Compass },
    { path: '/residents', label: 'AI居民', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-800">
            绿洲
          </Link>

          {/* 导航菜单 */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* 用户区域 */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.nickname}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{currentUser?.nickname}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                  title="退出登录"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-md text-sm bg-[#2EAADC] text-white hover:bg-[#2596b8] transition-colors"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="pt-14">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
