const request = require("supertest");
const app = require("../app");
const { hashPass } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User, sequelize } = require("../models");
const ControllerUpdate = require('../controllers/updateData')
const Midtranst = require('../helpers/midtrans')
let validToken;
let invalidToken = "1234aesfasrqwdareaqw";
const seedUser = [
  {
    username: "user1",
    email: "user1@mail.com",
    phone: "0812907319123",
    fullName: "user1 test",
    password: "12345",
    city_id: 1,
    address: "jalan buntu",
    imageProfile: "test image",
  },
  {
    username: "user2",
    email: "user2@mail.com",
    phone: "08129073191232",
    fullName: "user2 test",
    password: "12345",
    city_id: 1,
    address: "jalan buntu",
    imageProfile: "test image",
  },
];
seedUser.forEach((e) => {
  e.password = hashPass(e.password);
});

beforeAll(async () => {
  try {
    await User.bulkCreate(seedUser);
    validToken = signToken({ id: 1 });
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await sequelize.queryInterface.bulkDelete("Users", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error);
  }
});

describe("Testing for users", () => {
  it("check POST /register Success!!", async () => {
    const response = await request(app).post("/register").send({
      username: "user3",
      email: "user3@mail",
      phone: "086198328222",
      fullName: "user3",
      password: "12345",
      city_id: 1,
      address: "jalan jauh",
      imageProfile: "test foto",
    });
    expect(response.status).toBe(201);
    expect(response.body.dataValues).toHaveProperty("username", "user3");
  });
  it("check POST /register => username is require", async () => {
    const response = await request(app).post("/register").send({
      email: "user3@mail",
      phone: "086198328222",
      fullName: "user3",
      password: "12345",
      city_id: 1,
      address: "jalan jauh",
      imageProfile: "test foto",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "username is required");
  });
  it("check POST /register => email is require", async () => {
    const response = await request(app).post("/register").send({
      username: "user3",
      phone: "086198328222",
      fullName: "user3",
      password: "12345",
      city_id: 1,
      address: "jalan jauh",
      imageProfile: "test foto",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "email is required");
  });
  it("check POST /register => password is require", async () => {
    const response = await request(app).post("/register").send({
      username: "user3",
      email: "user3@mail",
      phone: "086198328222",
      fullName: "user3",
      city_id: 1,
      address: "jalan jauh",
      imageProfile: "test foto",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "password is required");
  });
  it("check POST /register => password is fullname", async () => {
    const response = await request(app).post("/register").send({
      username: "user3",
      email: "user3@mail",
      phone: "086198328222",
      password: "12345",
      city_id: 1,
      address: "jalan jauh",
      imageProfile: "test foto",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "fullName is required");
  });
  it("check POST /register => password is city", async () => {
    const response = await request(app).post("/register").send({
      username: "user3",
      email: "user3@mail",
      phone: "086198328222",
      password: "12345",
      fullName: "user3",
      address: "jalan jauh",
      imageProfile: "test foto",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "city is required");
  });
  it("check POST /register => password is address", async () => {
    const response = await request(app).post("/register").send({
      username: "user3",
      email: "user3@mail",
      phone: "086198328222",
      password: "12345",
      city_id: 1,
      fullName: "user3",
      imageProfile: "test foto",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "address is required");
  });

  it("check POST /register => username already used", async () => {
    const response = await request(app).post("/register").send({
      username: "user3",
      email: "user3@mail",
      phone: "086198328222",
      fullName: "user3",
      password: "12345",
      city_id: 1,
      address: "jalan jauh",
      imageProfile: "test foto",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "username already used");
  });
  it("check POST /register => email already used", async () => {
    const response = await request(app).post("/register").send({
      username: "user4",
      email: "user3@mail",
      phone: "086198328222",
      fullName: "user3",
      password: "12345",
      city_id: 1,
      address: "jalan jauh",
      imageProfile: "test foto",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "email already used");
  });
});

describe("Testing for user Login", () => {
  it("POST /login success", async () => {
    const response = await request(app).post("/login").send({
      email: "user1@mail.com",
      password: "12345",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "user1");
    expect(response.body).toHaveProperty("email", "user1@mail.com");
    expect(response.body).toHaveProperty("access_key", expect.any(String));
  });
  it("POST /login wrong email or password", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
      password: "12345d",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
  it("POST /login wrong email require", async () => {
    const response = await request(app).post("/login").send({
      password: "12345d",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "email is require");
  });
  it("POST /login wrong password require", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "password is require");
  });
});

describe("End point for get User", () => {
  it("GET /users findall", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
  });

  it("GET /users by id", () => {
    return request(app)
      .get("/users/1")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", expect.any(Number));
        expect(response.body).toHaveProperty("username", "user1");
        expect(response.body).toHaveProperty("phone", "0812907319123");
        expect(response.body).toHaveProperty("fullName", "user1 test");
        expect(response.body).toHaveProperty("city_id", 1);
        expect(response.body).toHaveProperty("address", "jalan buntu");
        expect(response.body).toHaveProperty("imageProfile", "test image");
        expect(response.body).toHaveProperty("balance", expect.any(Number));
      });
  });

  it("GET/users by id NOT FOUND", () => {
    return request(app)
      .get("/users/99")
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User Not Found!");
      });
  });
});

describe("End point BALANCE", () => {
  it("PATCH addbalance", () => {
    return request(app)
      .patch("/addbalance/1")
      .send({
        balance: 30000,
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
          "message",
          "balance terUpdate 30000"
        );
      });
  });

  it("PATCH reducebalance", () => {
    return request(app)
      .patch("/reducebalance/1")
      .send({
        balance: 10000,
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
          "message",
          "balance terUpdate 20000"
        );
      });
  });
  it("PATCH reducebalance Balance Not Enough", () => {
    return request(app)
      .patch("/reducebalance/1")
      .send({
        balance: 50000,
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "balance not enough");
      });
  });

  it("PATCH balance not found", () => {
    return request(app)
      .patch("/addbalance/99")
      .send({
        balance: 100000,
      })
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User Not Found!");
      });
  });
  it("PATCH balance not found", () => {
    return request(app)
      .patch("/reducebalance/99")
      .send({
        balance: 100000,
      })
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User Not Found!");
      });
  });
});

describe("End point GET historie", () => {
  it("GET histories balance", () => {
    return request(app)
      .get("/histories/balance/1")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id", 2);
        expect(response.body[0]).toHaveProperty("UserId", 1);
        expect(response.body[0]).toHaveProperty("initialBalance", 30000);
        expect(response.body[0]).toHaveProperty("transaction", 10000);
        expect(response.body[0]).toHaveProperty("status", "out");
      });
  });

  it("GET histories balance NOT FOUND", () => {
    return request(app)
      .get("/histories/balance/99")
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User Not Found!");
      });
  });
});

describe("End point Image", () => {
  it("PATCH image in User", () => {
    return request(app)
      .patch("/image/1")
      .send({
        imageProfile:
          "https://res.cloudinary.com/chelsea-production/image/upload/c_fit,h_630,w_1200/v1/site-assets/Backgrounds/Screensaver",
      })
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "success update image");
      });
  });

  it("PATCH image in User Not Found", () => {
    return request(app)
      .patch("/image/99")
      .send({
        imageProfile:
          "https://res.cloudinary.com/chelsea-production/image/upload/c_fit,h_630,w_1200/v1/site-assets/Backgrounds/Screensaver",
      })
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User Not Found!");
      });
  });
  it("PATCH image in User with empty Req Body", () => {
    return request(app)
      .patch("/image/1")
      .send({
        imageProfile: "",
      })
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "please insert image");
      });
  });
});

describe("Post Report/Request", () => {
  it("POST /request balance widthdraw", async () => {
    const response = await request(app).post("/reportwd/1").send({
      balance: 1000,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "transaction on progress");
  });
  it("POST /request balance widthdraw", async () => {
    const response = await request(app).post("/reportwd/2").send({
      balance: 1000000,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "balance not enough");
  });

  it("GET Report/Request balance", () => {
    return request(app)
      .get("/reportwd")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id", 3);
        expect(response.body[0]).toHaveProperty("UserId", 1);
        expect(response.body[0]).toHaveProperty("initialBalance", 20000);
        expect(response.body[0]).toHaveProperty("transaction", 1000);
        expect(response.body[0]).toHaveProperty("status", "pending");
      });
  });

  it("PATCH approved", () => {
    return request(app)
      .patch("/approve/2")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
          "message",
          "Withdrawal request approved successfully"
        );
      });
  });
  it("PATCH approved balance not enough", () => {
    return request(app)
      .patch("/approve/1")
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "balance not enough");
      });
  });
  it("PATCH rejected", () => {
    return request(app)
      .patch("/reportwd/1")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
          "message",
          "success reject withdraw"
        );
      });
  });
});

describe("Post Midtranst", () => {
  // beforeAll(async () => {
  //   await User.create({
  //     username: "udin",
  //     email: "udin@mail.com",
  //     phone: "0812907319123",
  //     fullName: "udin test",
  //     password: hashPass("12345"),
  //     city_id: 1,
  //     address: "jalan buntu",
  //     imageProfile: "test image",
  //     balance:50000
  //   });
  // });
  beforeEach(() => {
		jest.restoreAllMocks();
	});
  // afterAll(async () => {
	// 	await User.deleteAll();
	// });
  it("POST success", (done) => {
     jest.spyOn(Midtranst, "createToken").mockResolvedValue("weroernefw"); // you can pass your value as arg
    //  console.log(midTransaction,"TESTTT");
      request(app)
      .post("/payment/1")
      .send({
           balance: 50000,
      })
      .then((response) => {
        expect(response.status).toBe(200);
       expect(response.body).toBe("weroernefw");
       done();
       
      })
      .catch((err) => {
        console.log(err,"ini di test");
				done(err);
			});

  });

  it("POST FAIL", (done) => {
    //  jest.spyOn(Midtranst, "createToken").mockResolvedValue("weroernefw"); // you can pass your value as arg
    //  console.log(midTransaction,"TESTTT");
      request(app)
      .post("/payment/10000")
      .send({
           balance: 50000,
      })
      .then((response) => {
        expect(response.status).toBe(404);
       expect(response.body).toHaveProperty('message',"User Not Found!");
       done();
       
      })
      .catch((err) => {
        // console.log(err,"ini di test");
				done(err);
			});

  });

  });

