import React from 'react';

export const GlassPanel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '28px',
    backdropFilter: 'blur(18px)',
    boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
    ...style,
  }}>
    {children}
  </div>
);
