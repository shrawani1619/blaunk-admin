import React from 'react';

const TABS = ['BGT', 'Sponsor Ads'] as const;

const BGT_OPTIONS = [
  'Select Product',
  'BGT ads',
  'Trendy Star',
  'Exclusive',
  'BGT Trending',
  'BGT Housing',
  'BGT Computer',
  'BGT Farmer',
] as const;

const SPONSOR_OPTIONS = [
  'Select Option',
  'Slider A',
  'ADS',
  'Connect farmer',
] as const;
const SPONSOR_SECTIONS = [
  'Select Section',
  'HOMEPAGE',
  'BGT',
  'TOUR',
  'STORE',
  'CAKE',
  'BOUTIQUE',
  'LOGISTIC',
] as const;
const SPONSOR_COUNTRIES = [
  'Select Country',
  'India',
  'Bahrain',
  'Bhutan',
  'Indonesia',
  'Jordan',
  'Malaysia',
  'Maldives',
  'Philippines',
  'Singapore',
  'Sri Lanka',
  'Qatar',
  'Thailand',
  'UAE-Dubai',
  'Vietnam',
] as const;

const PRODUCT_ASPECT_RATIO: Record<string, string> = {
  'Trendy Star': '1.46:1',
  'BGT ads': '1.79:1',
  Exclusive: '3.84:1',
  'BGT Trending': '4.80:1',
  'BGT Housing': '4.22:1',
  'BGT Computer': '3.62:1',
  'BGT Farmer': '2.17:1',
};

export const MAUploadPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<(typeof TABS)[number]>('BGT');
  const [selectedProduct, setSelectedProduct] = React.useState('');
  const [sponsorSection, setSponsorSection] = React.useState('');
  const [sponsorOption, setSponsorOption] = React.useState('');
  const [sponsorCountry, setSponsorCountry] = React.useState('');
  const [files, setFiles] = React.useState<Record<number, string>>({});
  const [previews, setPreviews] = React.useState<Record<number, string>>({});
  const [aspectRatio, setAspectRatio] = React.useState('1.46:1');

  const productOptions = activeTab === 'BGT' ? BGT_OPTIONS : SPONSOR_OPTIONS;

  React.useEffect(() => {
    setSelectedProduct('');
    setSponsorSection('');
    setSponsorOption('');
    setSponsorCountry('');
    setFiles({});
    setPreviews({});
  }, [activeTab]);

  React.useEffect(() => {
    if (!selectedProduct) {
      setAspectRatio('1.46:1');
      return;
    }
    setAspectRatio(PRODUCT_ASPECT_RATIO[selectedProduct] || '1.46:1');
  }, [selectedProduct]);

  return (
    <div className="mx-auto flex max-w-[100rem] flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-sm bg-slate-200/70 p-1.5 w-fit" role="tablist" aria-label="M and A sections">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={[
                  'rounded-sm px-8 py-3 text-base font-semibold transition',
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-transparent text-slate-800 hover:bg-white',
                ].join(' ')}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="rounded-sm bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Save
        </button>
      </div>

      {activeTab === 'Sponsor Ads' ? (
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="max-w-sm">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Section</label>
              <select
                value={sponsorSection}
                onChange={(e) => {
                  setSponsorSection(e.target.value);
                  setSponsorOption('');
                  setSponsorCountry('');
                }}
                className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
              >
                {SPONSOR_SECTIONS.map((section) => (
                  <option key={section} value={section === 'Select Section' ? '' : section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            {sponsorSection ? (
              <>
                <div className="max-w-sm">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Options</label>
                  <select
                    value={sponsorOption}
                    onChange={(e) => setSponsorOption(e.target.value)}
                    className="sponsor-options-case h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
                  >
                    {SPONSOR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt === 'Select Option' ? '' : opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="max-w-sm">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Country</label>
                  <select
                    value={sponsorCountry}
                    onChange={(e) => setSponsorCountry(e.target.value)}
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
                  >
                    {SPONSOR_COUNTRIES.map((country) => (
                      <option key={country} value={country === 'Select Country' ? '' : country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : null}
          </div>
        </section>
      ) : (
        <>
          <div className="max-w-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Select Option</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            >
              {productOptions.map((opt) => (
                <option key={opt} value={opt === 'Select Product' ? '' : opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct ? (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Upload for: {selectedProduct}</h2>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Aspect ratio selection</p>
            <label className="inline-flex items-center gap-2 text-sm text-slate-800">
              <input
                type="radio"
                name="ratio"
                value={aspectRatio}
                checked
                readOnly
                className="accent-cyan-600"
              />
              {aspectRatio}
            </label>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => {
              const slot = idx + 1;
              const fileName = files[slot] || 'Click to update (max 400KB)';
              const preview = previews[slot] || '';
              return (
                <div key={slot} className="flex flex-col items-center gap-2">
                  <p className="text-xl font-bold text-slate-800">
                    {selectedProduct} {slot}
                  </p>
                  <label className="flex h-44 w-44 cursor-pointer flex-col overflow-hidden rounded border border-red-300 bg-white">
                    <div className="border-b border-red-300 bg-[#ececab] px-2 py-2 text-center text-xs font-semibold text-slate-700">
                      Image
                    </div>
                    {preview ? (
                      <div className="flex flex-1 items-center justify-center bg-slate-400 p-2">
                        <img src={preview} alt={`${selectedProduct} ${slot}`} className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-center px-2 text-center text-[11px] text-red-500">
                        {fileName}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 400 * 1024) {
                          return;
                        }
                        const objectUrl = URL.createObjectURL(file);
                        setFiles((prev) => ({ ...prev, [slot]: file.name }));
                        setPreviews((prev) => ({ ...prev, [slot]: objectUrl }));
                      }}
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </section>
          ) : null}
        </>
      )}
    </div>
  );
};
