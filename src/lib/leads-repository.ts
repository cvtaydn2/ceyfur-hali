import { supabase, supabaseAdmin } from "./supabase";
import { Lead, LeadArchive, LeadInput, LeadStatusSchema, ArchiveStatusSchema } from "./leads-schema";

export async function createLead(input: LeadInput) {
  const { error } = await supabase
    .from("leads")
    .insert({
      full_name: input.fullName,
      phone: input.phone,
      service_id: input.serviceId,
      district: input.district,
      preferred_date: input.preferredDate,
      notes: input.notes,
      status: "new"
    });

  if (error) throw new Error(`Lead creation failed: ${error.message}`);
  return true;
}

export async function getLeads() {
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch leads: ${error.message}`);
  
  return (data || []).map(item => ({
    id: item.id,
    fullName: item.full_name,
    phone: item.phone,
    serviceId: item.service_id,
    district: item.district,
    preferredDate: item.preferred_date,
    notes: item.notes,
    status: item.status,
    createdAt: item.created_at
  })) as Lead[];
}

export async function getArchive() {
  const { data, error } = await supabaseAdmin
    .from("leads_archive")
    .select("*")
    .order("completed_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch archive: ${error.message}`);
  
  return (data || []).map(item => ({
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
    completedAt: item.completed_at
  })) as LeadArchive[];
}

export async function updateLeadStatus(id: string, newStatus: string) {
  // If moving to archive statuses
  if (ArchiveStatusSchema.safeParse(newStatus).success) {
    const { error } = await supabaseAdmin.rpc("archive_lead", {
      p_lead_id: id,
      p_final_status: newStatus
    });

    if (error) throw new Error(`Failed to archive lead: ${error.message}`);
    return true;
  }

  // Normal status update in active leads
  const { error } = await supabaseAdmin
    .from("leads")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) throw new Error(`Failed to update status: ${error.message}`);
  return true;
}
