const { Given, When, Then } = require("@cucumber/cucumber");
const qs = require("qs");
const { expect } = require("@playwright/test");
const AxioUtils = require('../../common-platform-utils/commonREST-utils.js');
const config = require('../../common-platform-utils/common-constants.js');

let token, response, updatedUserData, userID;
const utils = new AxioUtils(config.BASE_URL_3);

Given("The API is initialized with the base URL", async function () {
   console.log(`Initializing the Base URL: ${config.BASE_URL_3}`);
});

Given("Authentication is performed with a valid access token",async function () {
    token = config.GOREST_TOKEN;
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

Given("Authenticating is with a Invalid access token",async function () {
     const wrongtoken = "b2fbe010fb4b65888da6514dc07c1579232f1c1a9";
     utils.setHeaders({ Authorization: `Bearer ${wrongtoken}` });
     console.log(`Authentication performed with Token: ${wrongtoken}`);
 });

 When("A Post Request is made to to Create an new user with Invalid token", async function () {
     try {
      response = await utils.POST("/users", this.userDetails);
      console.log("User creation response:", response.message);
     } catch (error){
      response = error.response   
      console.log("Error response data:", error.response.data);
     }
 });

 Then("The system should respond with a {int} Unauthorized status", function (statusCode) {
     expect(response.status).toBe(statusCode);
 });

 Then("The response should include an error message indicating {string} with invalid token", function (errorMessage) {
     expect(response.data.message).toBe(errorMessage);
});

Given("Authenticating is with a empty access token",async function () {
     const emptytoken = "";
     utils.setHeaders({ Authorization: `Bearer ${emptytoken}` });
     console.log(`Authentication performed with Token: ${token}`);
});

When("A Post Request is made to to Create an new user with empty token", async function () {
     try {
      response = await utils.POST("/users", this.userDetails);
      console.log("User creation response:", response.message);
     } catch (error){
      response = error.response   
      console.log("Error response data:", error.response.data);
     }
});

 Then("The response should include an error message indicating {string} with empty token", function (errorMessage) {
     expect(response.data.message).toBe(errorMessage);
});


When('A GET request is made to an invalid endpoint {string}', async function (invalidEndpoint) {
     utils.setHeaders({ Authorization: `Bearer ${config.GOREST_TOKEN}` });
     try {
         response = await utils.GET(invalidEndpoint);
     } catch(error){
         response = error.response;
     }
});

Then("The system should respond with a {int} Not Found status with invalid endpoint", async function (statusCode) {
     utils.checkStatusCode(response, statusCode);
 });

Then("The response should include an error message indicating {string}", async function (expectedMessage) {
     const contentType = response?.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            const responseBody = response?.data;
            expect(responseBody).toHaveProperty('error', 'Resource not found'); // Adjust as per the API schema
        } else if (contentType.includes('text/html')) {
            const responseBody = response?.data;
            expect(responseBody).toContain('<title>Page Not Found');
        } else {
            throw new Error('Unexpected response format');
     }
});
    
When("A PATCH request is made to update the user with ID {string}", async function (invalidUserId) {
     const randomEmail = generateRandomEmail();
     this.generatedEmail = randomEmail; // Save email for later use
     const updateData = {
       name: updatedUserData[0].Name,
       email: randomEmail,
       status: updatedUserData[0].Status,
     };

     try {
         response = await utils.PATCH(`/users/${invalidUserId}`,updateData);
     } catch (error) {
         response = error.response;
     }
     console.log("Update user response:", response?.status, response?.data);
 });


 Then("The system should respond with a {int} Not Found status with invalid id", async function (statusCode) {
     utils.checkStatusCode(response, statusCode);
 });


 Then("The user update api response should include an error message indicating {string}", function (expectedErrorMessage) {
     console.log(response.data.message);
     expect(response.data.message).toContain(expectedErrorMessage);
 });


 When("A DELETE request is made to delete the user with ID {string}",async function (invalidId) {
     try{
      response = await utils.DELETE(`/users/${invalidId}`);
     } catch (error){
      response = error.response;
     }
      console.log("Delete Response:", response.data);
    }
 );


 Then("The system should respond with a {int} Not Found status with empty id", async function (statusCode) {
     utils.checkStatusCode(response, statusCode);
 });

 Then("The delete api response should include an error message", function () {
     if (response) {
         console.log("Error Status:", response.status);
         console.log("Error Data:", response.data);
         if (response.status === 404) {
             console.log("Received expected 404 Not Found status.");
             console.log("Error Message:", response.data.message || "Resource not found.");
         } else {
             console.warn("Unexpected status code:", response.status);
         }
     } else {
         console.warn("No response received.");
     }
      expect(response.status).toBe(404); 
});


 Given("The details for create user:", function (dataTable) {
     const userData = dataTable.hashes()[0];
     this.InvalidUserDetails = {
        name: userData.Name,
        gender: userData.Gender,
        email: userData.Email,
        status: userData.Status,
      };
     console.log("User details:", this.InvalidUserDetails);
 });


 When("A POST request is made to create a new user with Invalid email format", async function () {
     try {
          response = await utils.POST("/users", this.InvalidUserDetails);
      } catch (error) {
          response = error.response; 
          console.error("Error response status:", response?.status);
          console.error("Error response data:", response?.data);
      }
 });

 Then("The system should respond with a {int} Unprocessable Entity status", function (statusCode) {
     expect(response.status).toBe(statusCode); 
 });

 Then("The response should include an error message for the invalid email format", function () {
     expect(response.data).toBeInstanceOf(Array);
     const emailError = response.data.find(err => err.field === "email");
     expect(emailError).not.toBeUndefined();
     expect(emailError.message).toContain("is invalid");
 });

