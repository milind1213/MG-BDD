class ApiUtils {
    constructor(baseURL, headers = {}) {
      this.baseURL = baseURL;
      this.headers = headers;
    }
  
    async request(method, endpoint, body = null) {
      const options = {
        method,
        headers: this.headers,
      };
  
      if (body) {
        options.body = JSON.stringify(body);
      }
  
     const response = await fetch(`${this.baseURL}${endpoint}`, options);
        if (!response.ok) 
     {
            console.error(`Error: ${response.status} - ${response.statusText} for ${endpoint}`);
    }
  
      return response;
    }
  
    async get(endpoint) {
      return this.request('GET', endpoint);
    }
  
    async post(endpoint, body) {
      return this.request('POST', endpoint, body);
    }
  
    async patch(endpoint, body) {
      return this.request('PATCH', endpoint, body);
    }
  
    async delete(endpoint) {
      return this.request('DELETE', endpoint);
    }
  }
  
  module.exports = ApiUtils;