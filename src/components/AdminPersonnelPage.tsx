import React from 'react';

const TABS = [
  'Country Login',
  'MIS',
  'Country Media',
  'Tag',
  'Verifier',
  'Media',
  'Contest',
] as const;

// Flag images from Flagpedia (reliable public source; Google does not provide a flag CDN)
const FLAG_BASE = 'https://flagpedia.net/data/flags/w160';

function Flag({ code, size = 24 }: { code: string; size?: number }) {
  if (!code || code.length !== 2) return null;
  const c = code.toLowerCase();
  const src = `${FLAG_BASE}/${c}.webp`;
  return (
    <img
      src={src}
      alt=""
      className="inline-block shrink-0 rounded-sm object-cover shadow-sm"
      width={size}
      height={Math.round(size * 0.75)}
      loading="lazy"
    />
  );
}

type CountryLoginRow = {
  country: string;
  code: string;
  visitor: number;
  web: number;
  android: number;
  ios: number;
};

const MOCK_COUNTRY_LOGIN: CountryLoginRow[] = [
  { country: 'India', code: 'IN', visitor: 120, web: 50, android: 30, ios: 40 },
  { country: 'Bahrain', code: 'BH', visitor: 45, web: 20, android: 15, ios: 10 },
  { country: 'Bangladesh', code: 'BD', visitor: 80, web: 35, android: 25, ios: 20 },
  { country: 'Bhutan', code: 'BT', visitor: 22, web: 10, android: 6, ios: 6 },
  { country: 'Indonesia', code: 'ID', visitor: 95, web: 40, android: 30, ios: 25 },
  { country: 'Jordan', code: 'JO', visitor: 38, web: 18, android: 10, ios: 10 },
  { country: 'Malaysia', code: 'MY', visitor: 72, web: 32, android: 22, ios: 18 },
  { country: 'Maldives', code: 'MV', visitor: 60, web: 25, android: 20, ios: 15 },
  { country: 'Nepal', code: 'NP', visitor: 55, web: 25, android: 18, ios: 12 },
  { country: 'Philippines', code: 'PH', visitor: 88, web: 38, android: 28, ios: 22 },
  { country: 'Singapore', code: 'SG', visitor: 160, web: 80, android: 40, ios: 40 },
  { country: 'Sri Lanka', code: 'LK', visitor: 62, web: 28, android: 20, ios: 14 },
  { country: 'Qatar', code: 'QA', visitor: 42, web: 20, android: 12, ios: 10 },
  { country: 'Thailand', code: 'TH', visitor: 105, web: 45, android: 35, ios: 25 },
  { country: 'UAE-Dubai', code: 'AE', visitor: 180, web: 80, android: 60, ios: 40 },
  { country: 'Vietnam', code: 'VN', visitor: 90, web: 40, android: 30, ios: 20 },
];

export const AdminPersonnelPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<(typeof TABS)[number]>('Country Login');

  return (
    <section className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card">
      <h1 className="border-b border-slate-200 bg-primary px-4 py-3 text-xl font-semibold text-white sm:px-6">
        Admin & Personnel
      </h1>

      <div className="border-b border-slate-200 bg-slate-50">
        <nav className="flex gap-1 overflow-x-auto px-4 sm:px-6" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition',
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === 'Country Login' && (
          <>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Country Wise Login
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Visitor</th>
                    <th className="px-4 py-3 font-medium">Web based</th>
                    <th className="px-4 py-3 font-medium">Android</th>
                    <th className="px-4 py-3 font-medium">iOS</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {MOCK_COUNTRY_LOGIN.map((row, index) => (
                    <tr
                      key={row.code}
                      className={
                        index % 2 === 0
                          ? 'bg-white hover:bg-slate-50'
                          : 'bg-slate-50/70 hover:bg-slate-100'
                      }
                    >
                      <td className="flex items-center gap-2 px-4 py-3 font-medium text-slate-800">
                        <Flag code={row.code} size={24} />
                        {row.country}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.visitor}</td>
                      <td className="px-4 py-3 text-slate-600">{row.web}</td>
                      <td className="px-4 py-3 text-slate-600">{row.android}</td>
                      <td className="px-4 py-3 text-slate-600">{row.ios}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {row.visitor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {activeTab !== 'Country Login' && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500">
            {activeTab} content coming soon.
          </div>
        )}
      </div>
    </section>
  );
};
