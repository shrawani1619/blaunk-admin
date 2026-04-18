import { ScrollContainer } from './ScrollContainer';

interface ReportFiltersProps {
  columns: string[];
  children: React.ReactNode;
  gridTemplate?: string;
  minWidth?: string;
  paddingY?: string;
  gap?: string;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ 
  columns, 
  children,
  gridTemplate,
  minWidth,
  paddingY = 'py-10',
  gap = 'gap-x-4'
}) => {
  // Use a default grid if none provided
  const defaultGrid = `repeat(${columns.length}, 1fr)`;
  const finalGrid = gridTemplate || defaultGrid;

  return (
    <ScrollContainer className="border border-slate-200 bg-white shadow-sm">
      {/* Header Row */}
      <div 
        className={`grid bg-primary px-6 py-4 text-base font-bold text-white ${gap}`}
        style={{ gridTemplateColumns: finalGrid, minWidth }}
      >
        {columns.map((col, idx) => (
          <div key={idx} className="flex items-center">
            {col}
          </div>
        ))}
      </div>

      {/* Input/Action Row */}
      <div 
        className={`grid items-center bg-white px-6 ${gap} ${paddingY}`}
        style={{ gridTemplateColumns: finalGrid, minWidth }}
      >
        {children}
      </div>
    </ScrollContainer>
  );
};
