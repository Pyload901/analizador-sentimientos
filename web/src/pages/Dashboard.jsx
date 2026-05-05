import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { KPICards } from '../components/KPIs/KPICards';
import { SentimentPieChart } from '../components/Charts/SentimentPieChart';
import { TopicBarChart } from '../components/Charts/TopicBarChart';
import { MessageFeed } from '../components/Feed/MessageFeed';
import { MessageSquareText } from 'lucide-react';

export const Dashboard = () => {
  const { sentimientos, temas, mensajes, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ fontSize: '0.9rem' }}>Cargando dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="loading-container">
        <p style={{ color: 'var(--negative)', fontSize: '0.9rem' }}>Error conectando con la API.</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-brand">
          <div className="header-icon">
            <MessageSquareText size={18} color="#080b12" strokeWidth={2.5} />
          </div>
          <h1>Sentimientos · Café de El Salvador</h1>
        </div>
        <div className="header-status">
          <span className="status-dot"></span>
          En tiempo real
        </div>
      </header>

      <main className="main-content">
        <div className="dashboard-grid">
          <KPICards sentimientos={sentimientos} mensajes={mensajes} />
          <SentimentPieChart data={sentimientos} />
          <TopicBarChart data={temas} />
          <MessageFeed mensajes={mensajes} />
        </div>
      </main>
    </div>
  );
};
