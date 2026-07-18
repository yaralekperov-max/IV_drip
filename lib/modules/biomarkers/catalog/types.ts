import { z } from "zod";

/** Диапазон нормы (гибкий — с прицелом на зависимость от пола/возраста). */
export const referenceRangeSchema = z.object({
  sex: z.enum(["male", "female"]).nullish(),
  ageMin: z.number().nonnegative().optional(),
  ageMax: z.number().nonnegative().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  text: z.string().optional(),
});

export type ReferenceRangeInput = z.infer<typeof referenceRangeSchema>;

/** Нормализованная запись справочника (результат импорта из любого формата). */
export const biomarkerInputSchema = z.object({
  code: z.string().min(1).max(80),
  name: z.string().min(1).max(200),
  unit: z.string().max(40).optional(),
  category: z.string().max(80).optional(),
  aliases: z.array(z.string().min(1)).default([]),
  referenceRanges: z.array(referenceRangeSchema).default([]),
  sort: z.number().int().default(0),
  active: z.boolean().default(true),
  description: z.string().optional(),
});

export type BiomarkerInput = z.infer<typeof biomarkerInputSchema>;

export type ImportReport = {
  format: "json" | "csv" | "tsv";
  total: number;
  valid: BiomarkerInput[];
  errors: { row: number; message: string }[];
};
