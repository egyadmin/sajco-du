export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  location?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_size: number;
  file_type: string;
  category?: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Approval {
  id: string;
  status: string;
  comments?: string;
  document_id: string;
  approver_id: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface Signature {
  id: string;
  signature_url: string;
  position?: {
    x: number;
    y: number;
    page: number;
  };
  document_id: string;
  signer_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  content: string;
  attachment_url?: string;
  sender_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  user_id: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  type: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface BIMModel {
  id: string;
  name: string;
  file_url: string;
  file_size: number;
  discipline: string;
  version: string;
  status: string;
  conflicts: number;
  created_at: string;
  updated_at: string;
}