const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
require('dotenv').config({ path: './configDirectory/.env' });
const axios = require('axios');

let token, response,updatedUserData;
let userID ;

Given('The API is initialized with the base URL', async function ()
{
  console.log(`Initializing the Base URL : ${process.env.BASE_URL_3}`);
});

Given('Authentication is performed with a valid access token', async function ()
{
  token = process.env.GOREST_TOKEN;
  console.log(`Authentication Performing with Token: ${token}`);
});

When('A Get Request is made to retrieve the list of users', async function () 
{
   response = await axios.get(`${process.env.BASE_URL_3}/users`, { headers: { Authorization: `Bearer ${token}`}});
   console.log('List of users response:', response.data);
});

Then('The system should respond with a {int} OK status', async function (statusCode) 
{
   console.log(`Checking if the response status is ${statusCode}`);
   expect(response.status).toBe(statusCode);
});

Then('The response should contain a list of users', async function () 
{
   console.log("Verifying if the response contains a list of users");
   expect(response.data).toBeInstanceOf(Array);
});

Given('The user details are:', function (dataTable) 
{
   const userData = dataTable.hashes()[0]; 
   this.userDetails = {
     name: userData.Name,
     gender: userData.Gender, 
     email: generateRandomEmail(), 
     status: userData.Status
   };
     console.log("User details:", this.userDetails);
});

When('A Post request is made to create a new user', async function () 
{
   response = await axios.post(`${process.env.BASE_URL_3}/users`,{
     name:  this.userDetails.name,
     gender: this.userDetails.gender,
     email:  this.userDetails.email,
     status: this.userDetails.status
   }, { headers: { 'Authorization': `Bearer ${process.env.GOREST_TOKEN}` }});
  console.log('User creation response:', response.data);

});

Then('The system should respond with a 201 Created status', function () 
{
  if (response.status !== 201) {
      throw new Error(`Expected 201 but got ${response.status}. Response: ${JSON.stringify(response.data)}`);
  }
});

Then('The response should include the following:', function (dataTable) 
{
    const expectedData = dataTable.hashes();
    const responseBody = response.data;

    expectedData.forEach(row => {
    const expectedName = row.Name.trim().toLowerCase();
    const expectedStatus = row.Status.trim().toLowerCase();

    const actualName = responseBody.name.trim().toLowerCase();
    const actualStatus = responseBody.status.trim().toLowerCase();
     
    if (expectedName !== actualName || expectedStatus !== actualStatus)
     {
         throw new Error(`Expected name: ${row.Name} and status: ${row.Status} but got name: ${responseBody.name} and status: ${responseBody.status}`);
     }
  });
});

  Then('The user ID should be saved for future use', function () 
  {
    userID = response.data.id; 
    if (!userID)
    {
      throw new Error('User ID is not available in the response. Check the creation step.');
    }
     console.log('User ID saved for future use:', userID);

  });

  
   Then('I save the user ID for later', function () 
   {
     console.log('User ID for later use : ', userID);
   });


   Given('The user details for update are', async function (dataTable) 
   {
        updatedUserData = dataTable.hashes();
        console.log(`User Data For Updation :`, updatedUserData);
   });


When('A Patch request is made to update the user with the saved ID', async function () 
{
   let randomEmail = generateRandomEmail();  
   this.generatedEmail = randomEmail;   //Save email for later use
   let updateData = {
     name: updatedUserData[0].Name,
     email: randomEmail,  // Use the random email
     status: updatedUserData[0].Status
  };
  console.log('Sending PATCH request with data:', updateData);

  try {
      response = await axios.patch(`${process.env.BASE_URL_3}/users/${userID}`, updateData, {
      headers: { Authorization: `Bearer ${process.env.GOREST_TOKEN}` }
    });

    console.log('Updated Response:', response.data);
   } catch (error) {
     console.error('Error in PATCH request:', error.response ? error.response.data : error.message);
   }
  });

   Then('The system should respond with {int} OK status', async function (int) {
        expect(response.status).toBe(int);
   });


   Then('The response should include the following details:', async function (dataTable) {
    const expectedData = dataTable.hashes(); // Get the expected values from the scenario table
    const responseBody = response.data;
  
     expectedData.forEach(row => {
      const expectedName = row.Name.trim().toLowerCase();
      const expectedStatus = row.Status.trim().toLowerCase();
  
      const actualName = responseBody.name.trim().toLowerCase();
      const actualEmail = responseBody.email.trim().toLowerCase();
      const actualStatus = responseBody.status.trim().toLowerCase();
  
      if (expectedName !== actualName || expectedStatus !== actualStatus) {
        throw new Error(`Expected name: ${row.Name}, and status: ${row.Status} but got name: ${responseBody.name}, and status: ${responseBody.status}`);
      }
  
      if (this.generatedEmail.toLowerCase() !== actualEmail)  
      {
         throw new Error(`Expected email: ${this.generatedEmail} but got ${actualEmail}`);
      }
     });
  });
  

   Then('The user ID should remain the same', async function () 
   {
      if (response.data.id !== userID) {
           throw new Error(`User ID has changed. Expected ${userID}, but got ${response.data.id}`);
      }
   });


   Then('The updated user details should be reflected', async function () 
   {
    const responseBody = response.data;

     if (this.generatedEmail.toLowerCase() !== responseBody.email.toLowerCase()) {
       throw new Error(`Expected email to be ${this.generatedEmail}, but got ${responseBody.email}`);
     }
  
     if (updatedUserData[0].Name.toLowerCase() !== responseBody.name.toLowerCase()) {
       throw new Error(`Expected name: ${updatedUserData[0].Name}, but got ${responseBody.name}`);
     }
  
     if (updatedUserData[0].Status.toLowerCase() !== responseBody.status.toLowerCase()) {
       throw new Error(`Expected status: ${updatedUserData[0].Status}, but got ${responseBody.status}`);
     }
  });
  

  When('A Delete request is made to delete the user with the saved ID', async function () 
  {
    try {
      response = await axios.delete(`${process.env.BASE_URL_3}/users/${userID}`,{
        headers: { Authorization: `Bearer ${process.env.GOREST_TOKEN}` }
      });

      console.log('Delete Response:', response.status); // Expected to be 204 No Content

    } catch (error) {
      console.error('Error in DELETE request:', error.response ? error.response.data : error.message);
    }
  });

  Then('The system should respond with a {int} No Content status', async function (statusCode) 
  {
    if (response.status !== statusCode) {
      throw new Error(`Expected ${statusCode} but got ${response.status}.`);
    }
    console.log(`System responded with status ${statusCode}`);
  });

  Then('The user should no longer exist in the system', async function () 
  {
    const response = await axios.get(`${process.env.BASE_URL_3}/users/${userID}`, {
      headers: { Authorization: `Bearer ${process.env.GOREST_TOKEN}` }
    }).catch(error => error.response);
  
    if (response && response.status === 404) {
      console.log('User successfully deleted: 404 Not Found');
    } else {
      throw new Error('User still exists or there was an unexpected error');
    }
  });
  

  // Function for Genrate Random Email
function generateRandomEmail() 
{
  const randomString = Math.random().toString(10).substring(2, 5);
  return `user${randomString}@example.com`;
}



