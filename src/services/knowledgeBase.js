/**
 * ระบบ RAG สำหรับค้นหาข้อมูลจาก PDF และ Google Sheets
 */
async function searchKnowledgeBase(query) {
  return {
    query,
    source: ['pdf', 'google-sheets'],
    result: 'Knowledge base integration placeholder'
  };
}

module.exports = {
  searchKnowledgeBase
};
