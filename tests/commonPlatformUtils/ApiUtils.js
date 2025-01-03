const { request } = require('@playwright/test');
const axios = require('axios');
require('dotenv').config({ path: './configDirectory/.env' });
class axioUtils {
   constructor() 
   {
      this.headers = {};
      this.cookies = {};
      this.queryParams = {};
     this.pathParams = {};
   }

  // Create request configuration for Axios
  static requestConfig(baseURL, endpoint, config) 
  {
     const axiosConfig = {
       baseURL: baseURL,
       url: endpoint,
       headers: { ...config.headers },
       params: { ...config.queryParams },
       timeout: 10000,
     };

     if (config.pathParams) 
     {
        axiosConfig.url = endpoint.replace(/{([^}]+)}/g, (_, key) => config.pathParams[key]);
     }
     return axiosConfig;
  }

  // GET request
   static async GET(baseURL, endpoint, config) 
   {
      const axiosConfig = this.requestConfig(baseURL, endpoint, config);
     try {
       const response = await axios.get(axiosConfig.url, axiosConfig);
       return response.data;
    }  catch (error) 
    {
      throw error;
    }
  }

  // POST request
  static async POST(baseURL, endpoint, config, body) 
  {
    const axiosConfig = this.requestConfig(baseURL, endpoint, config);
    try {
      const response = await axios.post(axiosConfig.url, body, axiosConfig);
      return response.data;
   }  catch (error) 
   {
      throw error;
   }
  }

  // PATCH request
  static async PATCH(baseURL, endpoint, config, body) 
  {
     const axiosConfig = this.requestConfig(baseURL, endpoint, config);
   try {
     const response = await axios.patch(axiosConfig.url, body, axiosConfig);
     return response.data;
   } catch (error) 
   {
      throw error;
   }
  }

  // DELETE request
  static async DELETE(baseURL, endpoint, config) 
  {
     const axiosConfig = this.requestConfig(baseURL, endpoint, config);
   try {
     const response = await axios.delete(axiosConfig.url, axiosConfig);
     return response.data;
   } catch (error) {
      throw error;
   }
  }

  setHeaders(headers) 
  {
    this.headers = { ...this.headers, ...headers };
  }

  setQueryParams(params) 
  {
    this.queryParams = { ...this.queryParams, ...params };
  }

  setCookies(cookies) 
  {
    this.cookies = { ...this.cookies, ...cookies };
  }

  setPathParams(params) 
  {
    this.pathParams = { ...this.pathParams, ...params };
  }

   setAuthToken(token) 
  {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

}

module.exports = { axioUtils };
