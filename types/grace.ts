/** Grace domain contracts (mirror of console-core grace schemas). */

export interface GrantGraceInput {
  partner_id: string;
  granted_days: number;
  remark: string;
}

export interface GraceRecord {
  grace_id: string;
  partner_id: string;
  service_name: string;
  granted_days: number;
  attempt_number: number;
  start_date: number;
  end_date: number;
  status: string;
  remark?: string | null;
  consumed_days?: number | null;
}

export interface GraceStatus {
  partner_id: string;
  service_name: string;
  has_active_grace: boolean;
  current_grace?: GraceRecord | null;
  total_attempts_used: number;
  attempts_remaining: number;
  total_consumed_days: number;
}
