const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Change provider to sqlite
schema = schema.replace(/provider = "postgresql"/, 'provider = "sqlite"');
schema = schema.replace(/url\s+=\s+env\("DATABASE_URL"\)/, 'url = "file:./dev.db"');

// Replace enums with string type
const enums = ['UserRole', 'ShipmentStatus', 'ShipmentPriority', 'VehicleStatus', 'VehicleType', 'FuelType', 'DriverStatus', 'RouteStatus', 'NotificationType', 'RiskLevel', 'EventType', 'MaintenanceType', 'MaintenanceStatus'];

for (const e of enums) {
  schema = schema.replace(new RegExp(`enum ${e} {[\\s\\S]*?}`, 'g'), '');
  schema = schema.replace(new RegExp(`${e}(\\??)`, 'g'), 'String$1');
}

// Remove default enum values which are no longer valid enums
schema = schema.replace(/@default\([A-Z_]+\)/g, '');
// Also fix JSON which is not supported in sqlite by Prisma sometimes? Prisma supports Json in SQLite in newer versions. Actually Prisma SQLite does NOT support Json type. Let's replace Json with String.
schema = schema.replace(/Json\?/g, 'String?');
schema = schema.replace(/Json/g, 'String');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema updated for SQLite');
