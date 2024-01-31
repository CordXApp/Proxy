# CordXProxy
Fastify-based HTTP proxy for Discord's API, with rate limiting and under-pressure features.

---

## Features
- **Rate Limiting**: Limits the number of requests to prevent abuse.
- **Helmet**: Adds various HTTP headers to make the application more secure.
- **Under Pressure**: Monitors the event loop delay, memory consumption, and CPU utilization of the Node.js process.
- **HTTP Proxy**: Proxies HTTP requests to Discord's API.

---

## Environment Variables
Before you start, you need to set the following environment variables:

- `API_KEYS`: A comma-separated list of API keys that are allowed to use the proxy.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/CordXApp/Proxy.git
```

2. Install the dependencies
```bash
yarn install
```

3. Build the app
```bash
yarn build
```

4. Start the server
```bash
yarn start
```

> The server will start on port 10501.

---

## Usage
To use the proxy, send your HTTP requests to `http://localhost:10501/api``. You must include the `proxy-authorization` header
with one of the API keys you specified in the API_KEYS environment variable.

---

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

--- 

## License
- [GNU Affero General Public License v3.0](./README.md)