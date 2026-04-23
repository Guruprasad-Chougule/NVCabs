import { PrismaClient, VehicleType, TripType, BookingStatus, PaymentStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding NV Cabs database...');

  // ── Users ──────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@NVCabs2024', 10);

  const adminUser = await prisma.user.upsert({
    where: { phone: '9530800800' },
    update: {},
    create: {
      name: 'NV Cabs Admin',
      email: 'admin@nvcabs.in',
      phone: '9530800800',
      role: UserRole.super_admin,
      passwordHash: adminPassword,
    },
  });

  const driver1User = await prisma.user.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      name: 'Rajan Kumar',
      email: 'rajan@nvcabs.in',
      phone: '9876543210',
      role: UserRole.driver,
    },
  });

  const driver2User = await prisma.user.upsert({
    where: { phone: '9765432109' },
    update: {},
    create: {
      name: 'Suresh Babu',
      email: 'suresh@nvcabs.in',
      phone: '9765432109',
      role: UserRole.driver,
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { phone: '9988776655' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '9988776655',
      role: UserRole.customer,
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { phone: '9977665544' },
    update: {},
    create: {
      name: 'Arun Mehta',
      email: 'arun@example.com',
      phone: '9977665544',
      role: UserRole.customer,
    },
  });

  console.log('✅ Users seeded');

  // ── Vehicles ───────────────────────────────────────────
  const vehicles = await Promise.all([
    prisma.vehicle.upsert({
      where: { registrationNo: 'KA01AB1234' },
      update: {},
      create: {
        type: VehicleType.sedan,
        make: 'Maruti Suzuki',
        model: 'Dzire',
        registrationNo: 'KA01AB1234',
        capacity: 4,
        ac: true,
        ratePerKm: 12,
        ratePerDay: 3000,
        imageUrl: '/images/vehicles/sedan.jpg',
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNo: 'KA02CD5678' },
      update: {},
      create: {
        type: VehicleType.suv,
        make: 'Toyota',
        model: 'Fortuner',
        registrationNo: 'KA02CD5678',
        capacity: 6,
        ac: true,
        ratePerKm: 18,
        ratePerDay: 5000,
        imageUrl: '/images/vehicles/suv.jpg',
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNo: 'KA03EF9012' },
      update: {},
      create: {
        type: VehicleType.innova,
        make: 'Toyota',
        model: 'Innova Crysta',
        registrationNo: 'KA03EF9012',
        capacity: 7,
        ac: true,
        ratePerKm: 16,
        ratePerDay: 4500,
        imageUrl: '/images/vehicles/innova.jpg',
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNo: 'KA04GH3456' },
      update: {},
      create: {
        type: VehicleType.tempo_traveller,
        make: 'Force',
        model: 'Tempo Traveller',
        registrationNo: 'KA04GH3456',
        capacity: 14,
        ac: true,
        ratePerKm: 25,
        ratePerDay: 8000,
        imageUrl: '/images/vehicles/tempo.jpg',
      },
    }),
    prisma.vehicle.upsert({
      where: { registrationNo: 'KA05IJ7890' },
      update: {},
      create: {
        type: VehicleType.mini_bus,
        make: 'Tata',
        model: 'Winger',
        registrationNo: 'KA05IJ7890',
        capacity: 22,
        ac: true,
        ratePerKm: 35,
        ratePerDay: 12000,
        imageUrl: '/images/vehicles/minibus.jpg',
      },
    }),
  ]);

  console.log('✅ Vehicles seeded');

  // ── Drivers ────────────────────────────────────────────
  const driver1 = await prisma.driver.upsert({
    where: { userId: driver1User.id },
    update: {},
    create: {
      userId: driver1User.id,
      licenseNumber: 'KA0120180012345',
      licenseExpiry: new Date('2027-06-30'),
      experienceYears: 8,
      rating: 4.8,
      isAvailable: true,
      vehicleId: vehicles[0].id,
    },
  });

  const driver2 = await prisma.driver.upsert({
    where: { userId: driver2User.id },
    update: {},
    create: {
      userId: driver2User.id,
      licenseNumber: 'KA0120190067890',
      licenseExpiry: new Date('2026-12-31'),
      experienceYears: 5,
      rating: 4.6,
      isAvailable: true,
      vehicleId: vehicles[2].id,
    },
  });

  console.log('✅ Drivers seeded');

  // ── Pricing Rules ──────────────────────────────────────
  const pricingData = [
    { vehicleType: VehicleType.sedan,          tripType: TripType.one_way,    baseFare: 300,  perKmRate: 12, driverBatta: 0,   nightSurcharge: 150 },
    { vehicleType: VehicleType.sedan,          tripType: TripType.round_trip, baseFare: 500,  perKmRate: 11, driverBatta: 300, nightSurcharge: 150 },
    { vehicleType: VehicleType.sedan,          tripType: TripType.multi_day,  baseFare: 1000, perKmRate: 11, driverBatta: 300, nightSurcharge: 150 },
    { vehicleType: VehicleType.suv,            tripType: TripType.one_way,    baseFare: 500,  perKmRate: 18, driverBatta: 0,   nightSurcharge: 200 },
    { vehicleType: VehicleType.suv,            tripType: TripType.round_trip, baseFare: 800,  perKmRate: 17, driverBatta: 400, nightSurcharge: 200 },
    { vehicleType: VehicleType.suv,            tripType: TripType.multi_day,  baseFare: 1500, perKmRate: 17, driverBatta: 400, nightSurcharge: 200 },
    { vehicleType: VehicleType.innova,         tripType: TripType.one_way,    baseFare: 400,  perKmRate: 16, driverBatta: 0,   nightSurcharge: 175 },
    { vehicleType: VehicleType.innova,         tripType: TripType.round_trip, baseFare: 700,  perKmRate: 15, driverBatta: 350, nightSurcharge: 175 },
    { vehicleType: VehicleType.innova,         tripType: TripType.multi_day,  baseFare: 1200, perKmRate: 15, driverBatta: 350, nightSurcharge: 175 },
    { vehicleType: VehicleType.tempo_traveller,tripType: TripType.one_way,    baseFare: 800,  perKmRate: 25, driverBatta: 0,   nightSurcharge: 300 },
    { vehicleType: VehicleType.tempo_traveller,tripType: TripType.round_trip, baseFare: 1200, perKmRate: 23, driverBatta: 500, nightSurcharge: 300 },
    { vehicleType: VehicleType.tempo_traveller,tripType: TripType.multi_day,  baseFare: 2000, perKmRate: 23, driverBatta: 500, nightSurcharge: 300 },
    { vehicleType: VehicleType.mini_bus,       tripType: TripType.one_way,    baseFare: 1500, perKmRate: 35, driverBatta: 0,   nightSurcharge: 500 },
    { vehicleType: VehicleType.mini_bus,       tripType: TripType.round_trip, baseFare: 2000, perKmRate: 32, driverBatta: 800, nightSurcharge: 500 },
    { vehicleType: VehicleType.mini_bus,       tripType: TripType.multi_day,  baseFare: 3000, perKmRate: 32, driverBatta: 800, nightSurcharge: 500 },
  ];

  for (const rule of pricingData) {
    await prisma.pricingRule.upsert({
      where: { vehicleType_tripType: { vehicleType: rule.vehicleType, tripType: rule.tripType } },
      update: {},
      create: { ...rule, gstPercent: 5 },
    });
  }

  console.log('✅ Pricing rules seeded');

  // ── Routes ─────────────────────────────────────────────
  const routesData = [
    {
      slug: 'bangalore-to-ooty',
      origin: 'Bangalore',
      destination: 'Ooty',
      distanceKm: 270,
      durationHours: 6.5,
      isFeatured: true,
      description: 'Journey from the Garden City of India to the Queen of Hill Stations. The Bangalore to Ooty route takes you through the scenic Nilgiri Hills, offering breathtaking views of tea gardens, eucalyptus forests, and picturesque valleys.',
      highlights: ['Ooty Botanical Gardens', 'Doddabetta Peak', 'Ooty Lake', 'Nilgiri Mountain Railway', 'Tea Museum'],
      imageUrl: '/images/routes/ooty.jpg',
      metaTitle: 'Bangalore to Ooty Cab | Book Taxi at Best Prices | NV Cabs',
      metaDesc: 'Book Bangalore to Ooty cab at affordable prices. AC cabs, sedan, SUV, Innova available. Comfortable 270km journey. 24/7 support.',
    },
    {
      slug: 'bangalore-to-coorg',
      origin: 'Bangalore',
      destination: 'Coorg',
      distanceKm: 250,
      durationHours: 5.5,
      isFeatured: true,
      description: 'Coorg, the Scotland of India, is a paradise for nature lovers. The route from Bangalore to Coorg passes through lush coffee plantations, misty hills, and verdant forests.',
      highlights: ['Abbey Falls', 'Raja\'s Seat', 'Namdroling Monastery', 'Coffee Plantations', 'Dubare Elephant Camp'],
      imageUrl: '/images/routes/coorg.jpg',
      metaTitle: 'Bangalore to Coorg Cab | Affordable Taxi Booking | NV Cabs',
      metaDesc: 'Book comfortable cab from Bangalore to Coorg. 250km journey through scenic coffee estates. Best prices, professional drivers.',
    },
    {
      slug: 'bangalore-to-mysore',
      origin: 'Bangalore',
      destination: 'Mysore',
      distanceKm: 150,
      durationHours: 3,
      isFeatured: true,
      description: 'The royal city of Mysore is just 150km from Bangalore via the well-maintained NH275. Known as the City of Palaces, Mysore is famous for its grand Dasara celebrations and royal heritage.',
      highlights: ['Mysore Palace', 'Brindavan Gardens', 'Chamundi Hills', 'Mysore Zoo', 'St. Philomena\'s Church'],
      imageUrl: '/images/routes/mysore.jpg',
      metaTitle: 'Bangalore to Mysore Cab | Day Trip Taxi | NV Cabs',
      metaDesc: 'Book Bangalore to Mysore taxi for a perfect day trip. 150km, 3 hours journey. Sedan, SUV, Innova available at best prices.',
    },
    {
      slug: 'bangalore-to-tirupati',
      origin: 'Bangalore',
      destination: 'Tirupati',
      distanceKm: 250,
      durationHours: 5,
      isFeatured: true,
      description: 'The holy pilgrim town of Tirupati, home to the famous Tirumala Venkateswara Temple, is one of the most visited religious sites in the world. NV Cabs offers comfortable pilgrimage taxi service from Bangalore.',
      highlights: ['Tirumala Venkateswara Temple', 'Srikalahasti Temple', 'Chandragiri Fort', 'ISKCON Temple Tirupati'],
      imageUrl: '/images/routes/tirupati.jpg',
      metaTitle: 'Bangalore to Tirupati Cab | Pilgrimage Taxi | NV Cabs',
      metaDesc: 'Book Bangalore to Tirupati taxi for your pilgrimage. Comfortable 250km journey. Special darshan assistance available.',
    },
    {
      slug: 'bangalore-to-pondicherry',
      origin: 'Bangalore',
      destination: 'Pondicherry',
      distanceKm: 310,
      durationHours: 6,
      isFeatured: true,
      description: 'Pondicherry, the French Riviera of the East, is a perfect weekend getaway from Bangalore. The route takes you through scenic Tamil Nadu countryside.',
      highlights: ['Auroville', 'Promenade Beach', 'French Quarter', 'Sri Aurobindo Ashram', 'Paradise Beach'],
      imageUrl: '/images/routes/pondicherry.jpg',
      metaTitle: 'Bangalore to Pondicherry Cab | Weekend Getaway Taxi | NV Cabs',
      metaDesc: 'Book Bangalore to Pondicherry cab for a relaxing weekend trip. 310km journey, AC vehicles, experienced drivers.',
    },
    {
      slug: 'bangalore-to-goa',
      origin: 'Bangalore',
      destination: 'Goa',
      distanceKm: 560,
      durationHours: 10,
      isFeatured: true,
      description: 'Goa, India\'s party capital and beach paradise, is 560km from Bangalore. NV Cabs provides comfortable outstation cab service for this long-distance journey through Karnataka and Goa.',
      highlights: ['Baga Beach', 'Calangute Beach', 'Old Goa Churches', 'Dudhsagar Waterfalls', 'Anjuna Flea Market'],
      imageUrl: '/images/routes/goa.jpg',
      metaTitle: 'Bangalore to Goa Cab | Outstation Taxi Service | NV Cabs',
      metaDesc: 'Book Bangalore to Goa cab at affordable prices. 560km comfortable journey with experienced drivers. SUV, Innova available.',
    },
    {
      slug: 'bangalore-to-wayanad',
      origin: 'Bangalore',
      destination: 'Wayanad',
      distanceKm: 280,
      durationHours: 6,
      isFeatured: false,
      description: 'Wayanad, nestled in the Western Ghats, is a nature lover\'s paradise with dense forests, wildlife sanctuaries, and misty hills. The drive from Bangalore to Wayanad is scenic and refreshing.',
      highlights: ['Chembra Peak', 'Edakkal Caves', 'Pookode Lake', 'Banasura Sagar Dam', 'Wayanad Wildlife Sanctuary'],
      imageUrl: '/images/routes/wayanad.jpg',
      metaTitle: 'Bangalore to Wayanad Cab | Nature Tourism Taxi | NV Cabs',
      metaDesc: 'Book cab from Bangalore to Wayanad. Explore the green paradise of Western Ghats. Best prices, comfortable journey.',
    },
    {
      slug: 'bangalore-to-hampi',
      origin: 'Bangalore',
      destination: 'Hampi',
      distanceKm: 340,
      durationHours: 7,
      isFeatured: false,
      description: 'Hampi, a UNESCO World Heritage Site, was once the capital of the Vijayanagara Empire. The ruins of this ancient city spread across a surreal landscape of giant boulders and lush plantations.',
      highlights: ['Virupaksha Temple', 'Vittala Temple & Stone Chariot', 'Hampi Bazaar', 'Matanga Hill', 'Elephant Stables'],
      imageUrl: '/images/routes/hampi.jpg',
      metaTitle: 'Bangalore to Hampi Cab | Heritage Tour Taxi | NV Cabs',
      metaDesc: 'Book Bangalore to Hampi cab for a heritage tour. Visit UNESCO World Heritage Site. Comfortable 340km journey.',
    },
    {
      slug: 'bangalore-airport-transfers',
      origin: 'Bangalore City',
      destination: 'Kempegowda International Airport (BLR)',
      distanceKm: 40,
      durationHours: 1.5,
      isFeatured: true,
      description: 'NV Cabs provides reliable airport taxi service from Bangalore city to Kempegowda International Airport (BLR) and back. We ensure you reach the airport on time with our experienced drivers.',
      highlights: ['24/7 availability', 'Flight tracking', 'Meet & greet service', 'Fixed prices', 'All terminals covered'],
      imageUrl: '/images/routes/airport.jpg',
      metaTitle: 'Bangalore Airport Taxi | BLR Airport Transfer | NV Cabs',
      metaDesc: 'Book reliable Bangalore airport cab service. 24/7 availability, fixed prices, flight tracking. BLR airport transfer at best rates.',
    },
  ];

  for (const route of routesData) {
    await prisma.route.upsert({
      where: { slug: route.slug },
      update: {},
      create: route,
    });
  }

  console.log('✅ Routes seeded');

  // ── Tour Packages ──────────────────────────────────────
  const packagesData = [
    {
      slug: 'ooty-2n3d-package',
      title: 'Ooty Hill Station Getaway - 2 Nights 3 Days',
      destination: 'Ooty',
      durationDays: 3,
      durationNights: 2,
      category: 'Hill Station',
      basePrice: 8500,
      description: 'Experience the misty hills and tea gardens of Ooty with our curated 3-day package. Includes comfortable cab service, sightseeing, and guided tours.',
      highlights: ['Botanical Gardens', 'Doddabetta Peak', 'Ooty Lake Boating', 'Tea Factory Visit', 'Nilgiri Train Ride'],
      inclusions: ['AC Cab from Bangalore (Both ways)', 'Professional Driver', 'Fuel Charges', 'All Tolls & Parking', 'Driver Batta', '24/7 Support'],
      exclusions: ['Hotel Accommodation', 'Meals', 'Entry Tickets', 'Personal Expenses', 'Travel Insurance'],
      imageUrl: '/images/packages/ooty.jpg',
    },
    {
      slug: 'coorg-weekend-package',
      title: 'Coorg Coffee Country Weekend - 2 Nights 3 Days',
      destination: 'Coorg',
      durationDays: 3,
      durationNights: 2,
      category: 'Hill Station',
      basePrice: 7500,
      description: 'Discover the verdant coffee estates and misty landscapes of Coorg with our comprehensive 3-day package from Bangalore.',
      highlights: ['Abbey Falls', 'Raja\'s Seat', 'Coffee Plantation Walk', 'Dubare Elephant Camp', 'White Water Rafting'],
      inclusions: ['AC Cab from Bangalore (Both ways)', 'Professional Driver', 'Fuel Charges', 'All Tolls & Parking', 'Driver Batta'],
      exclusions: ['Hotel Accommodation', 'Meals', 'Entry Tickets', 'Personal Expenses'],
      imageUrl: '/images/packages/coorg.jpg',
    },
    {
      slug: 'tirupati-darshan-package',
      title: 'Tirupati Darshan - 1 Night 2 Days',
      destination: 'Tirupati',
      durationDays: 2,
      durationNights: 1,
      category: 'Pilgrimage',
      basePrice: 5500,
      description: 'A peaceful pilgrimage package to Tirupati, the abode of Lord Venkateswara. We handle all cab logistics so you can focus on your spiritual journey.',
      highlights: ['Tirumala Venkateswara Darshan', 'Srikalahasti Temple', 'Padmavathi Temple', 'Chandragiri Fort'],
      inclusions: ['AC Cab from Bangalore (Both ways)', 'Professional Driver', 'Fuel Charges', 'All Tolls & Parking', 'Darshan Queue Assistance'],
      exclusions: ['Hotel Accommodation', 'Meals', 'Darshan Tickets', 'Puja Expenses'],
      imageUrl: '/images/packages/tirupati.jpg',
    },
    {
      slug: 'goa-beach-package',
      title: 'Goa Beach Holiday - 3 Nights 4 Days',
      destination: 'Goa',
      durationDays: 4,
      durationNights: 3,
      category: 'Beach',
      basePrice: 15000,
      description: 'Sun, sand, and sea! Our 4-day Goa package takes you from Bangalore to the party capital of India with comfortable cab service and a flexible itinerary.',
      highlights: ['Baga & Calangute Beach', 'Old Goa Churches', 'Dudhsagar Waterfalls', 'Anjuna Flea Market', 'Sunset Cruise'],
      inclusions: ['AC Cab from Bangalore (Both ways)', 'Professional Driver', 'Fuel Charges', 'All Tolls & Parking', 'Driver Batta'],
      exclusions: ['Hotel Accommodation', 'Meals', 'Entry Tickets', 'Water Sports'],
      imageUrl: '/images/packages/goa.jpg',
    },
    {
      slug: 'pondicherry-weekend',
      title: 'Pondicherry Weekend Escape - 2 Nights 3 Days',
      destination: 'Pondicherry',
      durationDays: 3,
      durationNights: 2,
      category: 'Beach',
      basePrice: 8000,
      description: 'Escape to the French Riviera of the East with our Pondicherry package. From the serene Auroville to the bustling Promenade Beach.',
      highlights: ['Auroville Matrimandir', 'French Quarter Walk', 'Promenade Beach', 'Sri Aurobindo Ashram', 'Paradise Beach'],
      inclusions: ['AC Cab from Bangalore (Both ways)', 'Professional Driver', 'Fuel Charges', 'All Tolls & Parking'],
      exclusions: ['Hotel Accommodation', 'Meals', 'Entry Tickets'],
      imageUrl: '/images/packages/pondicherry.jpg',
    },
    {
      slug: 'hampi-heritage-tour',
      title: 'Hampi Heritage Tour - 1 Night 2 Days',
      destination: 'Hampi',
      durationDays: 2,
      durationNights: 1,
      category: 'Heritage',
      basePrice: 6500,
      description: 'Step back in time with our Hampi Heritage Tour. Explore the ruins of the magnificent Vijayanagara Empire spread across a surreal boulder-strewn landscape.',
      highlights: ['Virupaksha Temple', 'Vittala Temple Complex', 'Stone Chariot', 'Hampi Bazaar', 'Matanga Hill Sunrise'],
      inclusions: ['AC Cab from Bangalore (Both ways)', 'Professional Driver', 'Fuel Charges', 'All Tolls & Parking', 'Driver Batta'],
      exclusions: ['Hotel Accommodation', 'Meals', 'Entry Tickets', 'Guide Charges'],
      imageUrl: '/images/packages/hampi.jpg',
    },
  ];

  for (const pkg of packagesData) {
    await prisma.tourPackage.upsert({
      where: { slug: pkg.slug },
      update: {},
      create: pkg,
    });
  }

  console.log('✅ Tour packages seeded');

  // ── Bookings ───────────────────────────────────────────
  const booking1 = await prisma.booking.create({
    data: {
      bookingRef: 'NV-260412-001',
      userId: customer1.id,
      driverId: driver1.id,
      vehicleId: vehicles[0].id,
      tripType: TripType.one_way,
      pickupLocation: 'Koramangala, Bangalore',
      pickupLat: 12.9352,
      pickupLng: 77.6245,
      dropLocation: 'Ooty, Tamil Nadu',
      dropLat: 11.4102,
      dropLng: 76.6950,
      pickupDatetime: new Date('2026-04-20T06:00:00'),
      passengers: 3,
      estimatedDistanceKm: 270,
      estimatedFare: 3840,
      finalFare: 3840,
      status: BookingStatus.completed,
      paymentStatus: PaymentStatus.paid,
      specialInstructions: 'Please carry water bottles',
    },
  });

  await prisma.booking.create({
    data: {
      bookingRef: 'NV-260412-002',
      userId: customer2.id,
      tripType: TripType.round_trip,
      pickupLocation: 'HSR Layout, Bangalore',
      pickupLat: 12.9116,
      pickupLng: 77.6473,
      dropLocation: 'Kempegowda International Airport (BLR)',
      dropLat: 13.1986,
      dropLng: 77.7066,
      pickupDatetime: new Date('2026-04-25T04:30:00'),
      returnDatetime: new Date('2026-04-28T18:00:00'),
      passengers: 2,
      estimatedDistanceKm: 80,
      estimatedFare: 1680,
      status: BookingStatus.confirmed,
      paymentStatus: PaymentStatus.partial,
    },
  });

  console.log('✅ Bookings seeded');

  // ── Reviews ────────────────────────────────────────────
  const reviewsData = [
    { userId: customer1.id, bookingId: booking1.id, rating: 5, comment: 'Excellent service! Driver was very professional and punctual. The car was clean and comfortable. Will definitely book again for my next trip to Ooty.', isApproved: true },
    { userId: customer2.id, rating: 5, comment: 'Best cab service in Bangalore. Used NV Cabs for my airport transfer and it was a seamless experience. Driver tracked my flight and was waiting when I landed.', isApproved: true },
  ];

  // Create additional mock reviews
  const mockReviewUsers = [
    { name: 'Vikram Rajan', phone: '9111222333', email: 'vikram@example.com' },
    { name: 'Meena Krishnan', phone: '9222333444', email: 'meena@example.com' },
    { name: 'Anand Patel', phone: '9333444555', email: 'anand@example.com' },
    { name: 'Sonia Reddy', phone: '9444555666', email: 'sonia@example.com' },
    { name: 'Kiran Naidu', phone: '9555666777', email: 'kiran@example.com' },
  ];

  for (const u of mockReviewUsers) {
    await prisma.user.upsert({
      where: { phone: u.phone },
      update: {},
      create: { ...u, role: UserRole.customer },
    });
  }

  const allCustomers = await prisma.user.findMany({ where: { role: UserRole.customer } });

  const extraReviews = [
    { rating: 5, comment: 'Used NV Cabs for Coorg trip. Amazing experience! Driver knew all the scenic spots and was very helpful throughout the journey.' },
    { rating: 4, comment: 'Good service for Mysore day trip. Car was comfortable and driver was knowledgeable about the city. Will use again.' },
    { rating: 5, comment: 'Perfect Tirupati pilgrimage trip. Driver helped with darshan queue management. Truly a stress-free experience.' },
    { rating: 5, comment: 'Booked Innova for family trip to Goa. 10 people, very comfortable journey. Driver was experienced on that route.' },
    { rating: 4, comment: 'Good airport transfer service. Driver was on time and vehicle was clean. Slightly delayed due to traffic but communicated well.' },
  ];

  for (let i = 0; i < extraReviews.length && i < allCustomers.length; i++) {
    await prisma.review.create({
      data: {
        userId: allCustomers[i].id,
        rating: extraReviews[i].rating,
        comment: extraReviews[i].comment,
        isApproved: true,
      },
    });
  }

  console.log('✅ Reviews seeded');

  // ── Enquiries ──────────────────────────────────────────
  await prisma.enquiry.createMany({
    data: [
      { name: 'Corporate Travel Manager', email: 'travel@techcorp.in', phone: '9800011111', subject: 'Corporate Account Setup', message: 'We need regular cab services for 50+ employees for airport transfers and client visits. Please share your corporate packages.', status: 'new' },
      { name: 'Wedding Coordinator', email: 'weddings@events.in', phone: '9800022222', subject: 'Fleet for Wedding', message: 'Need 10 vehicles (mix of sedans and Innovas) for a wedding on May 15. Can you provide fleet availability and pricing?', status: 'responded' },
    ],
  });

  console.log('✅ Enquiries seeded');
  console.log('\n🎉 Database seeding complete!');
  console.log('\n📋 Admin credentials:');
  console.log('   Phone: 9530800800');
  console.log('   Password: Admin@NVCabs2024');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
