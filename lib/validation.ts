// Input validation schemas using Zod

import { z } from 'zod';

const optionalNumber = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? undefined : numericValue;
}, z.number().nonnegative().optional());

const optionalText = z.string().trim().max(2000).optional();

export const registerChildSchema = z.object({
  patientId: z.string().trim().max(50).optional(),
  name: z.string().trim().min(1, 'Name is required').max(100),
  imageUrl: z.string().url().optional(),
  dateOfBirth: z.string().date().optional(),
  age: z.coerce.number().nonnegative('Age must be zero or greater'),
  sex: z.enum(['M', 'F']),
  measurementType: z.enum(['length', 'height']).optional(),
  assessmentSetting: optionalText,
  religion: optionalText,
  continent: optionalText,
  country: optionalText,
  region: optionalText,
  zone: optionalText,
  woreda: optionalText,
  kebele: optionalText,
  pmh: optionalText,
  fatherAge: optionalNumber,
  fatherHealthStatus: optionalText,
  fatherCauseOfDeath: optionalText,
  motherAge: optionalNumber,
  motherHealthStatus: optionalText,
  motherCauseOfDeath: optionalText,
  siblingsHistory: optionalText,
  familialDiseases: optionalText,
  earlyDevelopment: optionalText,
  educationalBackground: optionalText,
  socialActivities: optionalText,
  workRecordIncome: optionalText,
  dietHabits: optionalText,
  alcoholUse: optionalText,
  tobaccoUse: optionalText,
  drugUse: optionalText,
  herbUse: optionalText,
  addictions: optionalText,
  bpSystolic: optionalNumber,
  bpDiastolic: optionalNumber,
  bpArterySite: optionalText,
  bpPosition: optionalText,
  bpGrade: optionalText,
  pulseRate: optionalNumber,
  pulseSite: optionalText,
  pulseRhythm: optionalText,
  pulseVolume: optionalText,
  rrRate: optionalNumber,
  rrPattern: optionalText,
  temperature: optionalNumber,
  temperatureSite: optionalText,
  temperatureTime: optionalText,
  spo2: optionalNumber,
  oxygenSupport: optionalText,
  height: z.coerce.number().positive('Height must be positive'),
  weight: z.coerce.number().positive('Weight must be positive'),
  muac: z.coerce.number().positive('MUAC must be positive'),
  heightSource: optionalText,
  weightSource: optionalText,
  headCircumference: optionalNumber,
  chestCircumference: optionalNumber,
  edema: z.coerce.boolean().optional(),
  edemaDetails: optionalText,
  skinChanges: optionalText,
  hairChanges: optionalText,
  eyeSigns: optionalText,
  oralSigns: optionalText,
  hearingLossDevelopmentalDelay: optionalText,
  generalAppearance: optionalText,
});

export type RegisterChildInput = z.infer<typeof registerChildSchema>;

export const updateChildSchema = registerChildSchema.partial();

export type UpdateChildInput = z.infer<typeof updateChildSchema>;
