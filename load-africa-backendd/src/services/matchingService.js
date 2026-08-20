const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Searches for the closest available transporter (Fleet Owner) based on real telemetry,
 * calculates ETA, and creates an assignment offer.
 * @param {string} bookingId 
 */
async function searchAndOfferLoad(bookingId) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) throw new Error('Booking not found');

    const setManualAction = async (reason) => {
      console.log(`[MatchingService] ${reason}. Falling back to MANUAL_ACTION_REQUIRED.`);
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'MANUAL_ACTION_REQUIRED' }
      });
      await prisma.trackingHistory.create({
        data: {
          booking_id: bookingId,
          status: 'MANUAL_ACTION_REQUIRED',
          remarks: `Automated matching failed: ${reason}`,
          updated_by: 'SYSTEM'
        }
      });
      return { success: false, message: reason };
    };

    const pLat = booking.pickup_coords_lat;
    const pLng = booking.pickup_coords_lng;

    if (!pLat || !pLng) {
      return setManualAction('Pickup coordinates are missing');
    }

    // Find all active drivers who have GPS data and belong to a Fleet
    const drivers = await prisma.driverProfile.findMany({
      where: {
        gps_lat: { not: null },
        gps_lng: { not: null },
        driver: {
          fleet_owner_id: { not: null },
          status: 'AVAILABLE',
          is_deleted: false
        }
      },
      include: {
        driver: {
          include: { fleet_owner: true }
        }
      }
    });

    if (drivers.length === 0) {
      return setManualAction('No available vehicles with active telemetry found in the region');
    }

    // Find the closest Fleet Owner based on their drivers' locations
    let closestFleetOwnerId = null;
    let minDistance = Infinity;

    for (const dp of drivers) {
      const dist = calculateDistance(pLat, pLng, dp.gps_lat, dp.gps_lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestFleetOwnerId = dp.driver.fleet_owner_id;
      }
    }

    // If the closest vehicle is ridiculously far (e.g., > 1000km), fallback to manual.
    if (minDistance > 1000) {
      return setManualAction(`Closest available vehicle is too far (${Math.round(minDistance)}km)`);
    }

    // Calculate ETA (assume average speed of 60 km/h)
    const hoursToPickup = minDistance / 60;
    const estimatedPickupTime = new Date(Date.now() + hoursToPickup * 60 * 60 * 1000);

    // Create a LoadOffer targeted at the Fleet Owner (driver_id is null at this stage)
    await prisma.loadOffer.create({
      data: {
        booking_id: bookingId,
        fleet_owner_id: closestFleetOwnerId,
        status: 'PENDING',
        distance_km: minDistance,
        estimated_pickup_time: estimatedPickupTime
      }
    });

    // Update Booking Status to OFFER_SENT and store ETA
    await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: 'OFFER_SENT',
        estimated_pickup_time: estimatedPickupTime
      }
    });

    await prisma.trackingHistory.create({
      data: {
        booking_id: bookingId,
        status: 'OFFER_SENT',
        remarks: `Load offer sent to Transporter. Distance: ${Math.round(minDistance)}km, ETA: ${hoursToPickup.toFixed(1)} hrs.`,
        updated_by: 'SYSTEM'
      }
    });

    console.log(`[MatchingService] Successfully matched booking ${bookingId} to Fleet ${closestFleetOwnerId}.`);
    return { success: true, message: 'Transporter matched and offer sent.' };

  } catch (error) {
    console.error('[MatchingService] Error:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  searchAndOfferLoad
};
