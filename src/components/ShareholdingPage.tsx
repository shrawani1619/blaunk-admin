import React from 'react';
import { API_BASE } from '../config';

function getAuthHeaders(includeJson = true): HeadersInit {
  const token = window.localStorage.getItem('authToken');
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (includeJson) headers['Content-Type'] = 'application/json';
  return headers;
}

const FIELD_CLASSES =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30';

type ShareholdingForm = {
  pan: string;
  name: string;
  mobile: string;
  email: string;
  aadhaar: string;
  address: string;
  city: string;
  landmark: string;
  country: string;
  gender: string;
  holdingPercent: string;
  shareType: string;
  faceValue: string;
  numberOfShares: string;
  mode: string;
  isinCode: string;
  dpNumber: string;
  folioNumber: string;
  distinctiveFrom: string;
  distinctiveTo: string;
  yearOfIssuance: string;
  stakeholder: string;
  dateOfAllotment: string;
  remarks: string;
  exitDate: string;
  year: string;
  bankName: string;
  ifscCode: string;
  bankAccountNumber: string;
  pledge: string;
};

type NomineeForm = {
  name: string;
  mobile: string;
  relation: string;
  percentage: string;
  pan: string;
};

const emptyShareholding: ShareholdingForm = {
  pan: '',
  name: '',
  mobile: '',
  email: '',
  aadhaar: '',
  address: '',
  city: '',
  landmark: '',
  country: '',
  gender: '',
  holdingPercent: '',
  shareType: '',
  faceValue: '',
  numberOfShares: '',
  mode: '',
  isinCode: '',
  dpNumber: '',
  folioNumber: '',
  distinctiveFrom: '',
  distinctiveTo: '',
  yearOfIssuance: '',
  stakeholder: '',
  dateOfAllotment: '',
  remarks: '',
  exitDate: '',
  year: '',
  bankName: '',
  ifscCode: '',
  bankAccountNumber: '',
  pledge: 'NA',
};

const emptyNominee: NomineeForm = {
  name: '',
  mobile: '',
  relation: '',
  percentage: '',
  pan: '',
};

const FINANCIAL_YEARS = Array.from({ length: 2100 - 2024 + 1 }, (_, i) => 2024 + i);

const CS_MIS_MONTHS = [
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
] as const;

type HrCredentialSlice = {
  pan?: string;
  employeeName?: string;
  mobile?: string;
  email?: string;
  aadhaar?: string;
  address?: string;
  city?: string;
  country?: string;
  gender?: string;
  bankName?: string;
  ifscCode?: string;
  bankAccountNumber?: string;
  exitDate?: string;
};

function credentialToShareholdingBase(c: HrCredentialSlice): Partial<ShareholdingForm> {
  return {
    name: c.employeeName || '',
    mobile: c.mobile || '',
    email: c.email || '',
    aadhaar: c.aadhaar || '',
    address: c.address || '',
    city: c.city || '',
    country: c.country || '',
    gender: c.gender || '',
    bankName: c.bankName || '',
    ifscCode: c.ifscCode || '',
    bankAccountNumber: c.bankAccountNumber || '',
    exitDate: c.exitDate || '',
  };
}

export const ShareholdingPage: React.FC = () => {
  const [searchPan, setSearchPan] = React.useState('');
  const [activeInnerTab, setActiveInnerTab] = React.useState<'shareholding' | 'mis'>('shareholding');
  const [isEditing, setIsEditing] = React.useState(false);
  const [form, setForm] = React.useState<ShareholdingForm>(emptyShareholding);
  const [nominees, setNominees] = React.useState<NomineeForm[]>([
    { ...emptyNominee },
    { ...emptyNominee },
    { ...emptyNominee },
  ]);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [loadingRecord, setLoadingRecord] = React.useState(false);
  const [csMisFinancialYear, setCsMisFinancialYear] = React.useState('');
  const [csMisMonth, setCsMisMonth] = React.useState<string>('April');
  const [csMisDepartment, setCsMisDepartment] = React.useState('');
  const [csMisReportType] = React.useState('MIS-Shareholding');
  const [csMisPeriod] = React.useState('Monthly');
  const [csMisStatus, setCsMisStatus] = React.useState('');
  const [csMisFormat, setCsMisFormat] = React.useState('Excel');
  const [misExporting, setMisExporting] = React.useState(false);
  const [misMessage, setMisMessage] = React.useState<string | null>(null);

  const updateField = (key: keyof ShareholdingForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateNomineeField = (index: number, key: keyof NomineeForm, value: string) => {
    setNominees((previous) =>
      previous.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage(null);
    const pan = searchPan.trim();
    if (!pan) {
      setStatusMessage('Please enter a PAN to search.');
      return;
    }

    try {
      setLoadingRecord(true);
      const response = await fetch(`${API_BASE}/api/shareholding/${encodeURIComponent(pan)}`, {
        headers: getAuthHeaders(false),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setForm({ ...emptyShareholding, pan: pan.toUpperCase() });
          setNominees([{ ...emptyNominee }, { ...emptyNominee }, { ...emptyNominee }]);
          setStatusMessage(
            'No shareholding or HR credential found for this PAN. Enter details after Edit, then save.',
          );
          setIsEditing(false);
          return;
        }
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to load shareholding record.');
      }

      const data = await response.json();
      const record = data.record as
        | (Partial<ShareholdingForm & { nominees?: NomineeForm[] }> & Record<string, unknown>)
        | null
        | undefined;
      const credential = data.credential as HrCredentialSlice | null | undefined;

      const fromCred = credential ? credentialToShareholdingBase(credential) : {};
      let fromSh: Partial<ShareholdingForm> & { pan?: string } = { pan: pan.toUpperCase() };
      if (record) {
        const { nominees: _omitNominees, ...recordFields } = record as ShareholdingForm & {
          nominees?: NomineeForm[];
        };
        fromSh = {
          ...recordFields,
          pan: String(record.pan ?? pan).toUpperCase(),
          holdingPercent:
            record.holdingPercent?.toString?.() ?? String(record.holdingPercent ?? '') ?? '',
          faceValue: record.faceValue?.toString?.() ?? String(record.faceValue ?? '') ?? '',
          numberOfShares:
            record.numberOfShares?.toString?.() ?? String(record.numberOfShares ?? '') ?? '',
        };
      }

      setForm({
        ...emptyShareholding,
        ...fromCred,
        ...fromSh,
        pan: String(fromSh.pan || credential?.pan || pan).toUpperCase(),
      });

      const incomingNominees = (record?.nominees ?? []) as NomineeForm[];
      const filledNominees = [
        incomingNominees[0] ?? { ...emptyNominee },
        incomingNominees[1] ?? { ...emptyNominee },
        incomingNominees[2] ?? { ...emptyNominee },
      ];
      setNominees(filledNominees);
      setIsEditing(false);
      if (record && credential) {
        setStatusMessage('Loaded shareholding and HR credential (same PAN). Click Edit to modify.');
      } else if (record) {
        setStatusMessage('Shareholding loaded. Click Edit to modify.');
      } else {
        setStatusMessage(
          'HR credential loaded; no shareholding record yet. Click Edit, add share details, then Save.',
        );
      }
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : 'Unexpected error while loading shareholding record.';
      setStatusMessage(message);
    } finally {
      setLoadingRecord(false);
    }
  };

  const handleSave = async () => {
    setStatusMessage(null);
    if (!form.pan.trim()) {
      setStatusMessage('PAN Card No. is required before saving.');
      return;
    }

    setSaving(true);
    try {
      const cleanedNominees = nominees
        .map((nominee) => ({
          ...nominee,
          percentage: nominee.percentage ? Number(nominee.percentage) : undefined,
        }))
        .filter(
          (nominee) =>
            nominee.name ||
            nominee.mobile ||
            nominee.relation ||
            nominee.pan ||
            (nominee.percentage ?? 0) > 0,
        );

      const payload = {
        pan: form.pan.trim(),
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        aadhaar: form.aadhaar,
        address: form.address,
        city: form.city,
        landmark: form.landmark,
        country: form.country,
        gender: form.gender,
        holdingPercent: form.holdingPercent ? Number(form.holdingPercent) : undefined,
        shareType: form.shareType,
        faceValue: form.faceValue ? Number(form.faceValue) : undefined,
        numberOfShares: form.numberOfShares ? Number(form.numberOfShares) : undefined,
        mode: form.mode,
        isinCode: form.isinCode,
        dpNumber: form.dpNumber,
        folioNumber: form.folioNumber,
        distinctiveFrom: form.distinctiveFrom,
        distinctiveTo: form.distinctiveTo,
        yearOfIssuance: form.yearOfIssuance,
        stakeholder: form.stakeholder,
        dateOfAllotment: form.dateOfAllotment,
        remarks: form.remarks,
        exitDate: form.exitDate,
        year: form.year,
        bankName: form.bankName,
        ifscCode: form.ifscCode,
        bankAccountNumber: form.bankAccountNumber,
        pledge: form.pledge,
        nominees: cleanedNominees,
      };

      const response = await fetch(`${API_BASE}/api/shareholding`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to save shareholding record.');
      }

      setIsEditing(false);
      setStatusMessage('Shareholding record saved successfully.');
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : 'Unexpected error while saving shareholding record.';
      setStatusMessage(message);
    } finally {
      setSaving(false);
    }
  };

  const handleMisExport = async (event: React.FormEvent) => {
    event.preventDefault();
    setMisMessage(null);
    if (!csMisFinancialYear) {
      setMisMessage('Select financial year.');
      return;
    }
    setMisExporting(true);
    try {
      const response = await fetch(`${API_BASE}/api/shareholding/mis-export`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          financialYear: csMisFinancialYear,
          month: csMisMonth,
          ...(csMisDepartment ? { department: csMisDepartment } : {}),
          ...(csMisStatus ? { status: csMisStatus } : {}),
          format: csMisFormat,
          reportType: csMisReportType,
          period: csMisPeriod,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || 'MIS export failed.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'company-sec-mis-shareholding.xlsx';
      a.click();
      URL.revokeObjectURL(url);
      setMisMessage('Report downloaded.');
    } catch (cause) {
      setMisMessage(cause instanceof Error ? cause.message : 'MIS export failed.');
    } finally {
      setMisExporting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      {/* Inner tabs */}
      <div className="flex gap-1 rounded-full bg-slate-200/70 p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveInnerTab('shareholding')}
          className={[
            'rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition',
            activeInnerTab === 'shareholding'
              ? 'bg-primary text-white'
              : 'bg-transparent text-slate-700 hover:bg-white',
          ].join(' ')}
        >
          Shareholding
        </button>
        <button
          type="button"
          onClick={() => setActiveInnerTab('mis')}
          className={[
            'rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm transition',
            activeInnerTab === 'mis'
              ? 'bg-primary text-white'
              : 'bg-transparent text-slate-700 hover:bg-white',
          ].join(' ')}
        >
          MIS
        </button>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-xl items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 shadow-card"
      >
        <input
          type="text"
          value={searchPan}
          onChange={(event) => setSearchPan(event.target.value)}
          placeholder="Search by PAN"
          className="flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white shadow-sm transition hover:bg-primary-dark"
          aria-label="Search"
        >
          🔍
        </button>
      </form>

      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">
          {activeInnerTab === 'shareholding' ? 'Shareholding' : 'MIS'}
        </h1>
        {activeInnerTab === 'shareholding' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setStatusMessage(null);
              }}
              className="rounded-md border border-primary px-4 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/10 disabled:opacity-60"
              disabled={isEditing}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isEditing || saving}
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-primary/60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        ) : null}
      </div>

      {statusMessage ? (
        <p className="text-sm text-slate-700">{statusMessage}</p>
      ) : null}

      {activeInnerTab === 'shareholding' ? (
      /* Form grid */
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
        <fieldset
          disabled={!isEditing}
          className="space-y-6 [&:disabled_input]:bg-slate-50 [&:disabled_select]:bg-slate-50 [&:disabled_input]:cursor-not-allowed [&:disabled_select]:cursor-not-allowed"
        >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Row 1 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Name
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Name"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Mobile No.
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Enter Mobile No."
              value={form.mobile}
              onChange={(event) => updateField('mobile', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Email
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              PAN Card No.
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="PAN"
              value={form.pan}
              onChange={(event) => updateField('pan', event.target.value.toUpperCase())}
            />
          </div>

          {/* Row 2 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Aadhaar No.
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Aadhaar"
              value={form.aadhaar}
              onChange={(event) => updateField('aadhaar', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Address
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Address"
              value={form.address}
              onChange={(event) => updateField('address', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              City
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="City"
              value={form.city}
              onChange={(event) => updateField('city', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Landmark / Area
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Landmark"
              value={form.landmark}
              onChange={(event) => updateField('landmark', event.target.value)}
            />
          </div>

          {/* Row 3 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Country
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Country"
              value={form.country}
              onChange={(event) => updateField('country', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Gender
            </label>
            <select
              className={FIELD_CLASSES}
              value={form.gender}
              onChange={(event) => updateField('gender', event.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Holding (%)
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Holding Percentage"
              value={form.holdingPercent}
              onChange={(event) => updateField('holdingPercent', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Share Type
            </label>
            <select
              className={FIELD_CLASSES}
              value={form.shareType}
              onChange={(event) => updateField('shareType', event.target.value)}
            >
              <option value="">Select Share Type</option>
              <option value="equity">Equity</option>
              <option value="preference">Preference</option>
            </select>
          </div>

          {/* Row 4 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Face Value
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Face Value"
              value={form.faceValue}
              onChange={(event) => updateField('faceValue', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              No. of Shares
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="No. of Shares"
              value={form.numberOfShares}
              onChange={(event) => updateField('numberOfShares', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Mode
            </label>
            <select
              className={FIELD_CLASSES}
              value={form.mode}
              onChange={(event) => updateField('mode', event.target.value)}
            >
              <option value="">Select Mode</option>
              <option value="demat">Demat</option>
              <option value="physical">Physical</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              ISIN Code
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="ISIN Code"
              value={form.isinCode}
              onChange={(event) => updateField('isinCode', event.target.value)}
            />
          </div>

          {/* Row 5 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              DP Number
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Enter DP Number"
              value={form.dpNumber}
              onChange={(event) => updateField('dpNumber', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Folio Number
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Enter Folio Number"
              value={form.folioNumber}
              onChange={(event) => updateField('folioNumber', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Distinctive No(s) From
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Distinctive No(s) From"
              value={form.distinctiveFrom}
              onChange={(event) => updateField('distinctiveFrom', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Distinctive No(s) To
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Distinctive No(s) To"
              value={form.distinctiveTo}
              onChange={(event) => updateField('distinctiveTo', event.target.value)}
            />
          </div>

          {/* Row 6 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Year of Issuance
            </label>
            <select
              className={FIELD_CLASSES}
              value={form.yearOfIssuance}
              onChange={(event) => updateField('yearOfIssuance', event.target.value)}
            >
              <option value="">Select Year</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Stakeholder
            </label>
            <select
              className={FIELD_CLASSES}
              value={form.stakeholder}
              onChange={(event) => updateField('stakeholder', event.target.value)}
            >
              <option value="">Select Stakeholder</option>
              <option value="promoter">Promoter</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Date of Allotment
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="mm/dd/yyyy"
              value={form.dateOfAllotment}
              onChange={(event) => updateField('dateOfAllotment', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Remarks
            </label>
            <select
              className={FIELD_CLASSES}
              value={form.remarks}
              onChange={(event) => updateField('remarks', event.target.value)}
            >
              <option value="">Select Remarks</option>
              <option value="na">NA</option>
              <option value="pledged">Pledged</option>
            </select>
          </div>

          {/* Rows 7 & 8: final sequence */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Exit Date
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="mm/dd/yyyy"
              value={form.exitDate}
              onChange={(event) => updateField('exitDate', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Year
            </label>
            <select
              className={FIELD_CLASSES}
              value={form.year}
              onChange={(event) => updateField('year', event.target.value)}
            >
              <option value="">Select Year</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Bank Name
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Enter Bank Name"
              value={form.bankName}
              onChange={(event) => updateField('bankName', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              IFSC Code
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="IFSC Code"
              value={form.ifscCode}
              onChange={(event) => updateField('ifscCode', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Bank Account No.
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="Bank Account No."
              value={form.bankAccountNumber}
              onChange={(event) => updateField('bankAccountNumber', event.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Pledge
            </label>
            <input
              className={FIELD_CLASSES}
              placeholder="NA"
              value={form.pledge}
              onChange={(event) => updateField('pledge', event.target.value)}
            />
          </div>
        </div>

        {/* Nominees section */}
        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-primary">Nominees</h2>

          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 md:grid-cols-[2fr,2fr,2fr,1fr,2fr]"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Name
                </label>
                <input
                  className={FIELD_CLASSES}
                  placeholder="Nominee Name"
                  value={nominees[index - 1]?.name ?? ''}
                  onChange={(event) =>
                    updateNomineeField(index - 1, 'name', event.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Mobile No.
                </label>
                <input
                  className={FIELD_CLASSES}
                  placeholder="Mobile No."
                  value={nominees[index - 1]?.mobile ?? ''}
                  onChange={(event) =>
                    updateNomineeField(index - 1, 'mobile', event.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Relation
                </label>
                <input
                  className={FIELD_CLASSES}
                  placeholder="Relation"
                  value={nominees[index - 1]?.relation ?? ''}
                  onChange={(event) =>
                    updateNomineeField(index - 1, 'relation', event.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  (%)
                </label>
                <input
                  className={FIELD_CLASSES}
                  placeholder="%"
                  value={nominees[index - 1]?.percentage ?? ''}
                  onChange={(event) =>
                    updateNomineeField(index - 1, 'percentage', event.target.value)
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  PAN
                </label>
                <input
                  className={FIELD_CLASSES}
                  placeholder="PAN"
                  value={nominees[index - 1]?.pan ?? ''}
                  onChange={(event) =>
                    updateNomineeField(index - 1, 'pan', event.target.value.toUpperCase())
                  }
                />
              </div>
            </div>
          ))}
        </div>
        </fieldset>
      </section>
      ) : (
        <section className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
          <h2 className="mb-2 text-2xl font-semibold text-primary">MIS</h2>
          <p className="mb-4 max-w-3xl text-sm text-slate-600">
            Exports shareholding records updated in the selected FY month, joined with HR employee credentials on
            the same PAN (department / status filters use the credential master).
          </p>
          {misMessage ? (
            <p className="mb-4 text-sm text-slate-700" role="status">
              {misMessage}
            </p>
          ) : null}

          <div
            className="overflow-hidden rounded-t-xl bg-primary text-xs font-semibold uppercase tracking-wide text-white sm:text-sm"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'minmax(5rem, 1fr) minmax(5rem, 1fr) minmax(6rem, 1fr) minmax(7rem, 1.2fr) minmax(5rem, 1fr) minmax(5rem, 1fr) minmax(6rem, 1fr) auto',
            }}
          >
            <div className="px-3 py-2.5 sm:px-4">Financial Year</div>
            <div className="px-3 py-2.5 sm:px-4">Month</div>
            <div className="px-3 py-2.5 sm:px-4">Department</div>
            <div className="px-3 py-2.5 sm:px-4">Report Type</div>
            <div className="px-3 py-2.5 sm:px-4">Period</div>
            <div className="px-3 py-2.5 sm:px-4">Status</div>
            <div className="px-3 py-2.5 sm:px-4">Output Format</div>
            <div className="px-3 py-2.5 text-right sm:px-4">Actions</div>
          </div>

          <form
            onSubmit={handleMisExport}
            className="grid gap-3 border border-t-0 border-slate-200 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4"
            style={{
              gridTemplateColumns:
                'minmax(5rem, 1fr) minmax(5rem, 1fr) minmax(6rem, 1fr) minmax(7rem, 1.2fr) minmax(5rem, 1fr) minmax(5rem, 1fr) minmax(6rem, 1fr) auto',
            }}
          >
            <select
              value={csMisFinancialYear}
              onChange={(event) => setCsMisFinancialYear(event.target.value)}
              className="min-w-0 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select year</option>
              {FINANCIAL_YEARS.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={csMisMonth}
              onChange={(event) => setCsMisMonth(event.target.value)}
              className="min-w-0 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              {CS_MIS_MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={csMisDepartment}
              onChange={(event) => setCsMisDepartment(event.target.value)}
              className="min-w-0 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All departments</option>
              <option value="Payroll">Payroll</option>
              <option value="HR - Credential">HR - Credential</option>
              <option value="3P - Credential">3P - Credential</option>
              <option value="Deduction">Deduction</option>
              <option value="Company Secretary">Company Secretary</option>
              <option value="Management">Management</option>
              <option value="Finance">Finance</option>
            </select>

            <input
              readOnly
              value={csMisReportType}
              className="min-w-0 w-full cursor-default rounded-md border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm text-slate-900 shadow-sm"
            />

            <input
              readOnly
              value={csMisPeriod}
              className="min-w-0 w-full cursor-default rounded-md border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm text-slate-900 shadow-sm"
            />

            <select
              value={csMisStatus}
              onChange={(event) => setCsMisStatus(event.target.value)}
              className="min-w-0 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All statuses</option>
              <option value="Active">Active</option>
              <option value="Exit">Exit</option>
              <option value="On Hold">On Hold</option>
            </select>

            <select
              value={csMisFormat}
              onChange={(event) => setCsMisFormat(event.target.value)}
              className="min-w-0 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              <option value="Excel">Excel</option>
              <option value="PDF">PDF</option>
            </select>

            <div className="flex min-w-0 justify-end">
              <button
                type="submit"
                disabled={misExporting}
                className="whitespace-nowrap rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {misExporting ? 'Generating…' : 'Generate Report'}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

