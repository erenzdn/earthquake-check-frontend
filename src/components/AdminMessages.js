import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuLock, LuLogOut, LuMail, LuMailOpen, LuChevronLeft, 
  LuChevronRight, LuShieldAlert, LuRefreshCw, LuUser, 
  LuCalendar, LuCheckCircle2, LuMessageSquare, LuInbox
} from 'react-icons/lu';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";

function AdminMessages() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '');
  const [tokenInput, setTokenInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // Dynamic SEO Protection: prevent search engine indexing
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
      created = true;
    }
    const originalContent = meta.content;
    meta.content = 'noindex, nofollow';

    return () => {
      if (created) {
        meta.remove();
      } else {
        meta.content = originalContent;
      }
    };
  }, []);

  const fetchMessages = useCallback(async (authToken, targetPage) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/admin/messages?page=${targetPage}&size=20`, {
        headers: {
          'X-Admin-Token': authToken,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem('admin_token');
          setToken('');
          throw new Error('Yetkisiz erişim. Giriş jetonu geçersiz veya süresi dolmuş.');
        }
        throw new Error('Mesajlar yüklenirken sunucu hatası oluştu.');
      }

      const data = await response.json();
      
      // Support both direct array and Spring Page object formats
      if (Array.isArray(data)) {
        setMessages(data);
        setIsFirstPage(targetPage === 0);
        setIsLastPage(data.length < 20);
        setTotalElements(data.length);
      } else {
        setMessages(data.content || []);
        setIsFirstPage(data.first ?? targetPage === 0);
        setIsLastPage(data.last ?? (data.content ? data.content.length < 20 : true));
        setTotalElements(data.totalElements ?? (data.content ? data.content.length : 0));
      }
      setPage(targetPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch messages when token or page changes
  useEffect(() => {
    if (token) {
      fetchMessages(token, page);
    }
  }, [token, page, fetchMessages]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const enteredToken = tokenInput.trim();
    if (!enteredToken) {
      setLoginError('Lütfen yönetici erişim anahtarını girin.');
      return;
    }

    setIsLoading(true);
    try {
      // Validate the token by attempting to fetch messages
      const response = await fetch(`${API_BASE_URL}/api/contact/admin/messages?page=0&size=1`, {
        headers: {
          'X-Admin-Token': enteredToken,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Erişim anahtarı geçersiz.');
        }
        throw new Error('Bağlantı hatası oluştu.');
      }

      // Valid token
      sessionStorage.setItem('admin_token', enteredToken);
      setToken(enteredToken);
      setPage(0);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setToken('');
    setMessages([]);
    setTokenInput('');
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: {
          'X-Admin-Token': token
        }
      });

      if (!response.ok) {
        throw new Error('Okundu bilgisi güncellenemedi.');
      }

      // Update locally to avoid full reload
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Render Login Screen if no valid token
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-5 bg-slate-50 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl relative overflow-hidden"
        >
          {/* Subtle glow effect */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 text-2xl mb-4 shadow-inner">
              <LuLock />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Yönetici Girişi</h1>
            <p className="text-xs text-slate-500 mt-2 font-light">
              Mesaj panelini görüntülemek için lütfen erişim anahtarınızı girin.
            </p>
          </div>

          {loginError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-medium flex items-start gap-2.5"
            >
              <LuShieldAlert className="text-base shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 relative">
            <div className="form-group">
              <label htmlFor="token" className="block text-xs font-semibold text-slate-600 mb-2">Erişim Anahtarı</label>
              <input
                type="password"
                id="token"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-xl px-4 py-3.5 text-sm placeholder-slate-300 transition-all focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 text-sm font-bold transition-all shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="sim-spinner w-5 h-5 border-white" style={{ borderWidth: '2px' }}></span>
              ) : (
                <>
                  <span>Giriş Yap</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container bg-slate-50/50 min-h-[85vh] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5 text-indigo-600 font-semibold text-sm mb-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              Sistem Yönetimi
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
              <LuMessageSquare className="text-slate-700" /> İletişim Mesajları
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-light">
              Kullanıcılardan gelen destek, öneri ve bildirim mesajlarının yönetimi. (Toplam: {totalElements})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchMessages(token, page)}
              disabled={isLoading}
              className="flex items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 transition-all shadow-sm"
              title="Yenile"
            >
              <LuRefreshCw className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100/80 text-red-600 hover:text-red-700 border border-red-100 font-bold text-xs transition-all shadow-sm"
            >
              <LuLogOut className="text-sm" /> Çıkış Yap
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium flex items-start gap-3 shadow-sm">
            <LuShieldAlert className="text-lg shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && messages.length === 0 ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shimmer h-44" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center max-w-xl mx-auto my-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-3xl mb-4">
              <LuInbox />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Hiç Mesaj Yok</h3>
            <p className="text-slate-500 text-xs mt-2 font-light max-w-xs leading-relaxed">
              Veritabanında kayıtlı iletişim mesajı bulunmamaktadır.
            </p>
          </motion.div>
        ) : (
          /* Message List */
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layoutId={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm relative overflow-hidden ${
                    msg.read ? 'border-slate-200/80' : 'border-indigo-300 shadow-indigo-100/30 ring-1 ring-indigo-300/30'
                  }`}
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${msg.read ? 'bg-slate-200' : 'bg-indigo-600'}`} />
                  
                  <div className="p-6 md:p-8 pl-8">
                    
                    {/* Message Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            msg.read ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {msg.read ? <LuMailOpen className="text-xs" /> : <LuMail className="text-xs" />}
                            {msg.read ? 'Okundu' : 'Yeni Mesaj'}
                          </span>
                          <span className="text-slate-400 text-xs font-light">•</span>
                          <span className="text-slate-400 text-xs font-light flex items-center gap-1">
                            <LuCalendar className="text-xs" /> {formatDate(msg.createdAt)}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">{msg.subject}</h2>
                      </div>

                      {/* Action Button */}
                      {!msg.read && (
                        <button
                          onClick={() => handleMarkAsRead(msg.id)}
                          className="self-start md:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 font-bold text-xs transition-all shadow-sm shrink-0"
                        >
                          <LuCheckCircle2 className="text-sm" /> Okundu İşaretle
                        </button>
                      )}
                    </div>

                    {/* Sender Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6">
                      <div className="flex items-center gap-2.5 text-xs text-slate-600">
                        <LuUser className="text-slate-400 text-sm shrink-0" />
                        <div>
                          <span className="text-slate-400 block font-light">Gönderen</span>
                          <strong className="font-semibold text-slate-700">{msg.fullName}</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-600">
                        <LuMail className="text-slate-400 text-sm shrink-0" />
                        <div>
                          <span className="text-slate-400 block font-light">E-posta</span>
                          <a href={`mailto:${msg.email}`} className="font-semibold text-indigo-600 hover:underline">{msg.email}</a>
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {msg.message}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 mt-8">
              <p className="text-xs text-slate-500 font-light">
                Sayfa <strong className="font-semibold text-slate-700">{page + 1}</strong> gösteriliyor. Toplam {totalElements} mesaj.
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={isFirstPage || isLoading}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-50 hover:border-slate-300 text-slate-600 font-bold text-xs transition-all shadow-sm"
                >
                  <LuChevronLeft className="text-sm" /> Önceki
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={isLastPage || isLoading}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-50 hover:border-slate-300 text-slate-600 font-bold text-xs transition-all shadow-sm"
                >
                  Sonraki <LuChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;
