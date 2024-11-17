import Database from 'better-sqlite3';
import { join } from 'path';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
  // Initialize database
  const db = new Database(join(process.cwd(), 'data.db'));
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create initial admin user
  const adminUser = {
    id: randomUUID(),
    name: 'م. تامر الجوهري',
    email: 'tamer@example.com',
    password: await bcrypt.hash('123456', 10),
    role: 'مدير تقنية المعلومات - المنطقة الشمالية',
    avatar: 'https://www.gulfupp.com/do.php?img=77482'
  };

  try {
    // Create tables first
    db.exec(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT,
        location TEXT,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Documents table
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        file_url TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        file_type TEXT NOT NULL,
        category TEXT,
        status TEXT DEFAULT 'pending',
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Approvals table
      CREATE TABLE IF NOT EXISTS approvals (
        id TEXT PRIMARY KEY,
        status TEXT DEFAULT 'pending',
        comments TEXT,
        document_id TEXT NOT NULL,
        approver_id TEXT NOT NULL,
        order_num INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents(id),
        FOREIGN KEY (approver_id) REFERENCES users(id)
      );

      -- Signatures table
      CREATE TABLE IF NOT EXISTS signatures (
        id TEXT PRIMARY KEY,
        signature_url TEXT NOT NULL,
        position JSON,
        document_id TEXT NOT NULL,
        signer_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents(id),
        FOREIGN KEY (signer_id) REFERENCES users(id)
      );

      -- Messages table
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        attachment_url TEXT,
        sender_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id)
      );

      -- Notifications table
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        read BOOLEAN DEFAULT 0,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Events table
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date DATETIME NOT NULL,
        time TEXT NOT NULL,
        location TEXT,
        type TEXT NOT NULL,
        priority TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- BIM Models table
      CREATE TABLE IF NOT EXISTS bim_models (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        discipline TEXT NOT NULL,
        version TEXT NOT NULL,
        status TEXT DEFAULT 'review',
        conflicts INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert admin user
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      adminUser.id,
      adminUser.name,
      adminUser.email,
      adminUser.password,
      adminUser.role,
      adminUser.avatar
    );

    console.log('Database setup completed successfully!');
    console.log('Admin user created:');
    console.log('Email:', adminUser.email);
    console.log('Password: 123456');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    db.close();
  }
}

setupDatabase().catch(console.error);