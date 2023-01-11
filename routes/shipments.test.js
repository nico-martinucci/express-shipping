"use strict";

const ship = require("../shipItApi"); // why do we have to do this?
ship.shipProduct = jest.fn();

const app = require("../app");
const request = require("supertest");

describe("POST /", function () {
  test("valid", async function () {
    ship.shipProduct.mockReturnValue(23049867);
    
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789"
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("throws error if empty request body", async function () {
    // shouldn't need this; incl. in case validation accidentally succeeds
    ship.shipProduct.mockReturnValue(23049867);
    
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if data is invalid", async function () {
    // shouldn't need this; incl. in case validation accidentally succeeds
    ship.shipProduct.mockReturnValue(23049867);
    
    const resp = await request(app)
      .post("/shipments")
      .send({
        productId: "taco",
        name: 1,
        addr: 2,
        zip: 3
      });

      expect(resp.body).toEqual({
        error: {
          message: [
            "instance.productId is not of a type(s) integer",
            "instance.name is not of a type(s) string",
            "instance.addr is not of a type(s) string",
            "instance.zip is not of a type(s) string"
          ],
          status: 400
        }
      });
  });

  test("productId too low (below 1000)", async function () {
    // shouldn't need this; incl. in case validation accidentally succeeds
    ship.shipProduct.mockReturnValue(23049867);
    
    const resp = await request(app).post("/shipments").send({
      productId: 999,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789"
    });

    expect(resp.body).toEqual({
      error: {
        message: [
          "instance.productId must be greater than or equal to 1000"
        ],
        status: 400
      }
    });
  });
});
