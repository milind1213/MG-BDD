import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 5 },   // Ramp-up to 5 VUs over 30 seconds
        { duration: '2m', target: 20 },   // Ramp-up to 20 VUs over 2 minutes (Stress Test)
        { duration: '1m', target: 20 },   // Stay at 20 VUs for 1 minute
        { duration: '30s', target: 0 },   // Ramp-down to 0 VUs over 30 seconds
    ],
};

export default function () {
    let response = http.get('https://test.k6.io');
    check(response, { 'Homepage status is 200': (r) => r.status === 200 });
    sleep(1);

    response = http.get('https://test.k6.io/contact.php');
    check(response, { 'Contact page status is 200': (r) => r.status === 200 });
    sleep(2);

    response = http.get('https://test.k6.io/news.php');
    check(response, { 'News page status is 200': (r) => r.status === 200 });
    sleep(2);
}
