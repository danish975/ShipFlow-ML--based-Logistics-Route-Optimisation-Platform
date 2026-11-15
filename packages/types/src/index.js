"use strict";
// ============================================
// ShipFlow Shared Types
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.EventType = exports.RiskLevel = exports.RouteStatus = exports.DriverStatus = exports.VehicleType = exports.VehicleStatus = exports.ShipmentPriority = exports.ShipmentStatus = exports.UserRole = void 0;
// ---- Enums ----
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["OPERATIONS_MANAGER"] = "OPERATIONS_MANAGER";
    UserRole["DISPATCHER"] = "DISPATCHER";
    UserRole["DRIVER"] = "DRIVER";
    UserRole["ANALYST"] = "ANALYST";
})(UserRole || (exports.UserRole = UserRole = {}));
var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus["CREATED"] = "CREATED";
    ShipmentStatus["ASSIGNED"] = "ASSIGNED";
    ShipmentStatus["PICKED_UP"] = "PICKED_UP";
    ShipmentStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ShipmentStatus["DELAYED"] = "DELAYED";
    ShipmentStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    ShipmentStatus["DELIVERED"] = "DELIVERED";
    ShipmentStatus["FAILED"] = "FAILED";
    ShipmentStatus["CANCELLED"] = "CANCELLED";
})(ShipmentStatus || (exports.ShipmentStatus = ShipmentStatus = {}));
var ShipmentPriority;
(function (ShipmentPriority) {
    ShipmentPriority["LOW"] = "LOW";
    ShipmentPriority["MEDIUM"] = "MEDIUM";
    ShipmentPriority["HIGH"] = "HIGH";
    ShipmentPriority["URGENT"] = "URGENT";
})(ShipmentPriority || (exports.ShipmentPriority = ShipmentPriority = {}));
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["AVAILABLE"] = "AVAILABLE";
    VehicleStatus["ASSIGNED"] = "ASSIGNED";
    VehicleStatus["IN_TRANSIT"] = "IN_TRANSIT";
    VehicleStatus["MAINTENANCE"] = "MAINTENANCE";
    VehicleStatus["OFFLINE"] = "OFFLINE";
})(VehicleStatus || (exports.VehicleStatus = VehicleStatus = {}));
var VehicleType;
(function (VehicleType) {
    VehicleType["BIKE"] = "BIKE";
    VehicleType["VAN"] = "VAN";
    VehicleType["TRUCK"] = "TRUCK";
    VehicleType["MINI_TRUCK"] = "MINI_TRUCK";
    VehicleType["TEMPO"] = "TEMPO";
    VehicleType["THREE_WHEELER"] = "THREE_WHEELER";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["AVAILABLE"] = "AVAILABLE";
    DriverStatus["ON_DUTY"] = "ON_DUTY";
    DriverStatus["ON_BREAK"] = "ON_BREAK";
    DriverStatus["OFF_DUTY"] = "OFF_DUTY";
    DriverStatus["UNAVAILABLE"] = "UNAVAILABLE";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
var RouteStatus;
(function (RouteStatus) {
    RouteStatus["PLANNED"] = "PLANNED";
    RouteStatus["ACTIVE"] = "ACTIVE";
    RouteStatus["COMPLETED"] = "COMPLETED";
    RouteStatus["CANCELLED"] = "CANCELLED";
    RouteStatus["REROUTED"] = "REROUTED";
})(RouteStatus || (exports.RouteStatus = RouteStatus = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["CRITICAL"] = "CRITICAL";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var EventType;
(function (EventType) {
    EventType["SHIPMENT_CREATED"] = "SHIPMENT_CREATED";
    EventType["SHIPMENT_ASSIGNED"] = "SHIPMENT_ASSIGNED";
    EventType["ROUTE_CREATED"] = "ROUTE_CREATED";
    EventType["DRIVER_ASSIGNED"] = "DRIVER_ASSIGNED";
    EventType["SHIPMENT_DISPATCHED"] = "SHIPMENT_DISPATCHED";
    EventType["LOCATION_UPDATED"] = "LOCATION_UPDATED";
    EventType["ETA_UPDATED"] = "ETA_UPDATED";
    EventType["DELIVERY_DELAY_DETECTED"] = "DELIVERY_DELAY_DETECTED";
    EventType["ROUTE_RECALCULATED"] = "ROUTE_RECALCULATED";
    EventType["DELIVERY_COMPLETED"] = "DELIVERY_COMPLETED";
    EventType["DELIVERY_FAILED"] = "DELIVERY_FAILED";
    EventType["VEHICLE_BREAKDOWN"] = "VEHICLE_BREAKDOWN";
    EventType["DRIVER_DEVIATION"] = "DRIVER_DEVIATION";
    EventType["MANUAL_OVERRIDE"] = "MANUAL_OVERRIDE";
})(EventType || (exports.EventType = EventType = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["SHIPMENT_DELAYED"] = "SHIPMENT_DELAYED";
    NotificationType["HIGH_RISK"] = "HIGH_RISK";
    NotificationType["ROUTE_RECALCULATED"] = "ROUTE_RECALCULATED";
    NotificationType["VEHICLE_BREAKDOWN"] = "VEHICLE_BREAKDOWN";
    NotificationType["DRIVER_DEVIATION"] = "DRIVER_DEVIATION";
    NotificationType["DELIVERY_COMPLETED"] = "DELIVERY_COMPLETED";
    NotificationType["DELIVERY_FAILED"] = "DELIVERY_FAILED";
    NotificationType["SYSTEM_ALERT"] = "SYSTEM_ALERT";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
