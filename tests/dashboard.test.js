import test from "node:test";
import assert from "node:assert";
import { upsertCallSession, listCallSessions } from "../src/state/callSessionStore.js";

test("CallSessionStore: listCallSessions returns all sessions", (t) => {
  const callId = "session_test_" + Date.now();
  upsertCallSession(callId, { provider: "test" });

  const sessions = listCallSessions();
  const found = sessions.find(s => s.callId === callId);
  assert.ok(found, "Session should be found in list");
});
