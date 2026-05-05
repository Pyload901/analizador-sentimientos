import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(14,20,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#f1f5f9', backdropFilter: 'blur(8px)' }}>
        <strong>{label}</strong>: {payload[0].value} mensajes
      </div>
    );
  }
  return null;
};

export const TopicBarChart = ({ data }) => {
  const chartData = Object.keys(data)
    .map(key => ({ name: key, value: data[key] }))
    .sort((a, b) => b.value - a.value);

  // Acento ámbar para la barra mayor, degradado para el resto
  const BAR_COLORS = ['#f59e0b', '#fb923c', '#a78bfa', '#38bdf8', '#34d399'];

  return (
    <div className="card chart-card">
      <h3 className="card-title">Temas más Frecuentes</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                  style={{ filter: `drop-shadow(0 0 6px ${BAR_COLORS[index % BAR_COLORS.length]}55)` }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Sin datos aún
        </div>
      )}
    </div>
  );
};
