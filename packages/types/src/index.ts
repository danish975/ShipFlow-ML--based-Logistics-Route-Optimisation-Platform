// ============================================
// ShipFlow Shared Types
// ============================================

// ---- Enums ----

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATIONS_MANAGER = 'OPERATIONS_MANAGER',
  DISPATCHER = 'DISPATCHER',
  DRIVER = 'DRIVER',
  ANALYST = 'ANALYST',
}

export enum ShipmentStatus {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELAYED = 'DELAYED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum ShipmentPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  MAINTENANCE = 'MAINTENANCE',
  OFFLINE = 'OFFLINE',
}

export enum VehicleType {
  BIKE = 'BIKE',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
  MINI_TRUCK = 'MINI_TRUCK',
  TEMPO = 'TEMPO',
  THREE_WHEELER = 'THREE_WHEELER',
}

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  ON_DUTY = 'ON_DUTY',
  ON_BREAK = 'ON_BREAK',
  OFF_DUTY = 'OFF_DUTY',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum RouteStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REROUTED = 'REROUTED',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum EventType {
  SHIPMENT_CREATED = 'SHIPMENT_CREATED',
  SHIPMENT_ASSIGNED = 'SHIPMENT_ASSIGNED',
  ROUTE_CREATED = 'ROUTE_CREATED',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  SHIPMENT_DISPATCHED = 'SHIPMENT_DISPATCHED',
  LOCATION_UPDATED = 'LOCATION_UPDATED',
  ETA_UPDATED = 'ETA_UPDATED',
  DELIVERY_DELAY_DETECTED = 'DELIVERY_DELAY_DETECTED',
  ROUTE_RECALCULATED = 'ROUTE_RECALCULATED',
  DELIVERY_COMPLETED = 'DELIVERY_COMPLETED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  VEHICLE_BREAKDOWN = 'VEHICLE_BREAKDOWN',
  DRIVER_DEVIATION = 'DRIVER_DEVIATION',
  MANUAL_OVERRIDE = 'MANUAL_OVERRIDE',
}

export enum NotificationType {
  SHIPMENT_DELAYED = 'SHIPMENT_DELAYED',
  HIGH_RISK = 'HIGH_RISK',
  ROUTE_RECALCULATED = 'ROUTE_RECALCULATED',
  VEHICLE_BREAKDOWN = 'VEHICLE_BREAKDOWN',
  DRIVER_DEVIATION = 'DRIVER_DEVIATION',
  DELIVERY_COMPLETED = 'DELIVERY_COMPLETED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

// ---- API Response Types ----

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ---- Auth Types ----

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  organizationId: string;
  iat?: number;
  exp?: number;
}

// ---- Shipment Types ----

export interface CreateShipmentDto {
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupPincode: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  pickupContactName?: string;
  pickupContactPhone?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPincode: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryContactName?: string;
  deliveryContactPhone?: string;
  packageWeight: number;
  packageLength?: number;
  packageWidth?: number;
  packageHeight?: number;
  packageDescription?: string;
  priority?: ShipmentPriority;
  deliveryWindowStart?: string;
  deliveryWindowEnd?: string;
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface UpdateShipmentDto {
  status?: ShipmentStatus;
  driverId?: string;
  vehicleId?: string;
  priority?: ShipmentPriority;
  deliveryWindowStart?: string;
  deliveryWindowEnd?: string;
  deliveryNotes?: string;
  failureReason?: string;
}

export interface ShipmentFilters {
  status?: ShipmentStatus | ShipmentStatus[];
  priority?: ShipmentPriority;
  driverId?: string;
  vehicleId?: string;
  routeId?: string;
  riskLevel?: RiskLevel;
  dateFrom?: string;
  dateTo?: string;
}

// ---- Driver Types ----

export interface CreateDriverDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  vehicleId?: string;
}

export interface UpdateDriverDto {
  status?: DriverStatus;
  vehicleId?: string | null;
  licenseNumber?: string;
  licenseExpiry?: string;
}

// ---- Vehicle Types ----

export interface CreateVehicleDto {
  vehicleNumber: string;
  type: VehicleType;
  make?: string;
  model?: string;
  year?: number;
  capacityKg: number;
  capacityVolumeCbm?: number;
  fuelType?: string;
}

export interface UpdateVehicleDto {
  status?: VehicleStatus;
  make?: string;
  model?: string;
  capacityKg?: number;
  fuelType?: string;
}

// ---- Route Types ----

export interface CreateRouteDto {
  startAddress: string;
  startLatitude: number;
  startLongitude: number;
  endAddress?: string;
  endLatitude?: number;
  endLongitude?: number;
  driverId?: string;
  vehicleId?: string;
  shipmentIds?: string[];
  stops: RouteStopInput[];
}

export interface RouteStopInput {
  address: string;
  latitude: number;
  longitude: number;
  stopType: 'PICKUP' | 'DELIVERY' | 'WAREHOUSE';
  shipmentId?: string;
  estimatedArrival?: string;
}

// ---- Tracking Types ----

export interface LocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  batteryLevel?: number;
  timestamp?: string;
  shipmentId?: string;
}

// ---- ML Prediction Types ----

export interface EtaPredictionRequest {
  distanceKm: number;
  routeDurationMin: number;
  numStops: number;
  vehicleType: string;
  priority: string;
  hourOfDay: number;
  dayOfWeek: number;
  packageWeight: number;
  currentProgress?: number;
}

export interface EtaPredictionResponse {
  predictedEtaMinutes: number;
  confidence: number;
  expectedArrival: string;
  modelVersion: string;
}

export interface RiskPredictionRequest {
  distanceKm: number;
  routeDurationMin: number;
  numStops: number;
  vehicleType: string;
  priority: string;
  hourOfDay: number;
  dayOfWeek: number;
  packageWeight: number;
  driverRating: number;
  historicalDelayRate?: number;
  currentDelayMinutes?: number;
}

export interface RiskPredictionResponse {
  riskScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  modelVersion: string;
}

export interface RiskFactor {
  factor: string;
  impact: 'positive' | 'negative';
  description: string;
}

// ---- Optimization Types ----

export interface OptimizationRequest {
  vehicleId?: string;
  startLocation: { latitude: number; longitude: number; address?: string };
  stops: OptimizationStop[];
  constraints?: OptimizationConstraints;
}

export interface OptimizationStop {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  shipmentId?: string;
  priority?: number;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  serviceTimeMin?: number;
  demandKg?: number;
}

export interface OptimizationConstraints {
  maxDistanceKm?: number;
  maxDurationMin?: number;
  vehicleCapacityKg?: number;
  returnToStart?: boolean;
}

export interface OptimizationResult {
  optimizedOrder: number[];
  totalDistanceKm: number;
  totalDurationMin: number;
  distanceSavedKm: number;
  timeSavedMin: number;
  routeGeometry?: unknown;
  stops: OptimizedStop[];
}

export interface OptimizedStop {
  sequenceOrder: number;
  stopId: string;
  latitude: number;
  longitude: number;
  address?: string;
  estimatedArrival: string;
  distanceFromPrevKm: number;
  durationFromPrevMin: number;
}

// ---- WebSocket Event Types ----

export interface WsLocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

export interface WsShipmentUpdate {
  shipmentId: string;
  status: ShipmentStatus;
  estimatedArrival?: string;
  riskScore?: number;
  riskLevel?: RiskLevel;
  currentLatitude?: number;
  currentLongitude?: number;
}

export interface WsRouteUpdate {
  routeId: string;
  shipmentId?: string;
  newGeometry?: unknown;
  reason: string;
}

export interface WsNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ---- Dashboard Types ----

export interface DashboardKpis {
  activeShipments: number;
  deliveriesToday: number;
  onTimeDeliveryRate: number;
  averageEtaError: number;
  fleetUtilization: number;
  activeDrivers: number;
  highRiskShipments: number;
  distanceSavedKm: number;
}

export interface DeliveryPerformance {
  date: string;
  onTime: number;
  delayed: number;
  failed: number;
  total: number;
}

export interface FleetUtilization {
  active: number;
  idle: number;
  maintenance: number;
  offline: number;
}

export interface RouteEfficiency {
  date: string;
  plannedDistanceKm: number;
  actualDistanceKm: number;
  savedDistanceKm: number;
}

export interface EtaAccuracy {
  date: string;
  predictedMinutes: number;
  actualMinutes: number;
  errorMinutes: number;
}

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

// ---- Analytics Types ----

export interface AnalyticsQuery {
  dateFrom: string;
  dateTo: string;
  groupBy?: 'day' | 'week' | 'month';
  driverId?: string;
  vehicleId?: string;
}

export interface VehicleAssignmentRecommendation {
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  score: number;
  reasons: string[];
  estimatedDeliveryTime?: number;
  distanceFromPickup?: number;
  availableCapacity?: number;
}
