import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const res = http.get('https://test.k6.io/');
    console.log(res);
    check(true, {'true is true': (value) => value === true });

    check(res, 
    {
      'status is 200': (r) => r.status === 200,
      'Page is Homepage': (r) => r.body.includes('Collection of simple web-pages')
    });


    check(res, {
      'Content-type is Not text/html': (r) => r.headers['Content-Type'] !== 'text/html',
      'response time is less than 500ms': (r) => r.timings.duration <500,
      'Server is Not nginx': (r) => r.headers['Server'] !== 'nginx',
      'Body is Not Empty': (r) => r.body.length > 0,
  });
}