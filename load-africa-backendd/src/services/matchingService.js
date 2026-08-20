const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Searches for the closest available driver and creates a LoadOffer.
 * @param {string} bookingId 
 */
async function searchAndOfferLoad(bookingId) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) throw new Error('Booking not found');

    // If it's a Plant Hire booking, broadcast to Plant Owners via HireRequest
    if (booking.cargo_category === 'PLANT_HIRE' || booking.cargo_category === 'Plant Hire') {
      const plantOwners = await prisma.plantOwner.findMany({
        where: { status: 'ACTIVE' }
      });

      if (plantOwners.length === 0) {
        console.log(`[MatchingService] No active Plant Owners found for booking ${bookingId}`);
        return { success: false, message: 'No available plant owners found.' };
      }

      // Create a HireRequest for each active PlantOwner
      const hireRequests = plantOwners.map(owner => ({
        booking_id: bookingId,
        plant_owner_id: owner.id,
        status: 'PENDING'
      }));

      await prisma.hireRequest.createMany({
        data: hireRequests
      });

      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'DRIVER_SEARCHING' } // Using standard searching status
      });

      console.log(`[MatchingService] Broadcasted Plant Hire booking ${bookingId} to ${plantOwners.length} owners.`);
      return { success: true, message: 'Broadcasted to plant owners.' };
    }

    // Standard Freight Logic — DO NOT auto-match drivers.
    // Booking stays at PAYMENT_RECEIVED. The Broker will manually assign a Fleet Owner
    // from their "Assigned Loads" page, and the Fleet Owner will then assign Driver + Vehicle.
    console.log(`[MatchingService] Freight booking ${bookingId} ready for Broker to assign Fleet Owner.`);
    return { success: true, message: 'Booking ready for Broker assignment.' };

  } catch (error) {
    console.error('[MatchingService] Error:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  searchAndOfferLoad
};
