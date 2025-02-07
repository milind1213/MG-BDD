import http from "k6/http";

export default function() {
      http.get("https://google.com/");
}

// --http-debug="full" logs the HTTP requests and responses, including the full body.
// --http-debug logs without body.

// k6 run --http-debug="full" tests/performance/debug-execution.js