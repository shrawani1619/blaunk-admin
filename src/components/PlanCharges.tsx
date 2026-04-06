import React from 'react';

const PLANS = [
  { name: 'Standard', duration: '2M Validity', subscription: 300, renewal: 300, luxury: 300 },
  { name: 'Silver', duration: '3M Validity', subscription: 300, renewal: 300, luxury: 300 },
  { name: 'Gold', duration: '6M Validity', subscription: 500, renewal: 500, luxury: 500 },
  { name: 'Platinum', duration: '1Yr Validity', subscription: 999, renewal: 999, luxury: 999 },
  { name: 'Premium', duration: '1Yr Validity', subscription: 1999, renewal: 1999, luxury: 1999 },
  { name: 'Diamond', duration: '2Yr Validity', subscription: 999, renewal: 999, luxury: 999 },
];

export const PlanCharges: React.FC = () => {
  const [planFor, setPlanFor] = React.useState<string>('Slider');
  const [selectedPlans, setSelectedPlans] = React.useState<Record<string, boolean>>({});

  const togglePlan = (name: string, checked: boolean) => {
    setSelectedPlans((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <label className="text-sm font-semibold text-slate-700">Plan for:</label>
        <select
          value={planFor}
          onChange={(event) => setPlanFor(event.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        >
          <option value="Slider">Slider</option>
          <option value="Retail">Retail</option>
          <option value="Corporate">Corporate</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-left text-slate-700">
              <th className="w-10 border-b border-slate-200 px-3 py-2" />
              <th className="border-b border-slate-200 px-3 py-2 font-semibold">Plan</th>
              <th className="border-b border-slate-200 px-3 py-2 font-semibold">Duration</th>
              <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                Subscription (in Rs.)
              </th>
              <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                Renewal Fees (in Rs.)
              </th>
              <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                Luxury Fees (in Rs.)
              </th>
            </tr>
          </thead>
          <tbody>
            {PLANS.map((plan, index) => {
              const striped = index % 2 === 1;
              const checked = !!selectedPlans[plan.name];
              return (
                <tr
                  key={plan.name}
                  className={striped ? 'bg-slate-50' : 'bg-white'}
                >
                  <td className="border-b border-slate-200 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => togglePlan(plan.name, event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                    />
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 text-slate-800">
                    {plan.name}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 text-slate-700">
                    {plan.duration}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 text-slate-700">
                    {plan.subscription}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 text-slate-700">
                    {plan.renewal}
                  </td>
                  <td className="border-b border-slate-200 px-3 py-2 text-slate-700">
                    {plan.luxury}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

