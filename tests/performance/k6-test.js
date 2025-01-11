
import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const response = http.get('https://test.k6.io');
  check(response, {
    'is status 200': (r) => r.status === 200,
  });
}
//To Run -  k6 run tests/performance/k6-test.js