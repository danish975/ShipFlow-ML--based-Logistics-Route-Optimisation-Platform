const fs = require('fs');
const path = require('path');

const modules = [
  'users',
  'organizations',
  'shipments',
  'drivers',
  'vehicles',
  'routes',
  'tracking',
  'optimization',
  'predictions',
  'notifications',
  'analytics',
  'events',
  'health',
  'admin',
  'audit',
  'gateway'
];

const basePath = path.join(__dirname, 'apps', 'api', 'src');

modules.forEach(mod => {
  const modPath = path.join(basePath, mod);
  if (!fs.existsSync(modPath)) {
    fs.mkdirSync(modPath, { recursive: true });
  }

  const className = mod.charAt(0).toUpperCase() + mod.slice(1) + 'Module';
  const fileContent = `import { Module } from '@nestjs/common';

@Module({})
export class ${className} {}
`;

  fs.writeFileSync(path.join(modPath, `${mod}.module.ts`), fileContent);
  console.log(`Created ${mod}.module.ts`);
});
