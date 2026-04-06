import React from 'react';
import { API_BASE } from '../config';
import { EmployeeDropdown } from './EmployeeDropdown';
import { PermissionList, PERMISSIONS } from './PermissionList';
import { PlanCharges } from './PlanCharges';
import { MisReports } from './MisReports';

const emptyPermissions = (): Record<string, boolean> =>
  Object.fromEntries(PERMISSIONS.map((p) => [p, false]));

const MAC_FIELD_CLASSES =
  'h-11 w-full min-w-[10rem] rounded-md border border-slate-300 px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-slate-50';

export const RightsPage: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = React.useState<string>('');
  const [employeeType, setEmployeeType] = React.useState<'employee' | '3pc'>('employee');
  const [permissions, setPermissions] = React.useState<Record<string, boolean>>(emptyPermissions);
  const [macEntry, setMacEntry] = React.useState('');
  const [rightsSaveStatus, setRightsSaveStatus] = React.useState<string | null>(null);
  const [rightsLoading, setRightsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>('Rights');

  const typeParam = employeeType === '3pc' ? '3pc' : 'employee';

  React.useEffect(() => {
    if (!selectedEmployee) {
      setPermissions(emptyPermissions());
      setMacEntry('');
      return;
    }
    let cancelled = false;
    const load = async () => {
      setRightsLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/rights/${typeParam}/${encodeURIComponent(selectedEmployee)}`,
        );
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          const sections = (data.sections || []) as string[];
          setMacEntry(typeof data.macAddress === 'string' ? data.macAddress : '');
          setPermissions(() => {
            const next = emptyPermissions();
            PERMISSIONS.forEach((p) => {
              next[p] = sections.includes(p);
            });
            return next;
          });
        } else {
          setPermissions(emptyPermissions());
          setMacEntry('');
        }
      } catch {
        if (!cancelled) {
          setPermissions(emptyPermissions());
          setMacEntry('');
        }
      } finally {
        if (!cancelled) setRightsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedEmployee, typeParam]);

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setPermissions((prev) => ({ ...prev, [permission]: checked }));
    setRightsSaveStatus(null);
  };

  const handleSaveRights = async () => {
    if (!selectedEmployee) {
      setRightsSaveStatus('Select an employee code first.');
      return;
    }
    setRightsSaveStatus(null);
    try {
      const sections = PERMISSIONS.filter((p) => permissions[p]);
      const res = await fetch(`${API_BASE}/api/rights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeCode: selectedEmployee,
          type: typeParam,
          sections,
          macAddress: macEntry.trim(),
        }),
      });
      if (res.ok) {
        setRightsSaveStatus('Rights saved successfully.');
      } else {
        const data = await res.json().catch(() => ({}));
        setRightsSaveStatus(data.message || 'Failed to save rights.');
      }
    } catch {
      setRightsSaveStatus('Failed to save rights.');
    }
  };

  const tabs = [
    'Rights',
    'Plan Charges',
    'Commission',
    'MIS',
    'Paybank',
    'Voucher',
    'DSA Limit Check',
    'Company Details',
  ];

  const renderContent = () => {
    if (activeTab === 'Rights') {
      const isSuccess = rightsSaveStatus?.toLowerCase().includes('success');
      return (
        <div className="w-full max-w-4xl">
          <section className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
            {/* Toolbar */}
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-4 sm:px-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setEmployeeType('employee');
                      setSelectedEmployee('');
                    }}
                    className={[
                      'rounded-md px-4 py-2 text-sm font-medium transition',
                      employeeType === 'employee'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100',
                    ].join(' ')}
                  >
                    Employee Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmployeeType('3pc');
                      setSelectedEmployee('');
                    }}
                    className={[
                      'rounded-md px-4 py-2 text-sm font-medium transition',
                      employeeType === '3pc'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100',
                    ].join(' ')}
                  >
                    3PC - Empl Code
                  </button>
                </div>

                <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr),240px,96px] md:items-end">
                  <div className="min-w-0 overflow-hidden">
                    <EmployeeDropdown
                      label=""
                      value={selectedEmployee}
                      onChange={setSelectedEmployee}
                      type={employeeType}
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="mb-1 block text-xs font-semibold text-violet-700">
                      MAC Entry
                    </label>
                    <input
                      type="text"
                      className={MAC_FIELD_CLASSES}
                      placeholder="e.g. AA:BB:CC:DD:EE:FF"
                      value={macEntry}
                      disabled={!selectedEmployee || rightsLoading}
                      onChange={(event) => {
                        setMacEntry(event.target.value);
                        setRightsSaveStatus(null);
                      }}
                      autoComplete="off"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveRights}
                    disabled={!selectedEmployee || rightsLoading}
                    className="h-11 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {rightsLoading ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            {rightsSaveStatus ? (
              <div
                className={`border-b px-4 py-3 sm:px-5 ${
                  isSuccess
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-amber-200 bg-amber-50 text-amber-800'
                }`}
              >
                <p className="text-sm font-medium">{rightsSaveStatus}</p>
              </div>
            ) : null}

            <div className="px-1 py-1 sm:px-2">
              <PermissionList
                insideContainer
                value={permissions}
                onChange={handlePermissionChange}
              />
            </div>
          </section>
        </div>
      );
    }

    if (activeTab === 'Plan Charges') {
      return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
          <PlanCharges />
        </section>
      );
    }

    if (activeTab === 'MIS') {
      return (
        <MisReports />
      );
    }

    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-card">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">
          {activeTab}
        </h2>
        <p className="text-slate-600">
          This section is ready for integration. You can plug in the actual
          {` ${activeTab.toLowerCase()} `}data and forms here.
        </p>
      </section>
    );
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3">
      {/* Tabs + Edit */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap gap-1" aria-label="Section tabs">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  'rounded-lg px-4 py-2 text-xs font-medium transition sm:text-sm',
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ].join(' ')}
              >
                {tab}
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          className="rounded-lg border border-primary bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:bg-primary/5"
        >
          Edit
        </button>
      </div>

      {/* Page title */}
      <h1 className="text-2xl font-bold text-slate-800">{activeTab}</h1>

      {renderContent()}
    </div>
  );
};

