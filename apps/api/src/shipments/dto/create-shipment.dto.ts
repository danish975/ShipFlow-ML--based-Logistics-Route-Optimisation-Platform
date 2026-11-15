import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const SHIPMENT_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

/**
 * Fields a client may set when creating a shipment. Server-owned fields
 * (shipmentNumber, status, risk/ML fields, organizationId) are not accepted.
 */
export class CreateShipmentDto {
  @ApiProperty({ enum: SHIPMENT_PRIORITIES, example: 'MEDIUM' })
  @IsIn(SHIPMENT_PRIORITIES)
  priority!: (typeof SHIPMENT_PRIORITIES)[number];

  // Pickup
  @ApiProperty({ example: 'Plot 14, Udyog Vihar Phase 4' })
  @IsString() @MinLength(3) @MaxLength(200)
  pickupAddress!: string;

  @ApiProperty({ example: 'Gurugram' })
  @IsString() @MinLength(2) @MaxLength(80)
  pickupCity!: string;

  @ApiProperty({ example: 'Haryana' })
  @IsString() @MinLength(2) @MaxLength(80)
  pickupState!: string;

  @ApiProperty({ example: '122015' })
  @Matches(/^\d{6}$/, { message: 'pickupPincode must be a 6-digit PIN code' })
  pickupPincode!: string;

  @ApiPropertyOptional({ example: 'Warehouse desk' })
  @IsOptional() @IsString() @MaxLength(100)
  pickupContactName?: string;

  @ApiPropertyOptional({ example: '+91 98765 43210' })
  @IsOptional() @Matches(/^[+\d][\d\s-]{7,17}$/, { message: 'pickupContactPhone must be a valid phone number' })
  pickupContactPhone?: string;

  // Delivery
  @ApiProperty({ example: 'Block E, Connaught Place' })
  @IsString() @MinLength(3) @MaxLength(200)
  deliveryAddress!: string;

  @ApiProperty({ example: 'New Delhi' })
  @IsString() @MinLength(2) @MaxLength(80)
  deliveryCity!: string;

  @ApiProperty({ example: 'Delhi' })
  @IsString() @MinLength(2) @MaxLength(80)
  deliveryState!: string;

  @ApiProperty({ example: '110001' })
  @Matches(/^\d{6}$/, { message: 'deliveryPincode must be a 6-digit PIN code' })
  deliveryPincode!: string;

  @ApiPropertyOptional({ example: 'Priya Sharma' })
  @IsOptional() @IsString() @MaxLength(100)
  deliveryContactName?: string;

  @ApiPropertyOptional({ example: '+91 91234 56789' })
  @IsOptional() @Matches(/^[+\d][\d\s-]{7,17}$/, { message: 'deliveryContactPhone must be a valid phone number' })
  deliveryContactPhone?: string;

  // Package
  @ApiProperty({ example: 450, description: 'Weight in kg' })
  @Type(() => Number) @IsNumber() @Min(0.1) @Max(40000)
  packageWeight!: number;

  @ApiPropertyOptional({ example: 'Consumer electronics — 2 cartons' })
  @IsOptional() @IsString() @MaxLength(300)
  packageDescription?: string;

  // Delivery window
  @ApiPropertyOptional({ example: '2026-11-16T09:00:00.000Z' })
  @IsOptional() @IsDateString()
  deliveryWindowStart?: string;

  @ApiPropertyOptional({ example: '2026-11-16T18:00:00.000Z' })
  @IsOptional() @IsDateString()
  deliveryWindowEnd?: string;

  @ApiPropertyOptional({ example: 'Call before arrival' })
  @IsOptional() @IsString() @MaxLength(500)
  deliveryNotes?: string;
}
