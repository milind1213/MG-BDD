
import http from 'k6/http';

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        'http_req_duration{status:200}': ['p(95)<3000'],
        'http_req_duration{status:201}': ['p(95)<3000']
    }
}

export default function () 
{
    http.get('https://run.mocky.io/v3/638f6292-f175-420b-b348-5b6473608fc2');
    http.get('https://run.mocky.io/v3/7de3af05-e477-450d-a2ae-7fa4043c63dd?mocky-delay=2000ms');
}









