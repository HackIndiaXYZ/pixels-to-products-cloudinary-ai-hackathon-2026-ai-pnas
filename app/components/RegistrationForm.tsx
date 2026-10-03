'use client';

import { useMemo, useState } from 'react';
import { RegisterChildInput } from '@/lib/validation';
import { CldUploadWidget } from 'next-cloudinary';

type FormState = Record<string, string>;

interface RegistrationFormProps {
  onSubmit: (data: RegisterChildInput) => void;
  isLoading: boolean;
}

const sectionTitles = [
  'Child Profile',
  'Anthropometry',
  'Clinical Signs & Symptoms',
  'Vital Signs & Risk',
  'AI Assessment & Report',
];

const initialFormState: FormState = {
  patientId: '', name: '', imageUrl: '', dateOfBirth: '', age: '', sex: '', country: 'Ethiopia',
  region: '', zone: '', woreda: '', kebele: '', setting: '',
  weight: '', height: '', measurementType: '', muac: '', bilateralPittingEdema: '', edemaSeverity: '', headCircumference: '',
  appetite: '', breastfeeding: '', feedingDifficulty: '', vomiting: '', vomitingDuration: '', diarrhea: '', diarrheaDuration: '',
  fever: '', cough: '', breathingDifficulty: '', visibleWasting: '', pallor: '', skinChanges: '', hairChanges: '', lethargy: '',
  convulsions: '', alteredConsciousness: '', dehydration: '', temperature: '', pulseRate: '', rrRate: '', spo2: '', bpSystolic: '', bpDiastolic: '',
  dangerUnableToFeed: '', dangerPersistentVomiting: '', dangerConvulsions: '', dangerLethargic: '', dangerRespiratoryDistress: '', dangerOther: '',
};

type Option = { value: string; label: string };

const options: Record<string, Option[]> = {
  sex: [{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }],
  setting: ['Community', 'Health post', 'Health centre', 'Hospital', 'Nutrition centre', 'Outpatient clinic', 'Inpatient ward', 'Other'].map((value) => ({ value, label: value })),
  measurementType: [{ value: 'length', label: 'Recumbent length' }, { value: 'height', label: 'Standing height' }],
  appetite: ['Normal', 'Reduced', 'Poor', 'Refuses food', 'Unable to feed', 'Not assessed'].map((value) => ({ value, label: value })),
  breastfeeding: ['Exclusively breastfeeding', 'Breastfeeding + complementary feeding', 'Not breastfeeding', 'Unknown', 'Not applicable'].map((value) => ({ value, label: value })),
  yesNoUnknown: ['No', 'Yes', 'Unknown'].map((value) => ({ value, label: value })),
  yesNo: ['No', 'Yes'].map((value) => ({ value, label: value })),
  duration: ['<24 hours', '1-3 days', '>3 days', 'Unknown'].map((value) => ({ value, label: value })),
  diarrheaDuration: ['<14 days', '14 days or more', 'Unknown'].map((value) => ({ value, label: value })),
  pallor: ['Absent', 'Mild', 'Severe', 'Unknown'].map((value) => ({ value, label: value })),
  dehydration: ['No signs', 'Some dehydration', 'Severe dehydration', 'Unable to assess'].map((value) => ({ value, label: value })),
  edema: [{ value: 'Absent', label: 'Absent' }, { value: 'Present', label: 'Present' }],
  edemaSeverity: ['Mild (-)', 'Moderate (++)', 'Severe/generalized (+++)'].map((value) => ({ value, label: value })),
  wasting: ['No', 'Yes', 'Unable to assess'].map((value) => ({ value, label: value })),
  skinHair: ['None', 'Present', 'Unknown'].map((value) => ({ value, label: value })),
};

const regions = ['Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa', 'Gambela', 'Harari', 'Oromia', 'Sidama', 'Somali', 'South Ethiopia', 'Southwest Ethiopia', 'Tigray'];

function toNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function calculateAge(dateOfBirth: string): string {
  if (!dateOfBirth) return '';
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) months -= 1;
  return String(Math.max(0, months));
}

function getAgeGroup(ageMonths: number): string {
  if (ageMonths < 6) return 'Birth-5 months';
  if (ageMonths < 60) return '6-59 months';
  return '5-19 years';
}

function getPreview(data: FormState) {
  const weight = Number(data.weight);
  const height = Number(data.height);
  const muac = Number(data.muac);
  if (!weight || !height || !muac) return null;
  const bmi = weight / Math.pow(height / 100, 2);
  const muacStatus = Number(data.age) >= 6 && muac < 11.5 ? 'SAM range' : Number(data.age) >= 6 && muac < 12.5 ? 'MAM range' : 'Within MUAC range';
  return { bmi: bmi.toFixed(1), muacStatus, ageGroup: getAgeGroup(Number(data.age)), danger: Object.keys(data).some((key) => key.startsWith('danger') && data[key] === 'Yes') };
}

export default function RegistrationForm({ onSubmit, isLoading }: RegistrationFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const progress = ((step + 1) / sectionTitles.length) * 100;
  const preview = useMemo(() => getPreview(formData), [formData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => {
      const next = { ...previous, [name]: value };
      if (name === 'dateOfBirth') next.age = calculateAge(value);
      return next;
    });
  };

  const clinicalSummary = [
    `Appetite: ${formData.appetite || 'Not assessed'}`, `Breastfeeding: ${formData.breastfeeding || 'Not assessed'}`,
    `Feeding difficulty: ${formData.feedingDifficulty || 'Not assessed'}`, `Vomiting: ${formData.vomiting || 'Not assessed'}`,
    `Diarrhea: ${formData.diarrhea || 'Not assessed'}`, `Fever: ${formData.fever || 'Not assessed'}`,
    `Cough: ${formData.cough || 'Not assessed'}`, `Difficulty breathing: ${formData.breathingDifficulty || 'Not assessed'}`,
    `Visible wasting: ${formData.visibleWasting || 'Not assessed'}`, `Pallor: ${formData.pallor || 'Not assessed'}`,
    `Skin: ${formData.skinChanges || 'Not assessed'}`, `Hair: ${formData.hairChanges || 'Not assessed'}`,
    `Lethargy: ${formData.lethargy || 'Not assessed'}`, `Convulsions: ${formData.convulsions || 'Not assessed'}`,
    `Altered consciousness: ${formData.alteredConsciousness || 'Not assessed'}`, `Dehydration: ${formData.dehydration || 'Not assessed'}`,
  ].join(' | ');

  const dangerSummary = [
    ['Unable to drink/breastfeed', formData.dangerUnableToFeed], ['Persistent vomiting', formData.dangerPersistentVomiting],
    ['Convulsions', formData.dangerConvulsions], ['Lethargic/unconscious', formData.dangerLethargic],
    ['Severe respiratory distress', formData.dangerRespiratoryDistress], ['Other danger sign', formData.dangerOther],
  ].filter(([, value]) => value === 'Yes').map(([label]) => label).join(', ');

  const buildPayload = (): RegisterChildInput => ({
    patientId: formData.patientId.trim() || `PAT-${Date.now().toString().slice(-6)}`,
    name: formData.name.trim(), imageUrl: formData.imageUrl || undefined, dateOfBirth: formData.dateOfBirth || undefined, age: Number(formData.age), sex: formData.sex === 'F' ? 'F' : 'M',
    measurementType: formData.measurementType === 'height' ? 'height' : 'length',
    assessmentSetting: formData.setting || undefined,
    country: formData.country, region: formData.region || undefined, zone: formData.zone || undefined,
    woreda: formData.woreda || undefined, kebele: formData.kebele || undefined,
    temperature: toNumber(formData.temperature), pulseRate: toNumber(formData.pulseRate), rrRate: toNumber(formData.rrRate),
    spo2: toNumber(formData.spo2), bpSystolic: toNumber(formData.bpSystolic), bpDiastolic: toNumber(formData.bpDiastolic),
    height: Number(formData.height), weight: Number(formData.weight), muac: Number(formData.muac),
    edema: formData.bilateralPittingEdema === 'Present', edemaDetails: formData.edemaSeverity || undefined,
    headCircumference: toNumber(formData.headCircumference),
    generalAppearance: `Age group: ${getAgeGroup(Number(formData.age))} | Measurement: ${formData.measurementType || 'Not recorded'} | ${clinicalSummary} | Danger signs: ${dangerSummary || 'None identified'}`,
    skinChanges: formData.skinChanges === 'Present' ? 'Skin changes present' : undefined,
    hairChanges: formData.hairChanges === 'Present' ? 'Hair changes present' : undefined,
  });

  const renderInput = (name: string, label: string, type = 'text', required = false) => (
    <label key={name} className="block space-y-2 text-sm font-medium text-slate-700">
      <span className="flex items-center justify-between gap-3"><span>{label}</span>{required && <span className="text-xs uppercase tracking-wide text-sky-600">Required</span>}</span>
      <input name={name} type={type} value={formData[name]} onChange={handleChange} required={required} min={type === 'number' ? 0 : undefined} step={type === 'number' ? 'any' : undefined} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" />
    </label>
  );

  const renderSelect = (name: string, label: string, values: Option[], required = false) => (
    <label key={name} className="block space-y-2 text-sm font-medium text-slate-700">
      <span className="flex items-center justify-between gap-3"><span>{label}</span>{required && <span className="text-xs uppercase tracking-wide text-sky-600">Required</span>}</span>
      <select name={name} value={formData[name]} onChange={handleChange} required={required} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"><option value="">Select {label.toLowerCase()}</option>{values.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
    </label>
  );

  const renderDanger = (name: string, label: string) => renderSelect(name, label, options.yesNo);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2 rounded-xl border border-dashed border-sky-300 bg-sky-50 p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-semibold text-sky-900 mb-2">Child Photo (Optional)</h3>
            <p className="text-xs text-sky-700 mb-4">Upload a photo for visual assessment and record keeping.</p>
            {formData.imageUrl ? (
              <div className="relative">
                <img src={formData.imageUrl} alt="Uploaded child" className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md" />
                <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
              </div>
            ) : (
              <CldUploadWidget uploadPreset="my-defualt" onSuccess={(result: any) => setFormData({ ...formData, imageUrl: result.info.secure_url })}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition">
                    Upload Photo
                  </button>
                )}
              </CldUploadWidget>
            )}
          </div>
          {renderInput('patientId', 'Patient ID')}{renderInput('name', 'Child name', 'text', true)}
          {renderInput('dateOfBirth', 'Date of birth', 'date', true)}
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"><span className="block text-xs uppercase tracking-wide text-slate-500">Calculated age</span><strong className="mt-1 block text-base">{formData.age ? `${formData.age} months (${getAgeGroup(Number(formData.age))})` : 'Enter date of birth'}</strong></div>
          {renderSelect('sex', 'Sex', options.sex, true)}{renderSelect('country', 'Country', [{ value: 'Ethiopia', label: 'Ethiopia' }], true)}
          {renderSelect('region', 'Region / state', regions.map((value) => ({ value, label: value })))}
          {renderSelect('zone', 'Zone / province', ['Central', 'East', 'North', 'South', 'West', 'Other'].map((value) => ({ value, label: value })))}
          {renderSelect('woreda', 'District / woreda', ['Urban', 'Rural', 'Other'].map((value) => ({ value, label: value })))}
          {renderSelect('kebele', 'Kebele / locality', ['Urban', 'Rural', 'Other'].map((value) => ({ value, label: value })))}
          {renderSelect('setting', 'Assessment setting', options.setting)}
        </div>;
      case 1:
        return <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{renderInput('weight', 'Weight (kg)', 'number', true)}{renderInput('height', 'Length / height (cm)', 'number', true)}{renderSelect('measurementType', 'Measurement type', options.measurementType, true)}{renderInput('muac', 'MUAC (cm)', 'number', true)}</div>
          <div className="grid gap-4 md:grid-cols-2">{renderSelect('bilateralPittingEdema', 'Bilateral pitting oedema', options.edema, true)}{formData.bilateralPittingEdema === 'Present' && renderSelect('edemaSeverity', 'Oedema severity', options.edemaSeverity, true)}{Number(formData.age) < 60 && renderInput('headCircumference', 'Head circumference (cm)', 'number')}</div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-950">The system calculates BMI, MUAC interpretation, and age-appropriate growth indicators after submission. Do not enter BMI manually.</div>
        </div>;
      case 2:
        return <div className="grid gap-4 md:grid-cols-2">
          {renderSelect('appetite', 'Appetite', options.appetite)}{renderSelect('breastfeeding', 'Breastfeeding', options.breastfeeding)}{renderSelect('feedingDifficulty', 'Feeding difficulty', options.yesNoUnknown)}
          {renderSelect('vomiting', 'Vomiting', options.yesNo)}{formData.vomiting === 'Yes' && renderSelect('vomitingDuration', 'Vomiting duration', options.duration)}
          {renderSelect('diarrhea', 'Diarrhea', options.yesNo)}{formData.diarrhea === 'Yes' && renderSelect('diarrheaDuration', 'Diarrhea duration', options.diarrheaDuration)}
          {renderSelect('fever', 'Fever', options.yesNoUnknown)}{renderSelect('cough', 'Cough', options.yesNo)}{renderSelect('breathingDifficulty', 'Difficulty breathing', options.yesNo)}
          {renderSelect('visibleWasting', 'Visible wasting', options.wasting)}{renderSelect('pallor', 'Pallor', options.pallor)}{renderSelect('skinChanges', 'Skin changes', options.skinHair)}{renderSelect('hairChanges', 'Hair changes', options.skinHair)}
          {renderSelect('lethargy', 'Lethargy', options.yesNo)}{renderSelect('convulsions', 'Convulsions', options.yesNo)}{renderSelect('alteredConsciousness', 'Altered consciousness', options.yesNo)}{renderSelect('dehydration', 'Dehydration', options.dehydration)}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:col-span-2">Bilateral oedema is imported from Step 2 so it is recorded once and cannot conflict between sections.</div>
        </div>;
      case 3:
        return <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{renderInput('temperature', 'Temperature (°C)', 'number')}{renderInput('pulseRate', 'Heart rate (/min)', 'number')}{renderInput('rrRate', 'Respiratory rate (/min)', 'number')}{renderInput('spo2', 'SpO₂ (%)', 'number')}</div>
          <div className="grid gap-4 md:grid-cols-2">{renderInput('bpSystolic', 'Blood pressure systolic (mmHg)', 'number')}{renderInput('bpDiastolic', 'Blood pressure diastolic (mmHg)', 'number')}</div>
          <div><h3 className="text-lg font-semibold text-slate-900">Danger signs</h3><div className="mt-4 grid gap-4 md:grid-cols-2">{renderDanger('dangerUnableToFeed', 'Unable to drink / breastfeed')}{renderDanger('dangerPersistentVomiting', 'Persistent vomiting')}{renderDanger('dangerConvulsions', 'Convulsions')}{renderDanger('dangerLethargic', 'Lethargic / unconscious')}{renderDanger('dangerRespiratoryDistress', 'Severe respiratory distress')}{renderDanger('dangerOther', 'Other danger sign')}</div></div>
          {preview?.danger && <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 font-semibold text-red-900">Danger sign identified. Immediate clinical evaluation is required. This tool does not replace local emergency protocols.</div>}
        </div>;
      default:
        return <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5"><h3 className="text-lg font-semibold text-slate-900">Clinical decision support</h3><p className="mt-1 text-sm text-slate-600">The report separates measured data, calculated growth indicators, clinical interpretation, and recommended next action for clinician confirmation.</p></div>
          {preview && <div className="grid gap-4 md:grid-cols-4"><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Age group</p><p className="mt-1 font-semibold text-slate-900">{preview.ageGroup}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">BMI</p><p className="mt-1 font-semibold text-slate-900">{preview.bmi}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">MUAC screen</p><p className="mt-1 font-semibold text-slate-900">{preview.muacStatus}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Danger signs</p><p className="mt-1 font-semibold text-slate-900">{preview.danger ? 'Present' : 'Not flagged'}</p></div></div>}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">Insufficient or unusual data will be shown for clinical review. Confirm measurements and apply the configured WHO/reference version before making a final diagnosis or referral decision.</div>
        </div>;
    }
  };

  return <form onSubmit={(event) => { event.preventDefault(); onSubmit(buildPayload()); }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
    <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900 px-6 py-8 text-white md:px-10"><div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><p className="text-sm uppercase tracking-[0.35em] text-cyan-200">WHO-oriented pediatric screening</p><h2 className="mt-2 text-3xl font-semibold md:text-4xl">Child Nutritional Assessment</h2><p className="mt-2 max-w-2xl text-sm text-slate-200">Select, measure, calculate, review.</p></div><div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3"><p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Step {step + 1} of 5</p><p className="mt-1 text-lg font-semibold">{sectionTitles[step]}</p></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all" style={{ width: `${progress}%` }} /></div></div>
    <div className="space-y-8 px-6 py-8 md:px-10"><div className="grid gap-2 sm:grid-cols-5">{sectionTitles.map((title, index) => <span key={title} className={`rounded-xl px-3 py-2 text-center text-xs font-semibold ${index === step ? 'bg-slate-900 text-white' : index < step ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>{index + 1}. {title}</span>)}</div><div>{renderStep()}</div><div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0 || isLoading} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>{step < 4 ? <button type="button" onClick={() => setStep((current) => Math.min(current + 1, 4))} disabled={isLoading} className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50">Next Step</button> : <button type="submit" disabled={isLoading} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400">{isLoading ? 'Generating report...' : 'Complete Assessment'}</button>}</div><p className="text-sm text-slate-500">Required fields: child name, date of birth, sex, weight, length/height, MUAC, and bilateral pitting oedema.</p></div>
  </form>;
}