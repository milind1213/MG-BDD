import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    vus: 5,
    duration: '20s'
}


export default function () {

  const credentials = {
      username: 'test_' + randomString(8),
      password: 'secret_' + randomString(8),
  }

  console.log(credentials);
  
  sleep(randomIntBetween(1, 5)); // sleep between 1 and 5 seconds.

  http.post(
      'https://test-api.k6.io/user/register/',
      JSON.stringify(credentials),
      {
          headers: {
              'Content-Type': 'application/json'
          }
      }
  );
}