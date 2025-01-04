const { Given, When, Then } = require("@cucumber/cucumber");
const qs = require("qs");
const { expect } = require("@playwright/test");
require("dotenv").config({ path: "./configDirectory/.env" });
const AxioUtils = require("../commonPlatformUtils/CommonREST");

let token, response, updatedUserData, userID;
const utils = new AxioUtils(process.env.BASE_URL_3);

Given("The API is initialized with the base URL", async function () {
   console.log(`Initializing the Base URL: ${process.env.BASE_URL_3}`);
});

Given("Authentication is performed with a valid access token",async function () {
    token = process.env.GOREST_TOKEN;
    utils.setHeaders({ Authorization: `Bearer ${token}` });
    console.log(`Authentication performed with Token: ${token}`);
});

When("A Get Request is made to retrieve the list of users", async function () {
    response = await utils.GET("/users");
    console.log("List of users response:", response.data);
});

Then("The system should respond with a {int} OK status",async function (statusCode) {
     console.log(`Checking if the response status is ${statusCode}`);
     utils.checkStatusCode(response, statusCode);
});

Then("The response should contain a list of users", async function () {
     console.log("Verifying if the response contains a list of users");
     expect(Array.isArray(response.data)).toBe(true);
});

Given("The user details are:", function (dataTable) {
    const userData = dataTable.hashes()[0];
    this.userDetails = {
       name: userData.Name,
       gender: userData.Gender,
       email: generateRandomEmail(),
       status: userData.Status,
     };
    console.log("User details:", this.userDetails);
});

When("A Post request is made to create a new user", async function () {
     response = await utils.POST("/users", this.userDetails);
     console.log("User creation response:", response.data);
});


Then("The system should respond with a 201 Created status", function () {
     utils.checkStatusCode(response, 201);
});

Then("The response should include the following:", function (dataTable) {
      const expectedData = dataTable.hashes();
      const responseBody = response.data;

      expectedData.forEach((row) => {
      expect(row.Name.trim().toLowerCase()).toBe(responseBody.name.trim().toLowerCase());
      expect(row.Status.trim().toLowerCase()).toBe(responseBody.status.trim().toLowerCase()); });
});

Then("The user ID should be saved for future use", function () {
      userID = response.data.id;
      if (!userID) {
         throw new Error("User ID is not available in the response. Check the creation step.");
      }
    console.log("User ID saved for future use:", userID);
});

Then("I save the user ID for later", function () {
      console.log("User ID for later use:", userID);
});

Given("The user details for update are", async function (dataTable) {
     updatedUserData = dataTable.hashes();
     console.log("User Data For Updation:", updatedUserData);
});

When("A Patch request is made to update the user with the saved ID",async function () {
      const randomEmail = generateRandomEmail();
      this.generatedEmail = randomEmail; // Save email for later use
      const updateData = {
        name: updatedUserData[0].Name,
        email: randomEmail,
        status: updatedUserData[0].Status,
      };
    
      console.log("Sending PATCH request with data:", updateData);
      
      response = await utils.PATCH(`/users/${userID}`, updateData);
      console.log("Updated Response:", response.data);
  });

Then("The system should respond with {int} OK status", async function (statusCode) {
       utils.checkStatusCode(response, statusCode);
});  

Then("The response should include the following details:",async function (dataTable) {
     const expectedData = dataTable.hashes();
     const responseBody = response.data;

     expectedData.forEach((row) => {
      const expectedName = row.Name.trim().toLowerCase();
      const expectedStatus = row.Status.trim().toLowerCase();

      const actualName = responseBody.name.trim().toLowerCase();
      const actualEmail = responseBody.email.trim().toLowerCase();
      const actualStatus = responseBody.status.trim().toLowerCase();

      expect(expectedName).toBe(actualName);
      expect(expectedStatus).toBe(actualStatus);
      expect(this.generatedEmail.toLowerCase()).toBe(actualEmail);});
});


Then("The user ID should remain the same", async function () {
      expect(response.data.id).toBe(userID);
});

Then("The updated user details should be reflected", async function () {
     const responseBody = response.data;
     expect(this.generatedEmail.toLowerCase()).toBe(responseBody.email.toLowerCase());
     expect(updatedUserData[0].Name.toLowerCase()).toBe(responseBody.name.toLowerCase());
     expect(updatedUserData[0].Status.toLowerCase()).toBe(responseBody.status.toLowerCase());
});

When("A Delete request is made to delete the user with the saved ID",async function () {
     response = await utils.DELETE(`/users/${userID}`);
     console.log("Delete Response:", response.status);
  }
);

Then( "The system should respond with a {int} No Content status", async function (statusCode) {
     utils.checkStatusCode(response, statusCode);
  }
);

Then("The user should no longer exist in the system", async function () {
   const response = await utils.GET(`/users/${userID}`).catch((error) => error.response);
   if (response && response.status === 404) {
       console.log("User successfully deleted: 404 Not Found");
   } else {
       throw new Error("User still exists or there was an unexpected error");
   }
});

// Function to generate random email
function generateRandomEmail() {
  const randomString = Math.random().toString(10).substring(2, 5);
  return `user${randomString}@example.com`;
}
