// K6-TestCases.js

import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const response = http.get('https://test.k6.io');
  check(response, {
    'is status 200': (r) => r.status === 200,
  });
}
