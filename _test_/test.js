const app = require("../dist/app");
const supertest = require("supertest");

const request = supertest(app);
describe("testing for verious request", () => {
  it("Test for correct Status code", async () => {
    try {
      const response = request("/graphql")
        .post("/graphql")
        .send({ query: "{allOrg{ceo}}" })
        .expect(200);
    } catch (error) {
      console.log(`error ${error.toString()}`);
    }
  });

  it("gets organization by id", async (done) => {
    request
      .post("/graphql")
      .send({
        query:
          '{ anOrg(id:  "5f72059a3c0660171597e582") { id organization address country } }',
      })
      .set("Accept", "application.json")
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) return done(err);
        let data = res.body.data.anOrg;
        expect(data).toHaveProperty("id");
        expect(data).toHaveProperty("address");
        done();
      });
  });

  
//   it("creates Organization", async (done) => {
//      request
//        .post("/graphql")
//        .send({
//          query: `mutation{
//   createOrg(input: {
//     organization: "adans1",
//     ceo: "mike",
//     country:"cameroon",
//     address: "kogi west",
//     marketValue:"85",
//     products:["spoon","plates"],
//     employees:["chalse","obinna"],
//     password:"00000",
//     email: "adans@gmail.com",
//   }) {
//     organization
//     ceo
//     marketValue
//     country
//     address
    
//   } 
// }`,
//        })
//        .set("Accept", "application.json")
//        .expect("Content-Type", /json/)
//        .end((err, res) => {
//          if (err) return done(err);
//          console.log(res.body);
//          expect(res.body).toBeInstanceOf(Object);
//          console.log(res.body);
//          let value = res.body.data.createOrg;
//          expect(value).toHaveProperty("organization", "adans1");

//          done();
//        });
//    });
  
  
  
  it("Update Organization", async (done) => {
    request
      .post("/graphql")
      .send({
        query: `mutation{
  updateOrg(input: {
    id:"5f72270cba895a1e61cc7c48"
    ceo: "miike4",
    country:"cameroon",
    marketValue:"85",
    products:["spoon","plates"],
    employees:["chalse","obinna"],
  }) {
    
    organization
    ceo
    marketValue
    country
    address
    
  } 
}`,
      })
      .set("Accept", "application.json")
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        let value = res.body.data.updateOrg;
        expect(value).toHaveProperty("organization", "allums1 allumaco");

        done();
      });
  });

  
//    it("delete Organization", async (done) => {
//      request
//        .post("/graphql")
//        .send({
//          query: `mutation{
//   deleteOrg(
//    id: "5f722eee0a97bc20b36a4989"
//   ) {
//     id
//   } 
// }`,
//        })
//        .set("Accept", "application.json")
//        .expect("Content-Type", /json/)
//        .end((err, res) => {
//          if (err) return done(err);
//          expect(res.body).toBeInstanceOf(Object);
//          console.log(res.body.data.i);
//          let value = res.body.data.deleteOrg;
//          expect(value).toHaveProperty("id", "5f722eee0a97bc20b36a4989");

//          done();
//        });
//    });
  
  
  
});
