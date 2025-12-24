import React from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <div style={{
      width: '250px',
      backgroundColor: '#1e1e1e',
      borderRight: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem'
    }}>
      <h2 style={{ marginBottom: '2rem', color: '#fff' }}>Mc Nodes</h2>
      
      <button 
        onClick={() => onViewChange('nodes')}
        style={{
          marginBottom: '0.5rem',
          backgroundColor: currentView === 'nodes' ? '#646cff' : 'transparent',
          textAlign: 'left'
        }}
      >
        Node Editor (Scripting)
      </button>
      
      <button 
        onClick={() => onViewChange('items')}
        style={{
          marginBottom: '0.5rem',
          backgroundColor: currentView === 'items' ? '#646cff' : 'transparent',
          textAlign: 'left'
        }}
      >
        Item Creator
      </button>

      <button 
        onClick={() => onViewChange('entities')}
        style={{
          marginBottom: '0.5rem',
          backgroundColor: currentView === 'entities' ? '#646cff' : 'transparent',
          textAlign: 'left'
        }}
      >
        Entity Creator
      </button>
    </div>
  );
};
