import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { app } from "./app";

describe("products", () => {
  it("should list products", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });
});
