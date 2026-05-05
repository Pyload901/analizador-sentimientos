import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  positivo: '#22c55e',
  negativo: '#f43f5e',
  neutro:   '#64748b',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(14,20,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#f1f5f9', backdropFilter: 'blur(8px)' }}>
        <strong>{payload[0].name}</strong>: {payload[0].value} mensajes
      </div>
    );
  }
  return null;
};

export const SentimentPieChart = ({ data }) => {
  const chartData = [
    { name: 'Positivo', value: data.positivo || 0, key: 'positivo' },
    { name: 'Negativo', value: data.negativo || 0, key: 'negativo' },
    { name: 'Neutro',   value: data.neutro   || 0, key: 'neutro'   },
  ].filter(item => item.value > 0);

  return (
    <div className="card chart-card">
      <h3 className="card-title">Distribución de Sentimientos</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.key]}
                  style={{ filter: `drop-shadow(0 0 6px ${COLORS[entry.key]}66)` }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{value}</span>}
              iconSize={8}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Sin datos aún
        </div>
      )}
    </div>
  );
};
