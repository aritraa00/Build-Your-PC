import dotenv from "dotenv";
import request from "supertest";
import { beforeAll, afterAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { seedComponents } from "../src/data/seed.js";
import { Build } from "../src/models/Build.js";
import { Component } from "../src/models/Component.js";
import { User } from "../src/models/User.js";

dotenv.config({ path: ".env" });

const app = createApp();

const sampleParts = {
  cpu: {
    name: "Ryzen 5 7600",
    type: "cpu",
    brand: "AMD",
    price: 229,
    specs: { socket: "AM5", tdp: 65, performanceRank: 7 }
  },
  motherboard: {
    name: "B650 Gaming WiFi",
    type: "motherboard",
    brand: "MSI",
    price: 189,
    specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX" }
  },
  ram: {
    name: "32GB DDR5 6000",
    type: "ram",
    brand: "G.Skill",
    price: 124,
    specs: { ramType: "DDR5", performanceRank: 8 }
  },
  gpu: {
    name: "RTX 4070 Super",
    type: "gpu",
    brand: "NVIDIA",
    price: 599,
    specs: { tdp: 220, performanceRank: 9 }
  },
  psu: {
    name: "850W Gold PSU",
    type: "psu",
    brand: "Seasonic",
    price: 139,
    specs: { wattage: 850 }
  },
  case: {
    name: "Airflow ATX Case",
    type: "case",
    brand: "NZXT",
    price: 109,
    specs: { supportedFormFactors: ["ATX"] }
  }
};

describe("API integration", () => {
  let token;
  let buildId;
  let shareId;

  beforeAll(async () => {
    process.env.MONGO_URI = `${process.env.MONGO_URI}-test`;
    await connectDatabase();
    await seedComponents();
  });

  beforeEach(async () => {
    await Promise.all([User.deleteMany({}), Build.deleteMany({})]);
  });

  afterAll(async () => {
    await Promise.all([User.deleteMany({}), Build.deleteMany({}), Component.deleteMany({})]);
    await disconnectDatabase();
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("registers and logs in a user", async () => {
    const registerResponse = await request(app).post("/auth/register").send({
      name: "QA User",
      email: "qa@example.com",
      password: "secret123"
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.token).toBeTruthy();

    const loginResponse = await request(app).post("/auth/login").send({
      email: "qa@example.com",
      password: "secret123"
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.email).toBe("qa@example.com");
  });

  it("rejects invalid auth payloads", async () => {
    const registerResponse = await request(app).post("/auth/register").send({
      name: "A",
      email: "invalid",
      password: "123"
    });

    expect(registerResponse.status).toBe(400);

    const loginResponse = await request(app).post("/auth/login").send({
      email: "invalid",
      password: "123"
    });

    expect(loginResponse.status).toBe(400);
  });

  it("fetches component lists with filters and rejects invalid types", async () => {
    const response = await request(app).get("/components").query({ type: "cpu", performance: "high" });
    expect(response.status).toBe(200);
    expect(response.body.items.length).toBeGreaterThan(0);

    const invalid = await request(app).get("/components").query({ type: "monitor" });
    expect(invalid.status).toBe(400);
  });

  it("blocks unauthorized build access and supports full build CRUD", async () => {
    const userResponse = await request(app).post("/auth/register").send({
      name: "Builder User",
      email: "builder@example.com",
      password: "secret123"
    });

    token = userResponse.body.token;

    const unauthorized = await request(app).post("/build/save").send({
      title: "No Auth Build",
      parts: sampleParts
    });

    expect(unauthorized.status).toBe(401);

    const createResponse = await request(app)
      .post("/build/save")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Balanced Gaming PC",
        parts: sampleParts
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.totalPrice).toBeGreaterThan(0);
    expect(createResponse.body.performanceLabel).toBe("High");
    expect(createResponse.body.warnings).toEqual([]);

    buildId = createResponse.body._id;
    shareId = createResponse.body.shareId;

    const listResponse = await request(app)
      .get("/build/user/list")
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const updateResponse = await request(app)
      .put(`/build/${buildId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Gaming PC",
        parts: {
          ...sampleParts,
          motherboard: {
            ...sampleParts.motherboard,
            specs: { socket: "LGA1700", ramType: "DDR5", formFactor: "ATX" }
          }
        }
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe("Updated Gaming PC");
    expect(updateResponse.body.warnings).toContain("CPU socket does not match the motherboard socket.");

    const sharedResponse = await request(app).get(`/build/${shareId}`);
    expect(sharedResponse.status).toBe(200);
    expect(sharedResponse.body.title).toBe("Updated Gaming PC");

    const deleteResponse = await request(app)
      .delete(`/build/${buildId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);

    const afterDelete = await request(app)
      .get("/build/user/list")
      .set("Authorization", `Bearer ${token}`);

    expect(afterDelete.body).toHaveLength(0);
  });

  it("rejects malformed build payloads", async () => {
    const userResponse = await request(app).post("/auth/register").send({
      name: "Error User",
      email: "errors@example.com",
      password: "secret123"
    });

    const response = await request(app)
      .post("/build/save")
      .set("Authorization", `Bearer ${userResponse.body.token}`)
      .send({
        title: "",
        parts: []
      });

    expect(response.status).toBe(400);
  });
});
