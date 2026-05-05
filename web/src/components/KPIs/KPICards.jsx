import React from 'react';

export const KPICards = ({ sentimientos, mensajes }) => {
  const totalMensajes = mensajes.length;
  const totalAnalizados = (sentimientos.positivo || 0) + (sentimientos.negativo || 0) + (sentimientos.neutro || 0);
  const porcentajePositivo = totalAnalizados > 0 ? Math.round(((sentimientos.positivo || 0) / totalAnalizados) * 100) : 0;
  const porcentajeNegativo = totalAnalizados > 0 ? Math.round(((sentimientos.negativo || 0) / totalAnalizados) * 100) : 0;
  const porcentajeNeutro = totalAnalizados > 0 ? Math.round(((sentimientos.neutro || 0) / totalAnalizados) * 100) : 0;

  return (
    <div className="kpi-container">
      {/* Total Mensajes */}
      <div className="card kpi-card">
        <div className="kpi-card-top">
          <span className="card-title" style={{ marginBottom: 0 }}>Total Mensajes</span>
          <div className="kpi-icon total">💬</div>
        </div>
        <div>
          <div className="kpi-value">{totalMensajes}</div>
          <div className="kpi-trend">{totalAnalizados} analizados</div>
        </div>
      </div>

      {/* Positivo */}
      <div className="card kpi-card" style={{ borderColor: 'rgba(34,197,94,0.15)', boxShadow: 'var(--shadow-card), 0 0 24px rgba(34,197,94,0.06)' }}>
        <div className="kpi-card-top">
          <span className="card-title" style={{ marginBottom: 0, color: 'var(--positive)' }}>Sentimiento Positivo</span>
          <div className="kpi-icon positive">😊</div>
        </div>
        <div>
          <div className="kpi-value positive">{porcentajePositivo}%</div>
          <div className="kpi-trend">{sentimientos.positivo || 0} mensajes positivos</div>
        </div>
      </div>

      {/* Negativo */}
      <div className="card kpi-card" style={{ borderColor: 'rgba(244,63,94,0.15)', boxShadow: 'var(--shadow-card), 0 0 24px rgba(244,63,94,0.06)' }}>
        <div className="kpi-card-top">
          <span className="card-title" style={{ marginBottom: 0, color: 'var(--negative)' }}>Sentimiento Negativo</span>
          <div className="kpi-icon negative">😞</div>
        </div>
        <div>
          <div className="kpi-value negative">{porcentajeNegativo}%</div>
          <div className="kpi-trend">{sentimientos.negativo || 0} mensajes negativos</div>
        </div>
      </div>

      {/* Neutro */}
      <div className="card kpi-card" style={{ borderColor: 'rgba(100,116,139,0.15)', boxShadow: 'var(--shadow-card), 0 0 24px rgba(100,116,139,0.06)' }}>
        <div className="kpi-card-top">
          <span className="card-title" style={{ marginBottom: 0, color: 'var(--neutral)' }}>Sentimiento Neutro</span>
          <div className="kpi-icon neutral">😐</div>
        </div>
        <div>
          <div className="kpi-value neutral">{porcentajeNeutro}%</div>
          <div className="kpi-trend">{sentimientos.neutro || 0} mensajes neutros</div>
        </div>
      </div>
    </div>
  );
};
