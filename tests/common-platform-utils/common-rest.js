const axios = require('axios');
const qs = require('qs'); // For Serialize data
const log = require('../../utils/logger');

class AxioUtils {
   constructor(baseURL) {
     this.baseURL = baseURL;
     this.headers = {};
  }

  setHeaders(headers) {
    this.headers = { ...this.headers, ...headers };
  }

  waitFor(seconds) 
  {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
  
  async GET(endpoint)
  {
  try {
      const response = await axios.get(`${this.baseURL}${endpoint}`,{headers: this.headers,});
      return response;

    } catch (error) {
      console.error('GET Request Failed:', error.message);
      log('GET Request Failed:', error.message);
      throw error;
    }
  }

  async POST(endpoint, body) 
  {
     try {
       const response = await axios.post(`${this.baseURL}${endpoint}`,body, {headers: this.headers,});
       return response;
      
    } catch (error) {
      console.error('POST request failed:', error.message);
      log('POST Request Failed:', error.message);
      throw error;
    }
  }

  async PUT(endpoint, body) 
  {
     try {
       const response = await axios.put(`${this.baseURL}${endpoint}`, body, { headers: {...this.headers, },});
      return response;
     } catch (error) {
      console.error('PUT Request failed:', error.message);
      log('PUT Request Failed:', error.message);
      throw error;
     }
  }

  async PATCH(endpoint, body) 
  {
     try {
       const response = await axios.patch(`${this.baseURL}${endpoint}`, body, {headers: {...this.headers, },});
       return response;
     } catch (error) {
       console.error('PATCH request failed:', error.message);
       log('PATCH Request Failed:', error.message);
       throw error;
     }
  }
  
  async DELETE(endpoint) 
  {
     try {
       const response = await axios.delete(`${this.baseURL}${endpoint}`, { headers: {...this.headers,}, });
       return response;
     } catch (error) {
       console.error('DELETE request failed:', error.message);
       log('DELETE Request Failed:', error.message);
       throw error;
     }
  }
  
  async postForm(endpoint,formParams) 
  {
     try {
       const formData = qs.stringify(formParams);
       const response = await axios.post(`${this.baseURL}${endpoint}`,formData,{headers: {...this.headers,'Content-Type': 'application/x-www-form-urlencoded',},});
       return response;
     } catch (error) {
       log('POST Form Request failed:', error.message);
       console.error('POST Form Request failed:', error.message);
       throw error;
     }
  }

  checkStatusCode(response, expectedCode) 
  {
    if (response.status !== expectedCode) 
    {
         log(`Expected status ${expectedCode}, but got ${response.status}`);
         throw new Error(`Status code mismatch: Expected ${expectedCode}, got ${response.status}`);
    }
     log(`Status Code ${response.status} Matches the Expected ${expectedCode}`);
  }

  checkResponseKey(response, key) 
  {
    if (!response.data || !response.data.hasOwnProperty(key)) 
    {
       log(`Response Does Not Contain the Key: ${key}`);
       throw new Error(`Missing Expected Key: ${key}`);
    }
     console.log(`Response Contains the Key: ${key}`);
  }


}

module.exports = AxioUtils;
