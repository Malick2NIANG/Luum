import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Trip, TripStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { SearchTripDto } from './dto/search-trip.dto';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTripDto): Promise<Trip> {
    const gp = await this.prisma.gP.findUnique({ where: { userId } });

    if (!gp) {
      throw new ForbiddenException('Only GPs can create trips');
    }

    if (!gp.isApproved) {
      throw new ForbiddenException('GP account is not approved yet');
    }

    if (dto.maxWeight > gp.maxWeightPerTrip) {
      throw new BadRequestException(
        `maxWeight cannot exceed your current limit of ${gp.maxWeightPerTrip}kg`,
      );
    }

    return this.prisma.trip.create({
      data: {
        gpId: gp.id,
        originCity: dto.originCity,
        destCity: dto.destCity,
        destCountry: dto.destCountry,
        departureDate: new Date(dto.departureDate),
        arrivalDate: dto.arrivalDate ? new Date(dto.arrivalDate) : undefined,
        pricePerKg: dto.pricePerKg,
        maxWeight: dto.maxWeight,
        flightTicketUrl: dto.flightTicketUrl,
      },
    });
  }

  async search(dto: SearchTripDto) {
    const { destCity, destCountry, date, page, limit } = dto;

    // Prisma can't compare two columns of the same row (maxWeight vs
    // usedWeight) in a `where` clause, so availability is filtered in JS
    // after fetching all status/destination/date matches.
    const trips = await this.prisma.trip.findMany({
      where: {
        status: TripStatus.UPCOMING,
        destCity,
        destCountry,
        ...(date ? { departureDate: { gte: new Date(date) } } : {}),
      },
      orderBy: { departureDate: 'asc' },
    });

    const available = trips.filter(
      (trip) => trip.maxWeight - trip.usedWeight > 0,
    );

    const total = available.length;
    const start = (page - 1) * limit;
    const data = available.slice(start, start + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        gp: {
          select: {
            id: true,
            rating: true,
            totalTrips: true,
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async updateStatus(
    id: string,
    userId: string,
    status: TripStatus,
  ): Promise<Trip> {
    const gp = await this.prisma.gP.findUnique({ where: { userId } });

    if (!gp) {
      throw new ForbiddenException('Only GPs can update trip status');
    }

    const trip = await this.prisma.trip.findUnique({ where: { id } });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (trip.gpId !== gp.id) {
      throw new ForbiddenException('You can only update your own trips');
    }

    return this.prisma.trip.update({
      where: { id },
      data: { status },
    });
  }
}
