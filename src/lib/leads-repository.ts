import "server-only";
import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabase-admin";
import { Lead, LeadArchive, LeadInput, ArchiveStatusSchema } from "./leads-schema";

/**
 * Yeni müşteri talebi oluşturur.
 * Public Supabase client kullanır (RLS insert iznine sahip olmalı).
 */
export async function createLead(input: LeadInput): Promise<void> {
  const { error } = await supabase.from("leads").insert({
    full_name: input.fullName,
    phone: input.phone,
    service_id: input.serviceId,
    district: input.district,
    preferred_date: input.preferredDate,
    notes: input.notes,
    status: "new",
  });

  if (error) {
    throw new Error(`Talep oluşturulamadı: ${error.message}`);
  }
}

/**
 * Tüm aktif lead'leri getirir (admin).
 */
export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Lead'ler alınamadı: ${error.message}`);
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    fullName: item.full_name,
    phone: item.phone,
    serviceId: item.service_id,
    district: item.district,
    preferredDate: item.preferred_date,
    notes: item.notes,
    status: item.status,
    createdAt: item.created_at,
  })) as Lead[];
}

/**
 * Arşivlenmiş lead'leri getirir (admin).
 */
export async function getArchive(): Promise<LeadArchive[]> {
  const { data, error } = await supabaseAdmin
    .from("leads_archive")
    .select("*")
    .order("completed_at", { ascending: false });

  if (error) {
    throw new Error(`Arşiv alınamadı: ${error.message}`);
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    originalLeadId: item.original_lead_id,
    fullName: item.full_name,
    phone: item.phone,
    serviceId: item.service_id,
    district: item.district,
    preferredDate: item.preferred_date,
    notes: item.notes,
    finalStatus: item.final_status,
    createdAt: item.created_at,
    completedAt: item.completed_at,
  })) as LeadArchive[];
}

/**
 * Lead durumunu günceller.
 * Arşiv durumu (completed/cancelled) verilirse lead arşive taşınır.
 */
export async function updateLeadStatus(id: string, newStatus: string): Promise<void> {
  const isArchiveStatus = ArchiveStatusSchema.safeParse(newStatus).success;

  if (isArchiveStatus) {
    const { error } = await supabaseAdmin.rpc("archive_lead", {
      p_lead_id: id,
      p_final_status: newStatus,
    });
    if (error) {
      throw new Error(`Lead arşivlenemedi: ${error.message}`);
    }
    return;
  }

  const { error } = await supabaseAdmin
    .from("leads")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    throw new Error(`Durum güncellenemedi: ${error.message}`);
  }
}
