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
    <div className={`w-full overflow-x-auto no-scrollbar ${className}`} aria-label="Tabs">
      <div className="flex w-fit min-w-full gap-1 rounded-sm bg-slate-200/70 p-1.5 sm:min-w-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                'whitespace-nowrap rounded-sm px-8 py-3 text-sm font-semibold transition sm:text-base',
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
    </div>
  );
};
