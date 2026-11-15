import { PrismaClient, UserRole, VehicleType, FuelType, ShipmentStatus, ShipmentPriority } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Default Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'swift-logistics' },
    update: {},
    create: {
      name: 'Swift Logistics India',
      slug: 'swift-logistics',
      address: '123 Logistics Park, NH-8',
      city: 'Gurugram',
      state: 'Haryana',
      country: 'India',
      phone: '+91-9876543210',
      email: 'contact@swiftlogistics.in',
    },
  });

  console.log(`✅ Organization created: ${org.name}`);

  // 2. Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@swiftlogistics.in' },
    update: {},
    create: {
      email: 'admin@swiftlogistics.in',
      passwordHash: adminPassword,
      firstName: 'Rajat',
      lastName: 'Sharma',
      role: UserRole.ADMIN,
      phone: '+91-9998887776',
      organizationId: org.id,
    },
  });

  // Create Operations Manager
  const opsPassword = await bcrypt.hash('Ops@123', 12);
  await prisma.user.upsert({
    where: { email: 'ops@swiftlogistics.in' },
    update: {},
    create: {
      email: 'ops@swiftlogistics.in',
      passwordHash: opsPassword,
      firstName: 'Priya',
      lastName: 'Desai',
      role: UserRole.OPERATIONS_MANAGER,
      phone: '+91-9998887777',
      organizationId: org.id,
    },
  });

  console.log(`✅ Admin and Ops users created`);

  // 3. Create Vehicles
  const vehiclesData = [
    { number: 'HR38X1234', type: VehicleType.MINI_TRUCK, capacity: 1500, make: 'Tata', model: 'Ace' },
    { number: 'HR38X5678', type: VehicleType.VAN, capacity: 800, make: 'Maruti', model: 'Eeco' },
    { number: 'DL1LV9999', type: VehicleType.TRUCK, capacity: 5000, make: 'Ashok Leyland', model: 'Dost' },
    { number: 'UP16Z4321', type: VehicleType.MINI_TRUCK, capacity: 2000, make: 'Mahindra', model: 'Bolero Pik-Up' },
    { number: 'HR26YZ1111', type: VehicleType.BIKE, capacity: 50, make: 'Hero', model: 'Splendor' },
  ];

  const vehicles = [];
  for (const v of vehiclesData) {
    const vehicle = await prisma.vehicle.upsert({
      where: { vehicleNumber: v.number },
      update: {},
      create: {
        vehicleNumber: v.number,
        type: v.type,
        make: v.make,
        model: v.model,
        capacityKg: v.capacity,
        fuelType: FuelType.DIESEL,
        organizationId: org.id,
      },
    });
    vehicles.push(vehicle);
  }

  console.log(`✅ Created ${vehicles.length} vehicles`);

  // 4. Create Drivers
  const driversData = [
    { empId: 'DRV-001', fname: 'Ramesh', lname: 'Kumar', phone: '+91-9000000001', vIndex: 0 },
    { empId: 'DRV-002', fname: 'Suresh', lname: 'Singh', phone: '+91-9000000002', vIndex: 1 },
    { empId: 'DRV-003', fname: 'Amit', lname: 'Patel', phone: '+91-9000000003', vIndex: 2 },
    { empId: 'DRV-004', fname: 'Vikram', lname: 'Yadav', phone: '+91-9000000004', vIndex: 3 },
    { empId: 'DRV-005', fname: 'Rahul', lname: 'Gupta', phone: '+91-9000000005', vIndex: 4 },
  ];

  const drivers = [];
  for (const d of driversData) {
    // create user for driver
    const driverPassword = await bcrypt.hash('Driver@123', 12);
    const driverUser = await prisma.user.upsert({
      where: { email: `${d.empId.toLowerCase()}@swiftlogistics.in` },
      update: {},
      create: {
        email: `${d.empId.toLowerCase()}@swiftlogistics.in`,
        passwordHash: driverPassword,
        firstName: d.fname,
        lastName: d.lname,
        role: UserRole.DRIVER,
        phone: d.phone,
        organizationId: org.id,
      },
    });

    const driver = await prisma.driver.upsert({
      where: { employeeId: d.empId },
      update: {},
      create: {
        employeeId: d.empId,
        licenseNumber: `DL-14-${Math.floor(100000 + Math.random() * 900000)}`,
        licenseExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
        userId: driverUser.id,
        organizationId: org.id,
        vehicleId: vehicles[d.vIndex].id,
      },
    });
    drivers.push(driver);
  }

  console.log(`✅ Created ${drivers.length} drivers`);

  // 5. Create Shipments (Orders & Shipments)
  // Generate some realistic Delhi NCR shipment locations
  const locations = [
    { address: 'Cyber Hub', city: 'Gurugram', state: 'Haryana', pincode: '122002', lat: 28.4950, lng: 77.0895 },
    { address: 'Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001', lat: 28.6304, lng: 77.2177 },
    { address: 'Sector 62', city: 'Noida', state: 'UP', pincode: '201309', lat: 28.6276, lng: 77.3711 },
    { address: 'Vasant Kunj', city: 'New Delhi', state: 'Delhi', pincode: '110070', lat: 28.5292, lng: 77.1557 },
    { address: 'Indirapuram', city: 'Ghaziabad', state: 'UP', pincode: '201014', lat: 28.6415, lng: 77.3714 },
    { address: 'Nehru Place', city: 'New Delhi', state: 'Delhi', pincode: '110019', lat: 28.5494, lng: 77.2526 },
  ];

  for (let i = 1; i <= 20; i++) {
    const pickup = locations[Math.floor(Math.random() * locations.length)];
    let delivery = locations[Math.floor(Math.random() * locations.length)];
    while (delivery.address === pickup.address) {
      delivery = locations[Math.floor(Math.random() * locations.length)];
    }

    const order = await prisma.order.upsert({
      where: { orderNumber: `ORD-100${i}` },
      update: {},
      create: {
        orderNumber: `ORD-100${i}`,
        customerName: `Customer ${i}`,
        customerPhone: `+91-98${Math.floor(10000000 + Math.random() * 90000000)}`,
        totalWeight: Math.floor(5 + Math.random() * 50),
        organizationId: org.id,
      },
    });

    const isAssigned = i % 3 !== 0;
    const driverIndex = Math.floor(Math.random() * drivers.length);
    const assignedDriver = isAssigned ? drivers[driverIndex].id : null;
    const assignedVehicle = isAssigned ? vehicles[driverIndex].id : null;
    const status = isAssigned ? ShipmentStatus.ASSIGNED : ShipmentStatus.CREATED;
    const priority = i % 5 === 0 ? ShipmentPriority.HIGH : ShipmentPriority.MEDIUM;

    await prisma.shipment.upsert({
      where: { shipmentNumber: `SHP-200${i}` },
      update: {},
      create: {
        shipmentNumber: `SHP-200${i}`,
        status: status,
        priority: priority,
        
        pickupAddress: pickup.address,
        pickupCity: pickup.city,
        pickupState: pickup.state,
        pickupPincode: pickup.pincode,
        pickupLatitude: pickup.lat,
        pickupLongitude: pickup.lng,
        pickupContactName: 'Warehouse Sender',
        pickupContactPhone: '+91-9999911111',

        deliveryAddress: delivery.address,
        deliveryCity: delivery.city,
        deliveryState: delivery.state,
        deliveryPincode: delivery.pincode,
        deliveryLatitude: delivery.lat,
        deliveryLongitude: delivery.lng,
        deliveryContactName: order.customerName,
        deliveryContactPhone: order.customerPhone,

        packageWeight: order.totalWeight || 10,
        packageDescription: `Electronics/Goods Order #${order.orderNumber}`,

        orderId: order.id,
        driverId: assignedDriver,
        vehicleId: assignedVehicle,
        organizationId: org.id,
      },
    });
  }

  console.log(`✅ Created 20 shipments and orders`);
  console.log('🌱 Seeding complete!');
  console.log('\n--- Test Credentials ---');
  console.log('Admin: admin@swiftlogistics.in / Admin@123');
  console.log('Ops: ops@swiftlogistics.in / Ops@123');
  console.log('Driver 1: drv-001@swiftlogistics.in / Driver@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
