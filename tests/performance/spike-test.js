import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 100 },   // Ramp-up to 100 VUs over 30 seconds
        { duration: '1m', target: 1000 },  // Spike to 1000 VUs over 60 seconds
        { duration: '5s', target: 0 },   // Ramp-down to 0 VUs over 5 seconds
    ],
};

export default function () {
    let response = http.get('https://test.k6.io');
    check(response, { 'Homepage status is 200': (r) => r.status === 200 });
    sleep(1);

    response = http.get('https://test.k6.io/contacts.php');
    check(response, { 'Contact page status is 200': (r) => r.status === 200 });
    sleep(2);

    response = http.get('https://test.k6.io/news.php');
    check(response, { 'News page status is 200': (r) => r.status === 200 });
    sleep(2);
}
