import React, { useEffect, useState } from "react";
import { fetchAdminContactMessages, markContactMessageAsRead } from "../Api";

const TOKEN_STORAGE_KEY = "earthquakecheck_admin_token";

function AdminMessages() {
  const [adminToken, setAdminToken] = useState(sessionStorage.getItem(TOKEN_STORAGE_KEY) || "");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMessages = async (token, pageNumber = 0) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminContactMessages(token, pageNumber, 10);
      setMessages(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || 0);
    } catch (err) {
      setError(err.message || "Mesajlar yüklenemedi.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken.trim()) {
      loadMessages(adminToken.trim(), page);
    }
  }, [adminToken, page]);

  const handleTokenSubmit = (event) => {
    event.preventDefault();
    const trimmed = adminToken.trim();
    if (!trimmed) {
      setError("Admin token zorunludur.");
      return;
    }
    sessionStorage.setItem(TOKEN_STORAGE_KEY, trimmed);
    setPage(0);
    loadMessages(trimmed, 0);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markContactMessageAsRead(adminToken.trim(), messageId);
      await loadMessages(adminToken.trim(), page);
    } catch (err) {
      setError(err.message || "Mesaj güncellenemedi.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Mesaj Paneli</h1>
        <p className="page-subtitle">İletişim formundan gelen mesajları görüntüleyin</p>
      </div>

      <div className="contact-form-container" style={{ maxWidth: "960px", margin: "0 auto" }}>
        <form onSubmit={handleTokenSubmit} className="contact-form" style={{ marginBottom: "1.5rem" }}>
          <div className="form-group">
            <label htmlFor="adminToken">X-Admin-Token</label>
            <input
              id="adminToken"
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Admin token girin"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Yükleniyor..." : "Mesajları Getir"}
          </button>
        </form>

        {error && <div className="form-alert error">{error}</div>}

        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="contact-block" style={{ alignItems: "flex-start" }}>
                <div className="contact-text" style={{ width: "100%" }}>
                  <h3>
                    {message.fullName} · {message.email}
                  </h3>
                  <p>
                    <strong>Konu:</strong> {message.subject}
                  </p>
                  <p>{message.message}</p>
                  <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                    Durum: {message.status} · {message.createdAt}
                  </p>
                  {message.status === "UNREAD" && (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleMarkAsRead(message.id)}
                    >
                      Okundu İşaretle
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="form-actions">
              <button
                type="button"
                className="back-button"
                disabled={page <= 0 || loading}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                Önceki
              </button>
              <span>
                Sayfa {page + 1} / {Math.max(totalPages, 1)}
              </span>
              <button
                type="button"
                className="submit-button"
                disabled={page + 1 >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Sonraki
              </button>
            </div>
          </div>
        )}

        {!loading && adminToken && messages.length === 0 && !error && (
          <p>Gösterilecek mesaj bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;
