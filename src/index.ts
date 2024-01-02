import "dotenv/config";
import fastifyUnderpressure from "@fastify/under-pressure";
import fastifyRatelimit from "@fastify/rate-limit";
import fastifyCompress from "@fastify/compress";
import fastifyProxy from "@fastify/http-proxy";
import fastifyHelmet from "@fastify/helmet";
import fs from "node:fs/promises";
import fastify from "fastify";
import path from "node:path";

const LOCAL_IP = ["localhost", "::1", "127.0.0.1", "::ffff:"];
const PROJECT_PATH = "https://discord.gg/r78bkXWKYS";

(async () => {
  const config = JSON.parse(
    await fs.readFile(path.join(__dirname, "../", "config.json"), "utf-8")
  ) as {
    placeIds: string[];
    apiKeys: string[];
  };
  const pkg = JSON.parse(
    await fs.readFile(path.join(__dirname, "../", "package.json"), "utf-8")
  ) as {
    version: string;
  };

  if (config.placeIds.length > 0)
    console.log("Place ID list is not empty! Tracking enabled.");

  const apiKeys = new Set(config.apiKeys);

  const app = fastify();

  app.register(fastifyCompress);
  app.register(fastifyHelmet, { global: true });

  app.register(fastifyUnderpressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 100000000,
    maxRssBytes: 100000000,
    maxEventLoopUtilization: 0.98,
    retryAfter: 50,
    message: "Proxy is under pressure!",
  });

  app.register(fastifyRatelimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  app.register(fastifyProxy, {
    upstream: "https://discord.com",
    prefix: "/api",
    rewritePrefix: "/api",
    preHandler: (request, reply, done) => {
      if (config.apiKeys.length > 0) {
        const headers = request.headers;
        const apiKey = headers["proxy-authorization"];

        if (!apiKey || !apiKeys.has(apiKey as string)) {
          reply
            .code(403)
            .send({ error: "You are not allowed to use this proxy." });
          return done();
        }

        delete headers["proxy-authorization"];
      }

      const ip = request.ip;

      if (LOCAL_IP.includes(ip)) return done();

      return done();
    },
    replyOptions: {
      rewriteRequestHeaders: (_, headers) => {
        headers["user-agent"] = `CordXProxy/${pkg.version} (${PROJECT_PATH})`;
        return headers;
      },
    },
  });

  app.get("/", async (_, reply) => {
    reply.redirect(PROJECT_PATH);
  });

  app
    .listen({ host: "0.0.0.0", port: parseInt("10501") })
    .then((host) => {
      console.log(`Listening on ${host}`);
    });
})();