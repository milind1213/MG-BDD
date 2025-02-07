import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';

export const options = {
    vus: 1,
    duration: '30s',
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

