import { z } from "zod";

/**
 * Aktif lead durumları — admin panelinde seçilebilir.
 * constants.ts ile senkronize tutulmalıdır.
 */
export const LeadStatusSchema = z.enum(["new", "called", "quoted", "booked"]);

/**
 * Arşiv durumları — lead'i arşive taşır ve leads tablosundan siler.
 */
export const ArchiveStatusSchema = z.enum(["completed", "cancelled"]);

/**
 * Tüm olası durumlar (aktif + arşiv).
 */
export const AllStatusSchema = z.union([LeadStatusSchema, ArchiveStatusSchema]);

export type LeadStatus = z.infer<typeof LeadStatusSchema>;
export type ArchiveStatus = z.infer<typeof ArchiveStatusSchema>;
export type AllStatus = z.infer<typeof AllStatusSchema>;

/**
 * Müşteri talebi form girdi şeması.
 */
export const LeadSchema = z.object({
  fullName: z.string().trim().min(2, "Lütfen adınızı ve soyadınızı girin."),
  phone: z.string().trim().min(10, "Lütfen geçerli bir telefon numarası girin."),
  serviceId: z.string().min(1, "Lütfen bir hizmet seçin."),
  district: z.string().min(1, "Lütfen ilçenizi seçin."),
  preferredDate: z.string().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
});

export type LeadInput = z.infer<typeof LeadSchema>;

export interface Lead extends LeadInput {
  id: string;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadArchive extends LeadInput {
  id: string;
  originalLeadId: string;
  finalStatus: ArchiveStatus;
  createdAt: string;
  completedAt: string;
}
