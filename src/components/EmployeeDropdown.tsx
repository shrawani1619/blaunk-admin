import React from 'react';
import { API_BASE } from '../config';

type EmployeeCodeType = 'employee' | '3pc';

interface EmployeeDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: EmployeeCodeType;
}

interface EmployeeOption {
  id: string;
  code: string;
  name: string;
}

const EMPLOYEE_CODES_CACHE: Record<string, { data: EmployeeOption[]; ts: number }> = {};
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

function getCachedEmployeeCodes(type: EmployeeCodeType): EmployeeOption[] | null {
  const key = type === '3pc' ? '3pc' : 'employee';
  const entry = EMPLOYEE_CODES_CACHE[key];
  if (!entry || Date.now() - entry.ts > CACHE_TTL_MS) return null;
  return entry.data;
}

function setCachedEmployeeCodes(type: EmployeeCodeType, data: EmployeeOption[]) {
  const key = type === '3pc' ? '3pc' : 'employee';
  EMPLOYEE_CODES_CACHE[key] = { data, ts: Date.now() };
}

export const EmployeeDropdown: React.FC<EmployeeDropdownProps> = ({
  label,
  value,
  onChange,
  type,
}) => {
  const [options, setOptions] = React.useState<EmployeeOption[]>(() =>
    getCachedEmployeeCodes(type) ?? [],
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const cached = getCachedEmployeeCodes(type);
    if (cached) {
      setOptions(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `${API_BASE}/api/employees/codes?type=${type === '3pc' ? '3pc' : 'employee'}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load employee codes.');
        return res.json();
      })
      .then((data) => {
        const list = data.employees ?? [];
        if (!cancelled) {
          setCachedEmployeeCodes(type, list);
          setOptions(list);
        }
      })
      .catch((cause) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Failed to load employee codes.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [type]);

  return (
    <div className="min-w-0 w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      {label ? (
        <label className="text-sm font-semibold text-slate-700 sm:w-40">
          {label}
        </label>
      ) : null}

      <div className={label ? 'min-w-0 flex-1 sm:max-w-xs' : 'min-w-0 w-full flex-1 overflow-hidden'}>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="block h-11 w-full min-w-0 max-w-full appearance-none truncate rounded-lg border border-slate-300 bg-white bg-no-repeat px-3 pr-9 text-sm text-slate-700 outline-none transition hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundSize: '1.25rem',
          }}
          aria-label="Select employee code"
        >
          <option value="">
            {loading ? 'Loading...' : 'Select Emp Code'}
          </option>
          {options.map((employee) => (
            <option key={employee.id} value={employee.code}>
              {employee.code} - {employee.name}
            </option>
          ))}
        </select>
        {error ? (
          <p className="mt-1 text-xs text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
};

