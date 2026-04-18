import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: readonly Tab[] | Tab[];
  activeTab: string;
  onChange: (id: any) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-1 rounded-sm bg-slate-200/70 p-1.5 w-fit ${className}`} aria-label="Tabs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              'whitespace-nowrap rounded-sm px-8 py-3 text-base font-semibold transition',
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'bg-transparent text-slate-700 hover:bg-white',
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
