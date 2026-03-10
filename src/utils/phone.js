function normalizeThaiPhoneNumber(phone) {
  return String(phone || '').replace(/[^\d+]/g, '');
}

module.exports = {
  normalizeThaiPhoneNumber
};
