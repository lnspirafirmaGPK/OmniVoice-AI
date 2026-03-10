/**
 * ระบบจองคิวลงปฏิทิน
 */
async function createBooking(bookingRequest) {
  return {
    bookingId: bookingRequest?.id || null,
    status: 'pending'
  };
}

module.exports = {
  createBooking
};
