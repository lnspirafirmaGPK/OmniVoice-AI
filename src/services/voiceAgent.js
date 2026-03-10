/**
 * จัดการการเชื่อมต่อผู้ให้บริการ voice agent เช่น Ringly และ Retell AI
 */
async function handleCallSession(sessionPayload) {
  return {
    status: 'received',
    provider: sessionPayload?.provider || 'retell',
    sessionId: sessionPayload?.sessionId || null
  };
}

module.exports = {
  handleCallSession
};
