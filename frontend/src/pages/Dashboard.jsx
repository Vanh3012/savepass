import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getApiErrorMessage } from '../api';
import { LogOut, Plus, Edit2, Trash2, KeyRound, Globe, User, Shield, Lock, Eye, EyeOff } from 'lucide-react';

export default function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ site: '', username: '', password: '', note: '' });
  const [error, setError] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const res = await api.get('/passwords/view');
      setPasswords(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403 || err.response?.data?.message === 'Unauthorized') {
        navigate('/auth');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/auth');
    } catch (err) {
      navigate('/auth');
    }
  };

  const openForm = (index = -1) => {
    setError('');
    if (index >= 0) {
      const current = passwords[index];
      setFormData({ site: current.site, username: current.username, password: current.password, note: current.note || '' });
      setEditingId(current.id);
    } else {
      setFormData({ site: '', username: '', password: '', note: '' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingId) {
        await api.post('/passwords/update', { id: editingId, ...formData });
      } else {
        await api.post('/passwords/create', formData);
      }
      setShowModal(false);
      fetchPasswords();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Đã có lỗi xảy ra'));
    }
  };

  const deletePassword = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mục này?")) return;
    try {
        await api.post('/passwords/delete', { id });
        fetchPasswords();
    } catch (err) {
        alert(getApiErrorMessage(err, 'Lỗi khi xoá'));
    }
  };

  const toggleVisibility = (id) => {
      setVisiblePasswords(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary font-bold text-xl">
            <KeyRound size={28} />
            <span>SavePass Vault</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Mật khẩu của bạn</h1>
            <p className="text-slate-400 text-sm">Quản lý và lưu trữ tài khoản an toàn</p>
          </div>
          <button 
            onClick={() => openForm()}
            className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus size={20} /> Thêm Mới
          </button>
        </div>

        {passwords.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-slate-800 border-dashed">
             <Shield className="mx-auto text-slate-600 mb-4" size={56} />
             <h3 className="text-xl font-medium text-slate-300">Nơi lưu trữ an toàn</h3>
             <p className="text-slate-500 mt-2 max-w-sm mx-auto">Bạn chưa có tài khoản nào được lưu. Hãy thêm mới tài khoản để SavePass giữ an toàn cho bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passwords.map((p, index) => (
              <div key={p.id} className="glass-panel p-6 flex flex-col group hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Globe size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-white truncate">{p.site}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openForm(index)} className="p-1.5 text-slate-400 hover:text-blue-400 rounded-md hover:bg-slate-800 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deletePassword(p.id)} className="p-1.5 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-800 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-3 text-sm">
                    <User size={16} className="text-slate-500 shrink-0" />
                    <span className="text-slate-300 font-mono truncate">{p.username}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Lock size={16} className="text-slate-500 shrink-0" />
                    <div className="flex-1 flex items-center justify-between bg-slate-900/50 rounded pl-2 pr-1 py-1 h-8">
                       <span className="text-slate-300 font-mono tracking-wider pt-1">
                          {visiblePasswords[p.id] ? p.password : '••••••••'}
                       </span>
                       <button onClick={() => toggleVisibility(p.id)} className="text-slate-500 hover:text-slate-300 p-1">
                          {visiblePasswords[p.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                       </button>
                    </div>
                  </div>
                  {p.note && (
                    <div className="text-xs text-slate-500 mt-2 line-clamp-2 italic border-l-2 border-slate-700 pl-2">
                      {p.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Cập Nhật / Thêm Mới */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="glass-panel w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              {editingId ? 'Cập Nhật Tài Khoản' : 'Thêm Tài Khoản Mới'}
            </h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={savePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Trang web / Nhãn</label>
                <input required type="text" value={formData.site} onChange={e => setFormData({...formData, site: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="VD: Facebook, Google..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Tên đăng nhập / Email</label>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="example@email.com"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Mật khẩu</label>
                <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono" placeholder="Nhập mật khẩu an toàn..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Ghi chú (Tùy chọn)</label>
                <textarea rows="2" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="Ghi chú về tài khoản này..."></textarea>
              </div>
              
              <div className="flex gap-3 mt-8 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg border border-slate-600 hover:bg-slate-800 transition-colors font-medium">
                  Hủy
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-blue-600 transition-colors font-medium text-white shadow-lg shadow-blue-500/20">
                  Lưu Lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
