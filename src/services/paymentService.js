/**
 * สร้างลิงก์ชำระเงินและส่ง SMS
 */
async function createPaymentLink(order) {
  return {
    orderId: order?.id || null,
    paymentUrl: 'https://example.com/pay/placeholder'
  };
}

module.exports = {
  createPaymentLink
};
