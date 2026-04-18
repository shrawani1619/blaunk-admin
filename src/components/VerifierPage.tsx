import React from 'react';

const TABS = ['MIS', 'Verifier'] as const;

const inputClass =
  'h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25';
const disabledFieldClass = `${inputClass} cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500`;
const ALL_COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
  'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia',
  'Comoros', 'Congo', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
  'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
  'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
  'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste',
  'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
] as const;
const selectStatusOptions = ['Select Option', 'Pending', 'Verified', 'Refused', 'Re-Upload'] as const;
const productOptions = ['Select a Product', 'Cake', 'Store', 'Tour', 'BGT - B2B', 'Boutique', 'Logistics'] as const;
const shopLocationOptions = ['Select Option', 'Pending', 'Verified', 'Not Found', 'Criminal Issue'] as const;
const verifierStatusOptions = ['Select Status', 'Approved', 'Re-upload', 'Block Vendor'] as const;
const currencyOptions = ['INR', 'USD', 'BHD', 'BTN', 'IDR', 'JOD', 'MYR', 'MVR', 'PHP', 'SGD', 'LKR', 'QAR', 'THB', 'AED', 'VND'] as const;

export const VerifierPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<(typeof TABS)[number]>('MIS');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [reportType, setReportType] = React.useState('mis-verifier');
  const [loginId, setLoginId] = React.useState('sample@example.com');
  const [country, setCountry] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [emailStatus, setEmailStatus] = React.useState('Select Option');
  const [mobileStatus, setMobileStatus] = React.useState('Select Option');
  const [product, setProduct] = React.useState('Select a Product');
  const [photoStatus, setPhotoStatus] = React.useState('Select Option');
  const [bankStatus, setBankStatus] = React.useState('Select Option');
  const [shopLocation, setShopLocation] = React.useState('Select Option');
  const [promoterStatus, setPromoterStatus] = React.useState('Select Option');
  const [dataEntryStatus, setDataEntryStatus] = React.useState('Select Option');
  const [documentStatus, setDocumentStatus] = React.useState('Select Option');
  const [verifierStatus, setVerifierStatus] = React.useState('Select Status');
  const [currency, setCurrency] = React.useState('INR');
  const [fees, setFees] = React.useState('');

  return (
    <section className="flex w-full flex-col gap-4">
      <nav className="flex flex-wrap gap-2 overflow-x-auto" aria-label="Verifier tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={[
              'rounded-sm border px-8 py-3 text-base font-semibold shadow-sm transition',
              activeTab === tab
                ? 'border-primary bg-primary text-white hover:bg-primary-dark'
                : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'MIS' && (
        <>
          <h2 className="text-4xl font-bold text-primary">MIS</h2>

          <div className="overflow-x-auto rounded-sm border border-primary bg-white shadow-sm">
            <div
              className="grid min-w-[1100px] gap-0 bg-primary px-2 py-3 text-left text-sm font-semibold text-white"
              style={{ gridTemplateColumns: '1.1fr 1.1fr 1fr 1fr 1fr 1fr 0.95fr' }}
            >
              <div className="px-2">From Date</div>
              <div className="px-2">To Date</div>
              <div className="px-2">Department</div>
              <div className="px-2">Business Code</div>
              <div className="px-2">Report Type</div>
              <div className="px-2">Output Format</div>
              <div className="px-2">Actions</div>
            </div>

            <div
              className="grid min-w-[1100px] items-center gap-3 border-t border-primary/30 bg-white px-2 py-3"
              style={{ gridTemplateColumns: '1.1fr 1.1fr 1fr 1fr 1fr 1fr 0.95fr' }}
            >
              <div className="px-1">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className={`${inputClass} [color-scheme:light]`}
                  aria-label="From date"
                />
              </div>
              <div className="px-1">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className={`${inputClass} [color-scheme:light]`}
                  aria-label="To date"
                />
              </div>
              <div className="px-1">
                <div className={`${inputClass} flex items-center bg-slate-100 font-semibold text-slate-700`}>
                  Verifier
                </div>
              </div>
              <div className="px-1">
                <div className={`${inputClass} flex items-center bg-slate-100 font-semibold text-slate-700`}>
                  PRAV2154A
                </div>
              </div>
              <div className="px-1">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className={disabledFieldClass}
                  disabled
                >
                  <option value="mis-verifier">MIS - Verifier</option>
                </select>
              </div>
              <div className="px-1">
                <div className={`${disabledFieldClass} flex items-center font-semibold`}>
                  Excel
                </div>
              </div>
              <div className="px-1">
                <button
                  type="button"
                  className="inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Verifier' && (
        <>
          <h2 className="text-4xl font-bold text-primary">Verifier</h2>

          <div className="overflow-x-auto rounded-sm border border-slate-300 bg-white shadow-sm">
            <table className="min-w-[2100px] w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Date</th>
                  <th className="min-w-[8rem] border border-white/25 px-2 py-2 font-bold">Login ID</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Country</th>
                  <th className="min-w-[8rem] border border-white/25 px-2 py-2 font-bold">Company Name</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Email</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Mobile No.</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Product</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Photo</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Bank</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Shop Location</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Promoter</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Data Entry</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Documents</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Status</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Currency</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Fees</th>
                  <th className="min-w-[7rem] border border-white/25 px-2 py-2 font-bold">Verifier ID</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200 bg-white">
                  <td className="border border-slate-200 p-1">
                    <input type="text" readOnly value="04/17/2026" className={`${inputClass} bg-slate-100`} />
                  </td>
                  <td className="border border-slate-200 p-1">
                    <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} className={inputClass} />
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass}>
                      <option value="">Select Country</option>
                      {ALL_COUNTRIES.map((countryName) => (
                        <option key={countryName} value={countryName}>
                          {countryName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} placeholder="Enter Company" />
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={emailStatus} onChange={(e) => setEmailStatus(e.target.value)} className={inputClass}>
                      {selectStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={mobileStatus} onChange={(e) => setMobileStatus(e.target.value)} className={inputClass}>
                      {selectStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={product} onChange={(e) => setProduct(e.target.value)} className={inputClass}>
                      {productOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={photoStatus} onChange={(e) => setPhotoStatus(e.target.value)} className={inputClass}>
                      {selectStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={bankStatus} onChange={(e) => setBankStatus(e.target.value)} className={inputClass}>
                      {selectStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={shopLocation} onChange={(e) => setShopLocation(e.target.value)} className={inputClass}>
                      {shopLocationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={promoterStatus} onChange={(e) => setPromoterStatus(e.target.value)} className={inputClass}>
                      {shopLocationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={dataEntryStatus} onChange={(e) => setDataEntryStatus(e.target.value)} className={inputClass}>
                      {selectStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={documentStatus} onChange={(e) => setDocumentStatus(e.target.value)} className={inputClass}>
                      {selectStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={verifierStatus} onChange={(e) => setVerifierStatus(e.target.value)} className={inputClass}>
                      {verifierStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
                      {currencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-slate-200 p-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={fees}
                      onChange={(e) => setFees(e.target.value.replace(/\D/g, ''))}
                      className={inputClass}
                      placeholder=""
                    />
                  </td>
                  <td className="border border-slate-200 px-2 py-1.5 text-slate-800">1A23FA</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
        </>
      )}
    </section>
  );
};
