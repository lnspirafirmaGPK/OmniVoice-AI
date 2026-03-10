/**
 * สรุปข้อมูลส่งเข้า Line / Email
 */
async function sendConversationSummary(summaryPayload) {
  return {
    deliveredTo: summaryPayload?.channel || 'line',
    status: 'queued'
  };
}

module.exports = {
  sendConversationSummary
};
