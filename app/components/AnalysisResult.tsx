'use client';

import { NutritionAnalysisResult } from '@/lib/types';

interface AnalysisResultProps {
  result: NutritionAnalysisResult;
}

function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'High':
      return 'bg-red-100 border-red-500 text-red-900';
    case 'Medium':
      return 'bg-yellow-100 border-yellow-500 text-yellow-900';
    default:
      return 'bg-emerald-100 border-emerald-500 text-emerald-900';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'SAM':
      return 'text-red-700 font-bold';
    case 'MAM':
      return 'text-orange-700 font-semibold';
    case 'Underweight':
      return 'text-orange-600 font-semibold';
    case 'Overweight':
      return 'text-yellow-700';
    case 'Obesity':
      return 'text-red-600 font-semibold';
    default:
      return 'text-emerald-700';
  }
}

function getTrafficColor(label: string): string {
  switch (label) {
    case 'Red':
      return 'border-red-200 bg-red-50 text-red-800';
    case 'Yellow':
      return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    case 'Unavailable':
      return 'border-slate-200 bg-slate-50 text-slate-600';
    default:
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  }
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  const alertCount = result.physicalSignAlerts.length + result.vitalSignAlerts.length;
  const scoreCards: Array<{ label: string; score: NutritionAnalysisResult['zScores']['weightForAge'] }> = [
    { label: 'Weight-for-Age', score: result.zScores.weightForAge },
    { label: 'Height-for-Age', score: result.zScores.heightForAge },
    { label: 'Weight-for-Height', score: result.zScores.weightForHeight },
    { label: 'BMI-for-Age', score: result.zScores.bmiForAge },
    { label: 'MUAC', score: result.zScores.muac },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
      <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900 p-6 text-white md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            {result.imageUrl && (
              <img src={result.imageUrl} alt={result.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
            )}
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Integrated AI Classification</p>
              <h2 className="mt-2 text-3xl font-semibold">{result.name}</h2>
              <p className="mt-1 text-slate-200">Nutrition report generated at {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Risk Level</p>
            <p className="text-2xl font-semibold">{result.riskLevel}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Age</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{result.age} months</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Sex</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{result.sex === 'M' ? 'Male' : 'Female'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Weight / Height</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {result.weight} kg / {result.height} cm
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">BMI / MUAC</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              {result.bmi} / {result.muac} cm
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Assessment Status</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span>Nutrition Status</span>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(result.nutritionStatus)}`}>
                  {result.nutritionStatus}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Overall Risk</span>
                <span className="font-semibold">{result.riskLevel}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Alerts</span>
                <span className="font-semibold">{alertCount} findings</span>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl border-2 p-5 ${getRiskColor(result.riskLevel)}`}>
            <h3 className="text-lg font-semibold">Clinical Interpretation</h3>
            <p className="mt-3 text-sm leading-6">{result.classification}</p>
            <p className="mt-3 text-sm leading-6">{result.reportSummary}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">WHO Traffic-Lights</h3>
            <p className="text-sm text-slate-500">Estimated z-score style classification</p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {scoreCards.map(({ label, score }) => (
              <div key={label} className={`rounded-2xl border p-4 ${getTrafficColor(score.label)}`}>
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{score.value === null ? 'Unavailable' : score.value}</p>
                <p className="mt-1 text-xs leading-5">{score.label}: {score.interpretation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <h3 className="text-lg font-semibold text-emerald-900">Medical Recommendation</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-900">{result.recommendation}</p>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
            <h3 className="text-lg font-semibold text-indigo-900">Referral Suggestion</h3>
            <p className="mt-3 text-sm leading-6 text-indigo-900">{result.referralSuggestion}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Physical Sign Alerts</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {result.physicalSignAlerts.length > 0 ? (
                result.physicalSignAlerts.map((alert) => <li key={alert}>• {alert}</li>)
              ) : (
                <li>• No physical sign alerts reported</li>
              )}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Vital Sign Alerts</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {result.vitalSignAlerts.length > 0 ? (
                result.vitalSignAlerts.map((alert) => <li key={alert}>• {alert}</li>)
              ) : (
                <li>• No vital sign alerts reported</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
