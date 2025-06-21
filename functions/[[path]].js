import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

const handleRequest = createPagesFunctionHandler({
  build: () => import("../build/index.js"),
  getLoadContext: (context) => ({
    cloudflare: {
      env: context.env,
      cf: context.request.cf,
      ctx: context.waitUntil.bind(context),
    },
  }),
});

export const onRequest = handleRequest;