const fs = require('fs');
const path = require('path');

const enumsCode = `
export enum UserRole { ADMIN = 'ADMIN', OPERATIONS_MANAGER = 'OPERATIONS_MANAGER', DISPATCHER = 'DISPATCHER', DRIVER = 'DRIVER', ANALYST = 'ANALYST' }
export enum DriverStatus { AVAILABLE = 'AVAILABLE', ON_DUTY = 'ON_DUTY', ON_BREAK = 'ON_BREAK', OFF_DUTY = 'OFF_DUTY', UNAVAILABLE = 'UNAVAILABLE' }
export enum EventType { SHIPMENT_CREATED = 'SHIPMENT_CREATED', SHIPMENT_ASSIGNED = 'SHIPMENT_ASSIGNED', ROUTE_CREATED = 'ROUTE_CREATED', DRIVER_ASSIGNED = 'DRIVER_ASSIGNED', SHIPMENT_DISPATCHED = 'SHIPMENT_DISPATCHED', LOCATION_UPDATED = 'LOCATION_UPDATED', ETA_UPDATED = 'ETA_UPDATED', DELIVERY_DELAY_DETECTED = 'DELIVERY_DELAY_DETECTED', ROUTE_RECALCULATED = 'ROUTE_RECALCULATED', DELIVERY_COMPLETED = 'DELIVERY_COMPLETED', DELIVERY_FAILED = 'DELIVERY_FAILED', VEHICLE_BREAKDOWN = 'VEHICLE_BREAKDOWN', DRIVER_DEVIATION = 'DRIVER_DEVIATION', MANUAL_OVERRIDE = 'MANUAL_OVERRIDE' }
export enum ShipmentStatus { CREATED = 'CREATED', ASSIGNED = 'ASSIGNED', PICKED_UP = 'PICKED_UP', IN_TRANSIT = 'IN_TRANSIT', DELAYED = 'DELAYED', OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', DELIVERED = 'DELIVERED', FAILED = 'FAILED', CANCELLED = 'CANCELLED' }
export enum VehicleStatus { AVAILABLE = 'AVAILABLE', ASSIGNED = 'ASSIGNED', IN_TRANSIT = 'IN_TRANSIT', MAINTENANCE = 'MAINTENANCE', OFFLINE = 'OFFLINE' }
`;
fs.writeFileSync('apps/api/src/enums.ts', enumsCode);

const files = [
  'apps/api/src/auth/auth.service.ts',
  'apps/api/src/drivers/drivers.controller.ts',
  'apps/api/src/drivers/drivers.service.ts',
  'apps/api/src/events/events.service.ts',
  'apps/api/src/optimization/optimization.service.ts',
  'apps/api/src/shipments/shipments.controller.ts',
  'apps/api/src/shipments/shipments.service.ts',
  'apps/api/src/vehicles/vehicles.controller.ts',
  'apps/api/src/vehicles/vehicles.service.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace imports like: import { UserRole } from '@prisma/client';
  // with: import { UserRole } from '../enums'; (or similar path)
  
  const relPath = path.relative(path.dirname(file), 'apps/api/src/enums.ts').replace(/\\/g, '/').replace('.ts', '');
  const importPath = relPath.startsWith('.') ? relPath : './' + relPath;

  // We find the line with @prisma/client and extract the enums
  // E.g., import { ShipmentStatus, EventType, Prisma } from '@prisma/client';
  // Actually, we can just let Prisma be imported from @prisma/client, and enums from our file.
  
  const regex = /import\s+{([^}]+)}\s+from\s+'@prisma\/client';/g;
  content = content.replace(regex, (match, imports) => {
    const items = imports.split(',').map(i => i.trim());
    const prismaItems = items.filter(i => i === 'Prisma' || i === 'PrismaClient');
    const enumItems = items.filter(i => i !== 'Prisma' && i !== 'PrismaClient');
    
    let res = '';
    if (prismaItems.length > 0) res += `import { ${prismaItems.join(', ')} } from '@prisma/client';\n`;
    if (enumItems.length > 0) res += `import { ${enumItems.join(', ')} } from '${importPath}';\n`;
    return res.trim();
  });
  
  fs.writeFileSync(file, content);
}
console.log('Enums fixed');
