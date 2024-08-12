# A simple video streaming server

[From this vid.](https://youtu.be/ZjBLbXUuyWg?si=y62bCShdEdqoKWPz)

- learned about ranges in request header
- 0-based byte positions
- content range vs chunk size - chunk size is determined by the high water mark, the content range describes the range of bytes sent for a particular request. Pros and cons to a small vs. large content range size:
  - small PROS: quick to load, less wasted bandwidth for partial views, better for low bandwidth situations. CONS: more server load from frequent requests, potential for higher overall latency
  - large PROS: fewer requests, potentially lower latency, more efficient for high bandwidth. CONS: longer load time, more wasted bandwidth for partial views, less responsive
- used VS code port forwarding to serve the app publicly, made a special case for mobile requests
