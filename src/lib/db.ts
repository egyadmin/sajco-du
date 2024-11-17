import Database from 'better-sqlite3';
import { join } from 'path';

// Initialize database
const db = new Database(join(process.cwd(), 'data.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Helper functions for common operations
export const dbHelpers = {
  // Users
  createUser: db.prepare(`
    INSERT INTO users (id, name, email, password, role, department, location, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  
  // Documents
  createDocument: db.prepare(`
    INSERT INTO documents (id, title, description, file_url, file_size, file_type, category, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  getDocuments: db.prepare('SELECT * FROM documents ORDER BY created_at DESC'),
  
  // Approvals
  createApproval: db.prepare(`
    INSERT INTO approvals (id, document_id, approver_id, order_num)
    VALUES (?, ?, ?, ?)
  `),
  
  // Signatures
  addSignature: db.prepare(`
    INSERT INTO signatures (id, signature_url, position, document_id, signer_id)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  // Messages
  sendMessage: db.prepare(`
    INSERT INTO messages (id, content, attachment_url, sender_id)
    VALUES (?, ?, ?, ?)
  `),
  
  // Notifications
  createNotification: db.prepare(`
    INSERT INTO notifications (id, title, message, type, user_id)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  // Events
  createEvent: db.prepare(`
    INSERT INTO events (id, title, description, date, time, location, type, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  // BIM Models
  createBIMModel: db.prepare(`
    INSERT INTO bim_models (id, name, file_url, file_size, discipline, version)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
};

export { db };