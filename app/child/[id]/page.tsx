'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import AnalysisResult from '@/app/components/AnalysisResult';
import { NutritionAnalysisResult } from '@/lib/types';

interface AnalysisLog {
  id: string;
  analysis: string;
  createdAt: string;
}

interface ChildData {
  id: string;
  name: string;
  age: number;
  sex: string;
  weight: number;
  height: number;
  muac: number;
  imageUrl?: string | null;
  headCircumference: number | null;
  chestCircumference: number | null;
  bmi: number | null;
  nutritionStatus: string | null;
  riskLevel: string | null;
  classification: string | null;
  recommendation: string | null;
  referralSuggestion: string | null;
  reportSummary: string | null;
  physicalSignAlerts: string | null;
  vitalSignAlerts: string | null;
  weightForAgeZ: number | null;
  heightForAgeZ: number | null;
  weightForHeightZ: number | null;
  bmiForAgeZ: number | null;
  muacZ: number | null;
}

interface ChildDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getTrafficLabel(value: number | null): 'Red' | 'Yellow' | 'Green' {
  if (value === null) {
    return 'Green';
  }

  if (value <= -3 || value >= 3) {
    return 'Red';
  }

  if (value <= -2 || value >= 2) {
    return 'Yellow';
  }

  return 'Green';
}

export default function ChildDetailsPage({ params }: ChildDetailsPageProps) {
  const [child, setChild] = useState<ChildData | null>(null);
  const [history, setHistory] = useState<AnalysisLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childId, setChildId] = useState<string | null>(null);
  const [historyQuery, setHistoryQuery] = useState('');
  const [historyRisk, setHistoryRisk] = useState('All');

  useEffect(() => {
    // Resolve the async params
    params.then((resolvedParams) => {
      setChildId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!childId) return;

    const fetchChildDetails = async () => {
      try {
        const response = await fetch(`/api/child/${childId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch child details');
        }

        setChild(data.child);
        setHistory(data.history || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChildDetails();
  }, [childId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header currentPage="dashboard" />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Loading child details...</p>
        </div>
      </main>
    );
  }

  if (error || !child) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header currentPage="dashboard" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-600 font-semibold">{error || 'Child not found'}</p>
            <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Construct current analysis result
  const currentAnalysis: NutritionAnalysisResult = {
    childId: child.id,
    name: child.name,
    imageUrl: child.imageUrl || null,
    age: child.age,
    sex: child.sex as 'M' | 'F',
    weight: child.weight,
    height: child.height,
    muac: child.muac,
    bmi: child.bmi || 0,
    nutritionStatus: (child.nutritionStatus || 'Normal') as NutritionAnalysisResult['nutritionStatus'],
    riskLevel: (child.riskLevel || 'Low') as NutritionAnalysisResult['riskLevel'],
    classification: child.classification || '',
    recommendation: child.recommendation || '',
    referralSuggestion: child.referralSuggestion || '',
    reportSummary: child.reportSummary || '',
    physicalSignAlerts: child.physicalSignAlerts ? child.physicalSignAlerts.split(' | ') : [],
    vitalSignAlerts: child.vitalSignAlerts ? child.vitalSignAlerts.split(' | ') : [],
    zScores: {
      weightForAge: {
        value: child.weightForAgeZ || 0,
        label: getTrafficLabel(child.weightForAgeZ),
        interpretation: 'Persisted from the latest analysis',
      },
      heightForAge: {
        value: child.heightForAgeZ || 0,
        label: getTrafficLabel(child.heightForAgeZ),
        interpretation: 'Persisted from the latest analysis',
      },
      weightForHeight: {
        value: child.weightForHeightZ || 0,
        label: getTrafficLabel(child.weightForHeightZ),
        interpretation: 'Persisted from the latest analysis',
      },
      bmiForAge: {
        value: child.bmiForAgeZ || 0,
        label: getTrafficLabel(child.bmiForAgeZ),
        interpretation: 'Persisted from the latest analysis',
      },
      muac: {
        value: child.muacZ || 0,
        label: getTrafficLabel(child.muacZ !== null ? -child.muacZ : null),
        interpretation: 'Persisted from the latest analysis',
      },
    },
    timestamp: new Date(),
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header currentPage="dashboard" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <AnalysisResult result={currentAnalysis} />

        {/* Assessment History */}
        {history.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Assessment History</h3>
                <p className="mt-1 text-sm text-gray-500">Review saved nutrition assessments for this child.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="sr-only" htmlFor="history-search">Search assessment history</label>
                <input id="history-search" value={historyQuery} onChange={(event) => setHistoryQuery(event.target.value)} placeholder="Search status or date" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500" />
                <label className="sr-only" htmlFor="history-risk">Filter assessment risk</label>
                <select id="history-risk" value={historyRisk} onChange={(event) => setHistoryRisk(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500">
                  <option>All</option><option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {history.filter((log) => {
                try {
                  const analysis = JSON.parse(log.analysis) as { nutritionStatus?: string; riskLevel?: string };
                  const searchable = `${new Date(log.createdAt).toLocaleDateString()} ${analysis.nutritionStatus || ''} ${analysis.riskLevel || ''}`.toLowerCase();
                  return searchable.includes(historyQuery.trim().toLowerCase()) && (historyRisk === 'All' || analysis.riskLevel === historyRisk);
                } catch {
                  return false;
                }
              }).map((log) => {
                try {
                  const analysis = JSON.parse(log.analysis);
                  return (
                    <div
                      key={log.id}
                      className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {new Date(log.createdAt).toLocaleDateString()} at{' '}
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </p>
                          <p className="text-gray-600">Status: {analysis.nutritionStatus}</p>
                          <p className="text-gray-600">Risk Level: {analysis.riskLevel}</p>
                          <p className="text-gray-600">BMI: {analysis.bmi}</p>
                        </div>
                      </div>
                    </div>
                  );
                } catch {
                  return null;
                }
              })}
            </div>
            {history.filter((log) => log.analysis.toLowerCase().includes(historyQuery.trim().toLowerCase())).length === 0 && (
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No assessments match your filters.</p>
            )}
          </div>
        )}
        {history.length === 0 && (
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">No assessments available</h3>
            <p className="mt-2 text-sm text-slate-500">Run an assessment to start this child&apos;s history.</p>
            <Link href="/register" className="mt-5 inline-flex rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white">Start assessment</Link>
          </div>
        )}
      </div>
    </main>
  );
}
