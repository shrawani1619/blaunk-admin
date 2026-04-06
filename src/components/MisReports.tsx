import React from 'react';

export const MisReports: React.FC = () => {
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [department, setDepartment] = React.useState('DSA');
  const [dataScope, setDataScope] = React.useState('All');
  const [reportType, setReportType] = React.useState('');
  const [format] = React.useState('Excel');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: hook to real MIS report API
    // eslint-disable-next-line no-console
    console.log({ fromDate, toDate, department, dataScope, reportType, format });
  };

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="overflow-hidden rounded-t-xl bg-primary text-xs font-semibold uppercase tracking-wide text-white sm:text-sm">
        <div className="grid grid-cols-2 gap-x-4 px-4 py-2 sm:grid-cols-7 sm:px-6">
          <span>From Date</span>
          <span>To Date</span>
          <span className="hidden sm:block">Department</span>
          <span className="hidden sm:block">Data</span>
          <span className="hidden sm:block">Report Type</span>
          <span className="hidden sm:block">Output Format</span>
          <span className="hidden sm:block text-right">Actions</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-7 sm:items-center sm:gap-4 sm:px-6 sm:py-4"
      >
        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />

        <select
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        >
          <option value="DSA">DSA</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
        </select>

        <select
          value={dataScope}
          onChange={(event) => setDataScope(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={reportType}
          onChange={(event) => setReportType(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Select Report</option>
          <option value="mis-dsa-pay">MIS - DSA Pay</option>
          <option value="mis-dsa-sales">MIS - DSA Sales</option>
          <option value="mis-dsa-ads">MIS - DSA Ads</option>
        </select>

        <input
          disabled
          value={format}
          className="w-full cursor-default rounded-md border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm text-slate-900 shadow-sm"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Generate Report
          </button>
        </div>
      </form>
    </section>
  );
};

