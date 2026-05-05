import React, { useState, useEffect } from 'react';

export const MessageFeed = ({ mensajes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset a página 1 si llegan mensajes nuevos (opcional, mejora UX)
  useEffect(() => {
    setCurrentPage(1);
  }, [mensajes.length]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = mensajes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mensajes.length / itemsPerPage);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="card feed-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ marginBottom: 0 }}>Feed de Mensajes Recientes</h3>
        {mensajes.length > itemsPerPage && (
          <div className="pagination-controls" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button className="btn-page" onClick={handlePrev} disabled={currentPage === 1}>
              ←
            </button>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {currentPage} / {totalPages || 1}
            </span>
            <button className="btn-page" onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
              →
            </button>
          </div>
        )}
      </div>

      {currentMessages.length > 0 ? (
        <div className="feed-list">
          {currentMessages.map((msg) => (
            <div key={msg._id} className={`feed-item ${msg.sentimiento}`}>
              <div className="feed-header">
                <span>De: {msg.numero_remitente}</span>
                <span>{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <div className="feed-text">{msg.texto_mensaje}</div>
              <div className="feed-footer">
                {msg.sentimiento && <span className={`badge ${msg.sentimiento}`}>{msg.sentimiento}</span>}
                {msg.tema && <span className="badge tema">{msg.tema}</span>}
                {msg.resumen && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.5rem', alignSelf: 'center' }}>- {msg.resumen}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: 'var(--text-secondary)', padding: '1rem' }}>No hay mensajes recientes.</div>
      )}
    </div>
  );
};
