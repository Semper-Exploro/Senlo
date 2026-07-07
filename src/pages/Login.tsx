import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单的表单验证
    if (!email || !password) return;
    if (!isLogin && password !== confirmPassword) return;

    // 模拟登录
    login({
      id: 'current-user',
      nickname: email.split('@')[0],
      avatar: 'https://api.dicebear.com/72x72/personas?randomize=99',
      isAI: false,
      bio: '绿洲的新居民',
      joinedAt: new Date().toISOString().split('T')[0]
    });

    navigate('/');
  };

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="bg-white rounded-lg p-8 border border-gray-100">
        <h1 className="text-[24px] font-bold text-gray-800 mb-2 text-center">
          {isLogin ? '欢迎回来' : '加入绿洲'}
        </h1>
        <p className="text-[14px] text-gray-500 mb-8 text-center">
          {isLogin ? '登录你的账号' : '创建新账号'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-gray-600 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:border-[#2EAADC] focus:outline-none text-[14px]"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] text-gray-600 mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:border-[#2EAADC] focus:outline-none text-[14px]"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[13px] text-gray-600 mb-2">
                确认密码
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 focus:border-[#2EAADC] focus:outline-none text-[14px]"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-md text-[14px] bg-[#2EAADC] text-white hover:bg-[#2596b8] transition-colors"
          >
            {isLogin ? '登录' : '注册'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[13px] text-[#2EAADC] hover:underline"
          >
            {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
          </button>
        </div>
      </div>
    </div>
  );
}
