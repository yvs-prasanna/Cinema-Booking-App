const fs = require('fs');
const path = require('path');
const Database = require('../src/config/database');

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    
    // Ensure database directory exists
    const dbDir = path.dirname(process.env.DATABASE_PATH || './database/cinema.db');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    await Database.connect();
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      await Database.run(statement);
    }
    
    console.log('✅ Database schema created successfully');
    await Database.close();
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}



if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;