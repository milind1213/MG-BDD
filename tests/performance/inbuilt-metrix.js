import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import exec from 'k6/execution';

export const options = {
    vus: 10,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<100'],
        http_req_duration: ['max<2000'],
        http_req_failed: ['rate<0.5'],
        http_reqs: ['count>20'],
        http_reqs: ['rate>2'],
        vus: ['value>0'],
        checks: ['rate>=0.96']
    }
}
export default function () {
    const url = 'https://test.k6.io/' + (exec.scenario.iterationInTest === 1 ? 'foo' : '');
        const res = http.get(url);

    console.log(`Iteration: ${exec.scenario.iterationInTest}, Status: ${res.status}`);

    console.log(`Response Body (Snippet): ${res.body.slice(0, 200)}`);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'page is startpage': (r) => r.body.includes('Collection of simple web-pages')
    });
}