import express from "express";
import { listCallSessions, getCallSession } from "../state/callSessionStore.js";
import { env } from "../config/env.js";
import { appointmentService } from "../services/appointmentService.js";

const router = express.Router();

let currentTone = {
  professionalism: 85,
  empathy: 42,
  enthusiasm: 60,
};

// Get all active sessions (for the dashboard)
router.get("/sessions", (req, res) => {
  res.json(listCallSessions());
});

// Get a specific session (for real-time transcript updates)
router.get("/sessions/:callId", (req, res) => {
  const session = getCallSession(req.params.callId);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json(session);
});

// Get system configuration (for Screen 2)
router.get("/config", (req, res) => {
  res.json({
    sttModel: env.openAiSttModel,
    llmModel: env.openAiLlmModel,
    ttsModel: env.openAiTtsModel,
    ttsVoice: env.openAiTtsVoice,
    tone: currentTone,
  });
});

// Update system configuration
router.post("/config", (req, res) => {
  const { sttModel, llmModel, ttsModel, ttsVoice, tone } = req.body;
  if (sttModel) env.openAiSttModel = sttModel;
  if (llmModel) env.openAiLlmModel = llmModel;
  if (ttsModel) env.openAiTtsModel = ttsModel;
  if (ttsVoice) env.openAiTtsVoice = ttsVoice;
  if (tone) currentTone = { ...currentTone, ...tone };

  res.json({ message: "Configuration updated successfully", config: req.body });
});

// Confirm appointment (from Action Canvas)
router.post("/appointments/:id/confirm", async (req, res) => {
  // In a real system, we'd update the DB. For now, we'll just mock it.
  res.json({ message: "Appointment confirmed", id: req.params.id });
});

export default router;
