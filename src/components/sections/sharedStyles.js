// Shared color palette and styles for consistent UI
export const colors = {
  // Primary colors
  primary: '#667eea',
  primaryDark: '#5568d3',
  primaryLight: '#7c94f5',
  
  // Accent colors
  accent: '#f093fb',
  accentDark: '#e87cf0',
  accentLight: '#f5a8fc',
  
  // Status colors
  success: '#48bb78',
  warning: '#ed8936',
  error: '#f56565',
  info: '#4299e1',
  
  // Neutral colors
  background: '#1a202c',
  backgroundLight: '#2d3748',
  cardBg: 'rgba(255, 255, 255, 0.05)',
  cardBgHover: 'rgba(255, 255, 255, 0.08)',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#a0aec0',
  textMuted: '#718096',
  
  // Border colors
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',
};

export const sectionStyle = {
  marginBottom: '24px',
  padding: '24px',
  background: `linear-gradient(135deg, ${colors.cardBg} 0%, rgba(102, 126, 234, 0.05) 100%)`,
  border: `1px solid ${colors.border}`,
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

export const headerStyle = {
  marginTop: 0,
  marginBottom: '12px',
  fontSize: '22px',
  fontWeight: '600',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
};

export const apiLabelStyle = {
  fontSize: '11px',
  color: colors.textMuted,
  fontStyle: 'italic',
  marginBottom: '12px',
  textAlign: 'left',
  padding: '8px 12px',
  background: 'rgba(102, 126, 234, 0.1)',
  borderRadius: '8px',
  borderLeft: `3px solid ${colors.primary}`,
};

export const descriptionStyle = {
  fontSize: '13px',
  color: colors.textSecondary,
  marginBottom: '20px',
  lineHeight: '1.6',
  textAlign: 'left',
  padding: '12px',
  background: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '8px',
};

export const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginBottom: '16px',
  justifyContent: 'flex-start',
};

export const buttonStyle = {
  padding: '10px 20px',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  color: colors.textPrimary,
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
};

export const buttonHoverStyle = {
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.5)',
};

export const secondaryButtonStyle = {
  ...buttonStyle,
  background: `linear-gradient(135deg, ${colors.backgroundLight} 0%, ${colors.background} 100%)`,
  border: `1px solid ${colors.border}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
};

export const infoBoxStyle = {
  padding: '12px 16px',
  background: 'rgba(66, 153, 225, 0.1)',
  border: `1px solid rgba(66, 153, 225, 0.3)`,
  borderRadius: '10px',
  marginTop: '12px',
  color: colors.textSecondary,
  fontSize: '13px',
};

export const successBoxStyle = {
  ...infoBoxStyle,
  background: 'rgba(72, 187, 120, 0.1)',
  border: `1px solid rgba(72, 187, 120, 0.3)`,
  color: colors.success,
};

export const errorBoxStyle = {
  ...infoBoxStyle,
  background: 'rgba(245, 101, 101, 0.1)',
  border: `1px solid rgba(245, 101, 101, 0.3)`,
  color: colors.error,
};

export const codeBlockStyle = {
  padding: '16px',
  background: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '10px',
  fontSize: '12px',
  fontFamily: 'monospace',
  color: colors.textSecondary,
  overflowX: 'auto',
  border: `1px solid ${colors.borderLight}`,
};

export const badgeStyle = {
  display: 'inline-block',
  padding: '4px 12px',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: '600',
  color: colors.textPrimary,
  marginLeft: '8px',
};

export const dividerStyle = {
  height: '1px',
  background: `linear-gradient(90deg, transparent 0%, ${colors.border} 50%, transparent 100%)`,
  margin: '20px 0',
  border: 'none',
};

// Custom scrollbar styles for modern UI
export const scrollbarStyles = `
  /* Webkit browsers (Chrome, Safari, Edge) */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(26, 32, 44, 0.4);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);
    border-radius: 10px;
    border: 2px solid rgba(26, 32, 44, 0.4);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.accentLight} 100%);
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  }

  ::-webkit-scrollbar-corner {
    background: rgba(26, 32, 44, 0.4);
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${colors.primary} rgba(26, 32, 44, 0.4);
  }
`;

// Style object for scrollable containers
export const scrollableContainerStyle = {
  overflowY: 'auto',
  overflowX: 'hidden',
  // For webkit browsers
  WebkitOverflowScrolling: 'touch',
};

// Code block with custom scrollbar
export const scrollableCodeBlockStyle = {
  ...codeBlockStyle,
  ...scrollableContainerStyle,
  maxHeight: '200px',
};
