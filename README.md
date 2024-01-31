# CordX Proxy
CordX Proxy is a robust HTTP proxy server designed specifically for Discord's API. Built on Fastify, a high-performance web framework for Node.js, CordX Proxy offers advanced features such as rate limiting and system pressure monitoring to ensure optimal performance and reliability. 

---

## Features
- **Helmet**: A middleware that enhances application security by setting various HTTP headers. These headers can help mitigate common attack vectors such as Cross-Site Scripting (XSS), clickjacking, and other code injection attacks. By default, Helmet enables a set of secure headers, but it can be configured to suit the specific needs of your application.

- **Rate Limiting**: CordX Proxy implements a rate limiting strategy to control the number of requests a client can make within a certain time frame. This not only prevents potential abuse but also ensures the application stays within Discord's API rate limits, reducing the risk of being temporarily blocked due to excessive requests.

- **Under Pressure Monitoring**: CordX Proxy uses the 'under-pressure' plugin to continuously monitor and measure the performance of the Node.js process. It tracks event loop delay, memory consumption, and CPU utilization, providing valuable insights into system performance and helping maintain application responsiveness.

- **HTTP Proxy**: Acts as an intermediary for requests from clients seeking resources from Discord's API. It handles each client's request by forwarding it to the API, then returns the response from the API back to the client. This allows the proxy to manage rate limits, log requests, and add additional security measures.

CordX Proxy is designed to be easy to set up and use, making it an ideal choice for developers looking to interact with Discord's API in a controlled and efficient manner.

---

## Environment Variables
Before you start, you need to configure certain environment variables that the application depends on:

- `API_KEYS`: This should be a comma-separated list of API keys. These keys are used to authenticate clients that are allowed to use the proxy. Each client should send their API key in the `proxy-authorization` header of their requests.

- `PORT`: This is the port number that the proxy server will listen on. If you don't specify a port, the server will default to `10501`.

To set these environment variables, you'll need to create a `.env` file in the root directory of the project. We've provided a template file named `.env.template` to help you get started. Simply rename this file to `.env` and replace the placeholder values with your actual values. The `.env` file is included in the `.gitignore` file by default, so your sensitive data won't be included in your Git repository.

---

## Installation
Follow these steps to install and run the proxy server:

1. **Clone the repository:**

   Use the following command to clone the repository to your local machine:
   
   ```bash
    git clone https://github.com/CordXApp/Proxy.git
   ```

2. **Navigate to the project directory:**

   Change your current directory to the Proxy directory:

   ```bash
   cd Proxy
   ```

3. **Install the dependencies:**

   Use yarn to install the project dependencies (node may cause unexpected behavior):
   
   ```bash
   yarn install
   ``` 

4. **Configure the environment variables:**

   Rename the `.env.template` file to `.env` and replace the placeholder values with your actual values (if you do not provide the `PORT` variable or leave it commented out the server will use port `10501`):
   
   ```bash
   mv .env.template .env
   ```

5. **Build the app:**

   Compile the TypeScript code to JavaScript:

   ```bash
   yarn build
   ```

6. **Start the server:**

   Use yarn to start the proxy server:

   ```bash
   yarn start
   ```

- The server will start on the port specified by the PORT environment variable or `10501` if no variable is provided.

## Notice:
- If you do not specify any api keys in your environment variables your proxy will be accessible by the world, meaning anyone can use it
to proxy requests to discord ***this is not recommended for security and abuse purposes**


---

## Usage
To use the proxy, you need to send a request to the proxy server. The server listens on the port specified by the `PORT` environment variable (if not set server default is `10501`), and it forwards requests to the `/api` endpoint to the Discord API.

Here's an example of how to send a request:
```bash
curl -X GET 'http://localhost:10501/api/your-endpoint' -H 'authorization: your-api-key'
```

- Replace `'your-endpoint'` with the Discord API endpoint you want to access, and 'your-api-key' with one of the API keys you've set in your environment variables.

- The proxy server uses the `authorization` header to authenticate requests. This header should contain one of the API keys specified in the API_KEYS environment variable. If the `authorization`` header is missing or contains an invalid API key, the server will respond with a 401 Unauthorized status.

- The server also uses rate limiting to control the number of requests each client can make in a certain time frame. If a client exceeds the rate limit, the server will respond with a 429 Too Many Requests status. The response headers will include information about the rate limit, such as the maximum number of requests allowed (x-ratelimit-limit), the number of requests remaining in the current time window (x-ratelimit-remaining), and the time when the rate limit will reset (x-ratelimit-reset).

---

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

--- 

## License
- [GNU Affero General Public License v3.0](./LICENSE)