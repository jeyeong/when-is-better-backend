// Import the dependencies for testing
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server");
let luxon = require('luxon')
let { DateTime } = require('luxon')
let utils = require('./testUtils')
// Configure chai
chai.use(chaiHttp);
chai.should();
describe("whenisbetter", () => {
  describe("whenisbetter", () => {
    // Test to get all students record
    // it("should get all students record", (done) => {
    //   chai
    //     .request(app)
    //     .get("/test-db-insert")
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a("object");
    //       done();
    //     });
    // });


    it("should create a new event", (done) => {
        // console.log(luxon.DateTime.now().toHTTP())
        const start = DateTime.fromObject({year: 2022, month: 4, day: 3, hour: 8})
        const end = DateTime.fromObject({year: 2022, month: 4, day: 7, hour: 21})
        const delta_duration = luxon.Duration.fromObject({minutes: 60})

        const dateTimes = utils.generateDateTimeArray(start, end, delta_duration)
        body = {
            creator: "creator",
            event_name: "event name",
            description: "description",
            available_times: dateTimes,
            time_start: start,
            time_end: end,
            time_interval_min: 30
        }
        console.log(body)
        chai
          .request(app)
          .post('/event')
          .send(body)
          .end((err, res) => {
              console.log("TEST")
              console.log('resp body')
              console.log(res.body)
              res.should.have.status(201)
              done();
          })
    });

    it("should create a new response", (done) => {
        console.log(luxon.DateTime.now().toHTTP())
        const body = {
            event_id: "adfb",
            name: "user",
            comments: "comment",
            selected_times: [luxon.DateTime.now().toHTTP()],
            time_interval_min: 30
        }
        chai
          .request(app)
          .post('/response')
          .send(body)
          .end((err, res) => {
              console.log("TEST")
              res.should.have.status(201)
              done();
          })
    });
    // // Test to get single student record
    // it("should get a single student record", (done) => {
    //      const id = 1;
    //      chai.request(app)
    //          .get(`/${id}`)
    //          .end((err, res) => {
    //              res.should.have.status(200);
    //              res.body.should.be.a('object');
    //              done();
    //           });
    //  });

    // // Test to get single student record
    // it("should not get a single student record", (done) => {
    //      const id = 5;
    //      chai.request(app)
    //          .get(`/${id}`)
    //          .end((err, res) => {
    //              res.should.have.status(404);
    //              done();
    //           });
    //  });
  });
});
