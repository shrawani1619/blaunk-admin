import React from 'react';
import { API_BASE } from '../config';

function getAuthHeaders(includeJson = true): HeadersInit {
  const token = window.localStorage.getItem('authToken');
  const headers: Record<string, string> = {};
  if (includeJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

type EarningRow = { label: string; actual: number; deduction: number; earned: number };
type DeductionRow = { label: string; deduction: number; actual: number };
type DetailedPayslip = {
  employeeCode: string;
  employeeName: string;
  department: string;
  financialYear: string;
  reportType: string;
  period: string;
  month: string;
  earnings: EarningRow[];
  deductions: DeductionRow[];
  grossEarnings: number;
  totalDeductionColumn: number;
  totalActualColumn: number;
  nettSalaryRelease: number;
  amountInWords: string;
};
type ReportPayload = { detailed: true; payslips: DetailedPayslip[] };

/** Period follows report type (yearly payslip / CTC: same layout as monthly, yearly amounts on server). */
const PERIOD_BY_REPORT_TYPE: Record<string, 'Monthly' | 'Quarterly' | 'Yearly'> = {
  'monthly-payslip': 'Monthly',
  'yearly-payslip': 'Yearly',
  'employee-ctc': 'Yearly',
};

function periodForReportType(reportType: string): '' | 'Monthly' | 'Quarterly' | 'Yearly' {
  if (!reportType) return '';
  return PERIOD_BY_REPORT_TYPE[reportType] ?? 'Monthly';
}

export const PayslipReports: React.FC = () => {
  const [financialYear, setFinancialYear] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [reportType, setReportType] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [reportData, setReportData] = React.useState<ReportPayload | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/employee-credentials/departments`, {
      headers: getAuthHeaders(false),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled && Array.isArray(data.departments)) {
          setDepartments(data.departments);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/auth/me`, { headers: getAuthHeaders(false) })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled && data?.user?.department) {
          setDepartment((prev) => (prev === '' ? String(data.user.department).trim() : prev));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const derivedPeriod = periodForReportType(reportType);
  const monthRequired = derivedPeriod === 'Monthly';

  React.useEffect(() => {
    if (!monthRequired) {
      setMonth('');
    }
  }, [monthRequired, reportType]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setReportData(null);
    setLoading(true);
    try {
      const body = {
        financialYear,
        department,
        reportType,
        period: derivedPeriod || 'Monthly',
        month: monthRequired ? month : 'N/A',
        outputFormat: 'Display',
      };
      const res = await fetch(`${API_BASE}/api/payslip-report`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Report failed (${res.status})`);
      }
      const json = await res.json();
      const payload = json.data;
      setReportData(
        payload?.detailed && Array.isArray(payload.payslips) ? payload as ReportPayload : null,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'min-w-0 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30';

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: 'minmax(10rem, 1fr) minmax(6rem, 1fr) minmax(11rem, 1.2fr) minmax(5rem, 1fr) minmax(8rem, 1fr) auto',
  };

  return (
    <section className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 bg-primary px-4 py-3 sm:px-6">
        <h1 className="text-xl font-semibold text-white">Payslip</h1>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-white/90">
          For individual employee reference only — view salary slips on screen, then use{' '}
          <strong className="font-semibold text-white">Print / Save as PDF</strong>.{' '}
          <strong>Investment Declaration</strong> and <strong>Form 16</strong> are deferred to a later phase.
        </p>
      </div>

      <div
        className="mt-0 grid gap-3 overflow-hidden rounded-t-none bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white sm:gap-4 sm:px-6 sm:text-sm"
        style={gridStyle}
      >
        <span>Financial Year</span>
        <span>Department</span>
        <span className="hidden sm:block">Report Type</span>
        <span className="hidden sm:block">Period</span>
        <span className="hidden sm:block">Month</span>
        <span className="hidden text-right sm:block">Action</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4"
        style={gridStyle}
      >
        <select
          value={financialYear}
          onChange={(event) => setFinancialYear(event.target.value)}
          className={inputClass}
        >
          <option value="">Select Financial Year</option>
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
        </select>

        <select
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          className={inputClass}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={reportType}
          onChange={(event) => setReportType(event.target.value)}
          className={inputClass}
        >
          <option value="">Select Report Type</option>
          <option value="monthly-payslip">Monthly Payslip</option>
          <option value="yearly-payslip">Employee payslip (yearly)</option>
          <option value="employee-ctc">Yearly CTC (same layout, annual totals)</option>
        </select>

        <div
          className={`${inputClass} flex min-h-[2.25rem] items-center bg-slate-50 text-slate-700 ${
            !derivedPeriod ? 'text-slate-400' : ''
          }`}
          title="Period is set automatically from Report Type"
        >
          {derivedPeriod || '—'}
        </div>

        <select
          value={monthRequired ? month : '__na__'}
          onChange={(event) => setMonth(event.target.value)}
          disabled={!monthRequired}
          className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-600`}
        >
          {monthRequired ? (
            <>
              <option value="">Select Month</option>
              <option value="Jan">January</option>
              <option value="Feb">February</option>
              <option value="Mar">March</option>
              <option value="Apr">April</option>
              <option value="May">May</option>
              <option value="Jun">June</option>
              <option value="Jul">July</option>
              <option value="Aug">August</option>
              <option value="Sep">September</option>
              <option value="Oct">October</option>
              <option value="Nov">November</option>
              <option value="Dec">December</option>
            </>
          ) : (
            <option value="__na__">N/A</option>
          )}
        </select>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="whitespace-nowrap rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60"
          >
            {loading ? 'Generating…' : 'Generate Report'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mx-4 mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 sm:mx-6">
          {error}
        </div>
      )}

      {reportData !== null && (
        <div
          id="payslip-print-area"
          className="border-t border-slate-200 px-4 py-4 sm:px-6 print:border-t-0"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between print:mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Salary slip report</h2>
              <p className="mt-1 max-w-prose text-xs text-slate-500 print:text-slate-600">
                Individual reference only. Use your browser&apos;s print dialog: select a printer or
                &quot;Save as PDF&quot; / &quot;Microsoft Print to PDF&quot; to keep a copy.
              </p>
              {reportData.payslips[0] &&
              (reportData.payslips[0].reportType === 'yearly-payslip' ||
                reportData.payslips[0].reportType === 'employee-ctc') ? (
                <p className="mt-1 text-xs font-medium text-slate-600 print:text-slate-800">
                  Yearly view: amounts are 12 × monthly salary components (same tables as monthly payslip).
                </p>
              ) : null}
            </div>
            {reportData.payslips.length > 0 ? (
              <button
                type="button"
                onClick={() => window.print()}
                className="print:hidden shrink-0 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Print / Save as PDF
              </button>
            ) : null}
          </div>
          {reportData.payslips.length === 0 ? (
            <p className="text-sm text-slate-500">No records found for the selected filters.</p>
          ) : (
            <div className="space-y-8 print:space-y-0">
              {reportData.payslips.map((ps, idx) => (
                <div
                  key={idx}
                  className={[
                    'overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm print:shadow-none',
                    idx < reportData.payslips.length - 1 ? 'print:break-after-page' : '',
                  ].join(' ')}
                >
                  <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                    {ps.employeeName} ({ps.employeeCode}) · {ps.department}
                  </div>
                  <div className="grid min-w-[720px] grid-cols-[1fr_1fr] gap-0 text-sm">
                    {/* Left: EARNINGS */}
                    <div className="border-r border-slate-200">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-primary text-white">
                            <th className="px-3 py-2 text-left font-semibold">EARNING</th>
                            <th className="px-3 py-2 text-right font-semibold">ACTUAL</th>
                            <th className="px-3 py-2 text-right font-semibold">DEDUCTION</th>
                            <th className="px-3 py-2 text-right font-semibold">EARNED</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {ps.earnings.map((e, i) => (
                            <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                              <td className="px-3 py-1.5 text-slate-700">{e.label}</td>
                              <td className="px-3 py-1.5 text-right text-slate-600">{e.actual}</td>
                              <td className="px-3 py-1.5 text-right text-slate-600">{e.deduction}</td>
                              <td className="px-3 py-1.5 text-right text-slate-600">{e.earned}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-100 font-semibold">
                            <td className="px-3 py-1.5 text-slate-800">GROSS EARNINGS</td>
                            <td colSpan={2} className="px-3 py-1.5 text-right text-slate-800" />
                            <td className="px-3 py-1.5 text-right text-slate-800">{ps.grossEarnings}</td>
                          </tr>
                          <tr className="bg-slate-100 font-semibold">
                            <td className="px-3 py-1.5 text-slate-800">NETT SALARY RELEASE</td>
                            <td colSpan={2} className="px-3 py-1.5 text-right text-slate-800" />
                            <td className="px-3 py-1.5 text-right text-slate-800">{ps.nettSalaryRelease}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Right: DEDUCTIONS */}
                    <div>
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-primary text-white">
                            <th className="px-3 py-2 text-left font-semibold">DETAILS</th>
                            <th className="px-3 py-2 text-right font-semibold">DEDUCTION</th>
                            <th className="px-3 py-2 text-right font-semibold">ACTUAL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {ps.deductions.map((d, i) => (
                            <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                              <td className="px-3 py-1.5 text-slate-700">{d.label}</td>
                              <td className="px-3 py-1.5 text-right text-slate-600">{d.deduction}</td>
                              <td className="px-3 py-1.5 text-right text-slate-600">{d.actual}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-100 font-semibold">
                            <td className="px-3 py-1.5 text-slate-800">GROSS DEDUCTION</td>
                            <td className="px-3 py-1.5 text-right text-slate-800">{ps.totalDeductionColumn}</td>
                            <td className="px-3 py-1.5 text-right text-slate-800">{ps.totalActualColumn}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-sm italic text-slate-700">
                    Rupees in Words: {ps.amountInWords}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

