import "dotenv/config";
import { RatelimitOptions } from "./configs/rl.config";
import { ProxyFunctions } from "./utils/proxy.functions";
import { UnderPressureOptions } from "./configs/up.config";
import fastifyUnderpressure from "@fastify/under-pressure";
import fastifyRatelimit from "@fastify/rate-limit";
import fastifyCompress from "@fastify/compress";
import fastifyProxy from "@fastify/http-proxy";
import fastifyHelmet from "@fastify/helmet";
import fastify from "fastify";

const PROJECT_PATH = "https://discord.gg/r78bkXWKYS";

(async () => {

  const app = fastify();

  const pkg = await ProxyFunctions.loadPackage().catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });

  app.register(fastifyCompress);
  app.register(fastifyHelmet, { global: true });
  app.register(fastifyUnderpressure, UnderPressureOptions);
  app.register(fastifyRatelimit, RatelimitOptions);
  app.register(fastifyProxy, {
    upstream: "https://discord.com",
    prefix: "/api",
    rewritePrefix: "/api",
    preHandler: ProxyFunctions.preHandler(new Set(process.env.API_KEYS?.split(','))),
    replyOptions: {
      rewriteRequestHeaders: ProxyFunctions.rewriteRequestHeaders(pkg),
    },
  });

  app.setNotFoundHandler((_, reply) => {
    reply.redirect(PROJECT_PATH);
  });

  app.setErrorHandler((err, req, reply) => {

    console.error(err.stack)

    if (err.statusCode === 429) {
      reply.status(429).send({
        statusCode: 429,
        error: "Too Many Requests",
        message: "You have exceeded your request limit.",
      });
    }

    reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: err.message
    });

    console.error(err);

    return;
  })

  app
    .listen({ host: "0.0.0.0", port: parseInt(process.env.PORT || "10501") })
    .then((host) => {
      console.log(`Listening on ${host}`);
    })
    .catch((err) => {
      console.error(`Failed to start server: ${err}`);
    });
})();