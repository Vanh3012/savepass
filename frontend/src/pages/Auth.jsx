import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getApiErrorMessage } from '../api';
import { KeyRound, Lock, User, LogIn, UserPlus } from 'lucide-react';

export default function Auth({ mode = 'login' }) {
  const [isLogin, setIsLogin] = useState(mode !== 'register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(mode !== 'register');
    setError('');
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      await api.post(endpoint, { username, password });
      
      // On success, go to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-panel p-8 w-full max-w-md relative z-10 transition-all duration-300">
        <div className="flex justify-center mb-6 text-primary">
          <KeyRound size={48} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2">SavePass</h2>
        <p className="text-slate-400 text-center mb-8">
          {isLogin ? 'Đăng nhập vào kho lưu trữ' : 'Tạo tài khoản mới'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              required
              className="w-full bg-slate-800/50 border border-slate-700 text-foreground rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="password"
              required
              className="w-full bg-slate-800/50 border border-slate-700 text-foreground rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            {isLogin ? <><LogIn size={20}/> Đăng nhập</> : <><UserPlus size={20}/> Đăng ký</>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-primary hover:text-blue-400 text-sm transition-colors"
            onClick={() => {
              setError('');
              navigate(isLogin ? '/auth/register' : '/auth/login');
            }}
          >
            {isLogin ? 'Bạn chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Quay lại đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}
