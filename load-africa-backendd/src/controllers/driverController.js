const { prisma } = require('../config/db');
const { searchAndOfferLoad } = require('../services/matchingService');

// Helper to get actual driver ID or operator ID
const getDriverId = async (req) => {
  if (req.user?.driver?.id) return req.user.driver.id;
  if (req.user?.operator?.id) return req.user.operator.id;
  
  const driver = await prisma.driver.findUnique({ where: { user_id: req.user.id } });
  if (driver) return driver.id;

  const operator = await prisma.machineOperator.findUnique({ where: { user_id: req.user.id } });
  if (operator) return operator.id;

  return null;
};

const getAvailableLoads = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    if (!driverId) return res.status(404).json({ success: false, message: 'Driver profile not found' });

    // In a real app, we would match based on driver's assigned vehicle type and location.
    // Fetch bookings where status = DRIVER_SEARCHING OR explicitly assigned to this driver (PENDING)
    const loads = await prisma.booking.findMany({
      where: {
        is_deleted: false,
        OR: [
          {
            status: 'DRIVER_SEARCHING',
            applications: { none: { driver_id: driverId } }
          },
          {
            status: 'DRIVER_ASSIGNED',
            assignments: { some: { driver_id: driverId, status: 'PENDING' } }
          }
        ]
      },
      include: {
        customer: { include: { user: { select: { first_name: true, last_name: true, email: true, phone: true } } } },
        assignments: { where: { driver_id: driverId, status: 'PENDING' } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({ success: true, data: loads });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const applyForLoad = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const driverId = await getDriverId(req);
    
    if (!driverId) return res.status(404).json({ success: false, message: 'Driver profile not found' });

    // Check if booking is available globally OR pending for this driver
    const booking = await prisma.booking.findUnique({ 
      where: { id: bookingId },
      include: { assignments: { where: { driver_id: driverId, status: 'PENDING' } } }
    });

    if (!booking || (booking.status !== 'DRIVER_SEARCHING' && (booking.status !== 'DRIVER_ASSIGNED' || booking.assignments.length === 0))) {
      return res.status(400).json({ success: false, message: 'Load is no longer available' });
    }

    const assignment = await prisma.$transaction(async (tx) => {
      let ass;
      if (booking.assignments.length > 0) {
        // Update pending assignment to ACTIVE
        ass = await tx.bookingAssignment.update({
          where: { id: booking.assignments[0].id },
          data: { status: 'ACTIVE' }
        });
      } else {
        // Create new active assignment
        ass = await tx.bookingAssignment.create({
          data: {
            booking_id: bookingId,
            driver_id: driverId,
            status: 'ACTIVE',
            assigned_by: req.user?.id || driverId
          }
        });
        
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: 'DRIVER_ASSIGNED' }
        });
      }

      await tx.trackingHistory.create({
        data: { booking_id: bookingId, status: 'DRIVER_ASSIGNED', remarks: 'Driver accepted and assigned to load' }
      });
      
      await tx.activityLog.create({
        data: { action: 'DRIVER_ASSIGNED', description: `Driver accepted booking ${bookingId}` }
      });

      await tx.driver.update({
        where: { id: driverId },
        data: { status: 'ON_TRIP' }
      });

      return ass;
    });

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getActiveTrip = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    
    // An active trip is an ACTIVE assigned booking that is not completed or cancelled
    const activeTrip = await prisma.bookingAssignment.findFirst({
      where: {
        OR: [
          { driver_id: driverId },
          { operator_id: driverId }
        ],
        status: 'ACTIVE',
        booking: {
          status: {
            in: ['DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE', 'ARRIVED_PICKUP', 'LOADING', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED_DESTINATION', 'DELIVERED', 'POD_UPLOADED']
          }
        }
      },
      include: {
        booking: {
          include: {
            customer: { include: { user: { select: { first_name: true, last_name: true, email: true, phone: true } } } },
            quotes: true,
            tripPerformance: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: activeTrip ? {
        ...activeTrip.booking,
        assignmentStatus: activeTrip.status
      } : null
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTripStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, remarks } = req.body;
    const driverId = await getDriverId(req);

    // Ensure driver is assigned to this booking
    const assignment = await prisma.bookingAssignment.findFirst({
      where: { 
        booking_id: bookingId,
        OR: [
          { driver_id: driverId },
          { operator_id: driverId }
        ]
      }
    });

    if (!assignment) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this trip' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: { status },
        include: { quotes: true }
      });

      await tx.trackingHistory.create({
        data: { booking_id: bookingId, status, remarks: remarks || `Driver marked as ${status}` }
      });

      if (status === 'COMPLETED') {
        const existingInvoice = await tx.invoice.findFirst({
          where: { booking_id: bookingId }
        });
        
        if (!existingInvoice) {
          const grandTotal = b.quotes.length > 0 ? Number(b.quotes[0].grand_total) : 1500;
          const platformComm = grandTotal * 0.10;
          const payoutAmount = grandTotal * 0.90;

          const invoice = await tx.invoice.create({
            data: {
              invoice_no: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
              booking_id: bookingId,
              customer_id: b.customer_id,
              amount: grandTotal - platformComm,
              tax_amount: 0,
              total_amount: grandTotal,
              platform_commission: platformComm,
              payout_amount: payoutAmount,
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
              status: 'PAID'
            }
          });

          await tx.payment.create({
            data: {
              invoice_id: invoice.id,
              amount: grandTotal,
              payment_method: 'CARD',
              transaction_id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
              status: 'PAID'
            }
          });

          await tx.driver.update({
            where: { id: driverId },
            data: { status: 'AVAILABLE' }
          });

          await tx.driverStatusHistory.create({
            data: {
              driver_id: driverId,
              old_status: 'ASSIGNED', // Or whatever it was during trip
              new_status: 'AVAILABLE',
              change_reason: `Completed Trip for Booking ${bookingId.slice(0, 8)}`
            }
          });

          const driver = await tx.driver.findUnique({
            where: { id: driverId }
          });

          if (driver && driver.user_id) {
            let wallet = await tx.wallet.findFirst({
              where: { user_id: driver.user_id }
            });

            if (!wallet) {
              wallet = await tx.wallet.create({
                data: {
                  user_id: driver.user_id,
                  balance: 0,
                  pending_balance: 0
                }
              });
            }

            await tx.wallet.update({
              where: { id: wallet.id },
              data: { balance: { increment: payoutAmount } }
            });

            await tx.walletTransaction.create({
              data: {
                wallet_id: wallet.id,
                type: 'CREDIT',
                amount: payoutAmount,
                description: `Payout for load delivery (Booking ID: ${bookingId.slice(0, 8)})`,
                reference_id: bookingId
              }
            });
          }
        }
      }

      return b;
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getDriverHistory = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    const history = await prisma.bookingAssignment.findMany({
      where: {
        driver_id: driverId,
        booking: {
          status: {
            in: ['COMPLETED', 'CLOSED', 'CANCELLED']
          }
        }
      },
      include: { booking: { include: { customer: { include: { user: { select: { first_name: true, last_name: true, email: true } } } } } } },
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json({ success: true, data: history.map(h => h.booking) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getDriverDashboard = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    if (!driverId) return res.status(404).json({ success: false, message: 'Driver profile not found' });

    // 1. Fetch driver with all profile info
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        user: true,
        approval: true,
        profile: true,
        photos: true,
        kyc: true,
        vehicle_relation: true,
        fleet_owner: { include: { user: true } },
        compliance: true,
        status_history: {
          orderBy: { created_at: 'desc' },
          take: 50
        }
      }
    });

    // 2. Fetch completed loads (trips)
    const completedLoads = await prisma.bookingAssignment.count({
      where: { driver_id: driverId, booking: { status: 'COMPLETED', is_deleted: false } }
    });

    // 3. Fetch active trips
    const activeTripsCount = await prisma.bookingAssignment.count({
      where: {
        driver_id: driverId,
        booking: {
          status: {
            in: ['DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE', 'ARRIVED_PICKUP', 'LOADING', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED_DESTINATION', 'DELIVERED', 'POD_UPLOADED']
          },
          is_deleted: false
        }
      }
    });

    // 4. Fetch available loads count
    const availableLoadsCount = await prisma.booking.count({
      where: { status: 'DRIVER_SEARCHING', is_deleted: false }
    });

    // 5. Fetch Wallet
    const wallet = await prisma.wallet.findFirst({
      where: { user_id: driver.user_id }
    });

    // 6. Rating (calculate average reviews or default to 5.0)
    const reviews = await prisma.review.findMany({
      where: { driver_id: driverId }
    });
    const avgRating = reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
      : 5.0;

    res.status(200).json({
      success: true,
      data: {
        kycStatus: driver.approval?.status || 'NOT_STARTED',
        driverPhoto: driver.photos?.profile_photo || driver.user.avatar || null,
        verificationBadge: driver.user.status === 'ACTIVE' ? 'VERIFIED' : 'PENDING',
        currentStatus: driver.status,
        walletBalance: wallet ? Number(wallet.balance) : 0.00,
        ratings: parseFloat(avgRating.toFixed(1)),
        trips: activeTripsCount,
        completedLoads: completedLoads,
        availableLoads: availableLoadsCount,
        vehicle: driver.fleet_owner_id
          ? { manufacturer: "Fleet Assigned", model: driver.assigned_vehicle_id ? "Assigned Vehicle" : "No vehicle assigned yet" }
          : driver.vehicle_relation
            ? { manufacturer: driver.vehicle_relation.manufacturer, model: driver.vehicle_relation.model, reg: driver.vehicle_relation.registration_number }
            : null,
        fleetOwner: driver.fleet_owner?.company_name || null,
        compliance: driver.compliance && driver.compliance.length > 0 ? driver.compliance[0] : null,
        statusHistory: driver.status_history || []
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const completeOnboarding = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    if (!driverId) return res.status(404).json({ success: false, message: 'Driver profile not found' });

    // Update DriverProfile onboarding_completed to true
    await prisma.driverProfile.update({
      where: { driver_id: driverId },
      data: { onboarding_completed: true }
    });

    // Update DriverKYC to reflect verified status
    await prisma.driverKYC.update({
      where: { driver_id: driverId },
      data: {
        phone_verified: true,
        gps_enabled: true,
        terms_accepted: true,
        training_completed: true
      }
    });

    await prisma.activityLog.create({
      data: {
        user_id: req.user.id,
        action: 'DRIVER_ONBOARDING_COMPLETED',
        description: `Driver completed first-login onboarding checklist.`
      }
    });

    res.status(200).json({ success: true, message: 'Onboarding completed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const submitKYC = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    const { license, pdp, id_document } = req.body;

    if (!driverId) return res.status(404).json({ success: false, message: 'Driver profile not found' });

    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: {
        license,
        pdp,
        id_document,
        status: 'UNDER_REVIEW'
      }
    });

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { user: true }
    });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    
    res.status(200).json({
      success: true,
      data: {
        first_name: driver.user.first_name || '',
        last_name: driver.user.last_name || '',
        email: driver.user.email,
        phone: driver.user.phone || '',
        avatar: driver.user.avatar || '',
        bank_details: driver.user.bank_details || {}
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    const driver = await prisma.driver.findUnique({
      where: { id: driverId }
    });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });

    const { first_name, last_name, phone, bank_details, avatar } = req.body;

    await prisma.user.update({
      where: { id: driver.user_id },
      data: {
        first_name: first_name !== undefined ? first_name : undefined,
        last_name: last_name !== undefined ? last_name : undefined,
        phone: phone !== undefined ? phone : undefined,
        avatar: avatar !== undefined ? avatar : undefined,
        bank_details: bank_details !== undefined ? bank_details : undefined,
      }
    });

    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTelemetry = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { latitude, longitude, speed, heading } = req.body;
    const driverId = await getDriverId(req);

    const assignment = await prisma.bookingAssignment.findFirst({
      where: { booking_id: bookingId, driver_id: driverId }
    });
    if (!assignment) {
      return res.status(403).json({ success: false, message: 'Not authorized to update tracking for this trip' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const startLat = booking.pickup_coords_lat;
    const startLng = booking.pickup_coords_lng;
    const endLat = booking.delivery_coords_lat;
    const endLng = booking.delivery_coords_lng;

    const calcDist = (lat1, lon1, lat2, lon2) => {
      if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return parseFloat((R * c).toFixed(2));
    };

    const completed = calcDist(startLat, startLng, latitude, longitude);
    const remaining = calcDist(latitude, longitude, endLat, endLng);
    
    const etaMs = remaining > 0 ? (remaining / 50) * 60 * 60 * 1000 : 0;
    const etaDate = new Date(Date.now() + etaMs);

    const telemetry = await prisma.$transaction(async (tx) => {
      // 1. Update current position in Booking
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          current_latitude: parseFloat(latitude),
          current_longitude: parseFloat(longitude)
        }
      });

      // 2. Upsert LiveTrackingTelemetry
      const tel = await tx.liveTrackingTelemetry.upsert({
        where: { booking_id: bookingId },
        update: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          completed_distance: completed,
          remaining_distance: remaining,
          eta: etaDate
        },
        create: {
          booking_id: bookingId,
          driver_id: driverId,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          completed_distance: completed,
          remaining_distance: remaining,
          eta: etaDate
        }
      });

      // 3. Log to tracking history
      await tx.trackingHistory.create({
        data: {
          booking_id: bookingId,
          status: booking.status,
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
          remarks: `Live telemetry update. Completed: ${completed} km. Remaining: ${remaining} km. Speed: ${speed || 0} km/h. Heading: ${heading || 0}°.`,
          updated_by: req.user?.id || 'SYSTEM'
        }
      });

      return tel;
    });

    const io = req.app.get('io');
    if (io) {
      io.emit(`telemetry_updated_${bookingId}`, {
        bookingId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        completed_distance: completed,
        remaining_distance: remaining,
        eta: etaDate,
        speed: speed || 0,
        heading: heading || 0,
        updatedAt: new Date().toISOString()
      });
    }

    res.status(200).json({ success: true, data: telemetry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const toggleOnlineStatus = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    const { isOnline, latitude, longitude } = req.body;

    if (!driverId) return res.status(404).json({ success: false, message: 'Driver profile not found' });

    const newStatus = isOnline ? 'AVAILABLE' : 'INACTIVE';

    await prisma.$transaction(async (tx) => {
      const driver = await tx.driver.findUnique({ where: { id: driverId } });
      const oldStatus = driver.status;

      await tx.driver.update({
        where: { id: driverId },
        data: { status: newStatus }
      });

      if (oldStatus !== newStatus) {
        await tx.driverStatusHistory.create({
          data: {
            driver_id: driverId,
            old_status: oldStatus,
            new_status: newStatus,
            change_reason: isOnline ? 'Driver went online (Radar Active)' : 'Driver went offline'
          }
        });
      }

      await tx.driverProfile.update({
        where: { driver_id: driverId },
        data: {
          gps_lat: latitude ? parseFloat(latitude) : null,
          gps_lng: longitude ? parseFloat(longitude) : null
        }
      });
    });

    res.status(200).json({ success: true, message: `Driver is now ${isOnline ? 'online' : 'offline'}` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getKYCDocuments = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    if (!driverId) return res.status(404).json({ success: false, message: 'Driver profile not found' });

    let documents = await prisma.driverDocuments.findUnique({
      where: { driver_id: driverId }
    });

    if (!documents) {
      documents = await prisma.driverDocuments.create({
        data: { driver_id: driverId }
      });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { 
        approval: true,
        profile: true,
        kyc: true,
        user: true,
        photos: true
      }
    });

    const allDocuments = {
      ...documents,
      profile_photo: driver.photos?.profile_photo || null,
      selfie: driver.photos?.selfie || null,
    };

    res.status(200).json({
      success: true,
      data: {
        documents: allDocuments,
        status: driver.status,
        approval: driver.approval,
        profileDetails: {
          fullName: driver.user ? `${driver.user.first_name || ''} ${driver.user.last_name || ''}`.trim() : '',
          email: driver.user?.email || '',
          phone: driver.user?.phone || '',
          dob: driver.profile?.date_of_birth || '',
          gender: driver.profile?.gender || '',
          nationalId: driver.national_id || driver.kyc?.national_id || '',
          licenseNumber: driver.license || driver.kyc?.license_number || '',
          licenseExpiry: driver.license_expiry || driver.kyc?.license_expiry || '',
          address: driver.address || driver.profile?.address || '',
          city: driver.profile?.city || '',
          province: driver.profile?.province || '',
          emergencyContactName: driver.profile?.emergency_contact?.name || '',
          emergencyContactPhone: driver.profile?.emergency_contact?.phone || ''
        }
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const uploadKYCDocument = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    if (!driverId) return res.status(404).json({ success: false, message: 'Driver profile not found' });

    const { docKey, fileUrl } = req.body;
    if (!docKey || !fileUrl) {
      return res.status(400).json({ success: false, message: 'Document key and file URL are required' });
    }

    const documents = await prisma.driverDocuments.upsert({
      where: { driver_id: driverId },
      update: { [docKey]: fileUrl },
      create: { driver_id: driverId, [docKey]: fileUrl }
    });

    await prisma.driver.update({
      where: { id: driverId },
      data: { status: 'PENDING' }
    });
    
    const d = await prisma.driver.findUnique({ where: { id: driverId } });
    await prisma.user.update({
      where: { id: d.user_id },
      data: { status: 'PENDING' }
    });

    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPendingOffers = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    if (!driverId) return res.status(404).json({ success: false, message: 'Driver profile not found' });

    const offers = await prisma.loadOffer.findMany({
      where: {
        driver_id: driverId,
        status: 'PENDING'
      },
      include: {
        booking: {
          include: { customer: { include: { user: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const acceptOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const driverId = await getDriverId(req);
    
    const offer = await prisma.loadOffer.findFirst({
      where: { id: offerId, driver_id: driverId, status: 'PENDING' },
      include: { booking: true }
    });

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found or already processed' });
    }

    const assignment = await prisma.$transaction(async (tx) => {
      // Mark offer accepted
      await tx.loadOffer.update({
        where: { id: offerId },
        data: { status: 'ACCEPTED' }
      });

      // Update booking to PAYMENT_PENDING
      await tx.booking.update({
        where: { id: offer.booking_id },
        data: { status: 'PAYMENT_PENDING' }
      });

      // Update driver to assigned
      const driver = await tx.driver.findUnique({ where: { id: driverId } });
      const oldStatus = driver.status;

      await tx.driver.update({
        where: { id: driverId },
        data: { status: 'ASSIGNED' }
      });

      await tx.driverStatusHistory.create({
        data: {
          driver_id: driverId,
          old_status: oldStatus,
          new_status: 'ASSIGNED',
          change_reason: `Accepted Load Offer for Booking ${offer.booking_id}`
        }
      });

      // Create Booking Assignment
      const ass = await tx.bookingAssignment.create({
        data: {
          booking_id: offer.booking_id,
          driver_id: driverId,
          status: 'ACTIVE',
          assigned_by: 'SYSTEM'
        }
      });

      await tx.trackingHistory.create({
        data: { booking_id: offer.booking_id, status: 'PAYMENT_PENDING', remarks: 'Driver accepted load. Waiting for customer payment.' }
      });

      return ass;
    });

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const rejectOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const driverId = await getDriverId(req);
    
    const offer = await prisma.loadOffer.findFirst({
      where: { id: offerId, driver_id: driverId, status: 'PENDING' }
    });

    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found or already processed' });
    }

    await prisma.$transaction(async (tx) => {
      // Mark offer rejected
      await tx.loadOffer.update({
        where: { id: offerId },
        data: { status: 'REJECTED' }
      });

      // Log it
      await tx.activityLog.create({
        data: { action: 'LOAD_REJECTED', description: `Driver rejected offer for booking ${offer.booking_id}` }
      });
    });

    // Search next driver in background
    searchAndOfferLoad(offer.booking_id).catch(console.error);

    res.status(200).json({ success: true, message: 'Offer rejected successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const submitCompliance = async (req, res) => {
  try {
    const driverId = await getDriverId(req);
    const { uniform_standards, hygiene, documentation } = req.body;

    let compliance = await prisma.driverCompliance.findFirst({
      where: { driver_id: driverId }
    });

    if (compliance) {
      compliance = await prisma.driverCompliance.update({
        where: { id: compliance.id },
        data: { uniform_standards, hygiene, documentation, last_updated: new Date() }
      });
    } else {
      compliance = await prisma.driverCompliance.create({
        data: {
          driver_id: driverId,
          uniform_standards,
          hygiene,
          documentation
        }
      });
    }

    res.status(200).json({ success: true, data: compliance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePerformance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const { milestone, weight } = req.body;

    // Determine if user is a Driver or Operator
    let driverId = null;
    const driver = await prisma.driver.findUnique({ where: { user_id: userId } });
    if (driver) {
      driverId = driver.id;
    } else {
      // User is an operator — try to find a driver from the assignment, or skip
      const assignment = await prisma.bookingAssignment.findFirst({
        where: { booking_id: bookingId },
        include: { booking: true }
      });
      if (assignment?.driver_id) {
        driverId = assignment.driver_id;
      } else {
        // No driver linked — return success without creating performance record
        return res.status(200).json({ success: true, data: null, message: 'Performance tracking skipped for operator' });
      }
    }

    let performance = await prisma.tripPerformance.findUnique({
      where: { booking_id: bookingId }
    });

    if (!performance) {
      performance = await prisma.tripPerformance.create({
        data: {
          booking_id: bookingId,
          driver_id: driverId,
          dot_status: 'ACTIVE'
        }
      });
    }

    const updateData = {};
    const now = new Date();

    if (milestone === 'ARRIVE') updateData.arrive_time = now;
    if (milestone === 'COLLECT') {
      updateData.collection_time = now;
      if (weight !== undefined) updateData.weight_of_load = weight;
    }
    if (milestone === 'DEPART') updateData.depart_time = now;
    if (milestone === 'DESTINATION_ARRIVE') updateData.destination_arrive_time = now;

    performance = await prisma.tripPerformance.update({
      where: { id: performance.id },
      data: updateData
    });

    res.status(200).json({ success: true, data: performance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAvailableLoads,
  applyForLoad,
  getActiveTrip,
  updateTripStatus,
  getDriverHistory,
  getDriverDashboard,
  submitKYC,
  getProfile,
  updateProfile,
  completeOnboarding,
  updateTelemetry,
  toggleOnlineStatus,
  getKYCDocuments,
  uploadKYCDocument,
  getPendingOffers,
  acceptOffer,
  rejectOffer,
  submitCompliance,
  updatePerformance
};
