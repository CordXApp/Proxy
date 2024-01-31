import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { IncomingHttpHeaders } from 'http';

const LOCAL_IP = ["localhost", "::1", "127.0.0.1", "::ffff:"];
const PROJECT_PATH = "https://discord.gg/r78bkXWKYS";

async function loadPackage() {
  const pkg = await import('../../package.json');
  return pkg;
};

function preHandler(apiKeys: Set<string>) {
  return (req: FastifyRequest, res: FastifyReply, done: HookHandlerDoneFunction) => {
    if (apiKeys.size > 0) {
      const headers = req.headers;
      const apiKey = req.headers["authorization"];

      if (!apiKey || !apiKeys.has(apiKey as string)) {
        res.code(403).send({
          status: 'PROXY_AUTHENTICATION_REQUIRED',
          error: 'You must authenticate with the proxy to access this endpoint.',
          code: 403
        });

        return done();
      }

      delete headers["proxy-authorization"];
    }

    const ip = req.ip;

    if (LOCAL_IP.includes(ip)) return done();

    done();
  }
}

function rewriteRequestHeaders(pkg: { version: string }) {
  return (_: any, headers: IncomingHttpHeaders) => {
    headers["user-agent"] = `CordXProxy/${pkg.version} (${PROJECT_PATH})`;
    return headers;
  }
}

const ProxyFunctions = { loadPackage, preHandler, rewriteRequestHeaders };
export { ProxyFunctions }