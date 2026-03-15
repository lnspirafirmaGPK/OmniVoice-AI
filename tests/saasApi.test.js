import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

async function withServer(run) {
  const app = createApp();
  const server = app.listen(0);
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("GET /api/v1/auth/me requires auth", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/auth/me`);
    assert.equal(response.status, 401);

    const body = await response.json();
    assert.equal(body.error.code, "UNAUTHORIZED");
  });
});

test("tenant_admin can manage products in own tenant", async () => {
  await withServer(async (baseUrl) => {
    const token = "tenant-admin-token";

    const createResponse = await fetch(`${baseUrl}/api/v1/tenants/tenant_demo/products`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sku: "SKU-MVP-001", name: "ชุดทดลอง MVP", price: 990 }),
    });

    assert.equal(createResponse.status, 201);
    const createBody = await createResponse.json();
    assert.equal(createBody.data.tenantId, "tenant_demo");

    const listResponse = await fetch(`${baseUrl}/api/v1/tenants/tenant_demo/products`, {
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(listResponse.status, 200);
    const listBody = await listResponse.json();
    assert.ok(listBody.data.some((product) => product.sku === "SKU-MVP-001"));
  });
});

test("tenant scope isolation blocks cross-tenant access", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/tenants/tenant_trial/products`, {
      headers: { authorization: "Bearer tenant-admin-token" },
    });

    assert.equal(response.status, 403);
    const body = await response.json();
    assert.equal(body.error.code, "TENANT_SCOPE_VIOLATION");
  });
});
