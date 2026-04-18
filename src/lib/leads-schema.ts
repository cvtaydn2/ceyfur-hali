import { z } from "zod";

export const LeadStatusSchema = z.enum(["new", "called", "quoted", "booked"]);
export const ArchiveStatusSchema = z.enum(["completed", "cancelled"]);
export const AllStatusSchema = z.union([LeadStatusSchema, ArchiveStatusSchema]);

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
  status: z.infer<typeof LeadStatusSchema>;
  createdAt: string;
}

export interface LeadArchive extends LeadInput {
  id: string;
  originalLeadId: string;
  finalStatus: z.infer<typeof ArchiveStatusSchema>;
  createdAt: string;
  completedAt: string;
}
