import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 },   // Ramp-up to 10 VUs over 30 seconds
    { duration: '1m', target: 1000 },   // Ramp-up to 100 VUs over 1 minute
    { duration: '2m', target: 3000 },   // Ramp-up to 500 VUs over 2 minutes 
],
}

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
}