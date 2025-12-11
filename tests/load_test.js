import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    'http_req_duration': ['p(95)<1000']
  }
};

export default function () {
  const res = http.get('http://localhost:5173/');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response < 1s': (r) => r.timings.duration <= 1000
  });
  sleep(1);
}
