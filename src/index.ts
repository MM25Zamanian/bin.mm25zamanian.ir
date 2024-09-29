import { Hono } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { getAllData } from "systeminformation";
import { etag } from "hono/etag";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(
  cors({
    origin: "*",
  }),
  logger()
);

app.all("/", (c) => {
  return c.text("Hello Bin!");
});

app.all("/status/:code", (c) => {
  const code = Number(c.req.param().code) as StatusCode;

  return c.text("Status " + code, code);
});

app.all("/method/", (c) => {
  return c.text("Method " + c.req.method);
});

app.all("/method/:method", (c) => {
  if (c.req.param().method.toLowerCase() != c.req.method.toLowerCase())
    return c.text("Method Not Allowed", 405);

  return c.text("Method " + c.req.method);
});

app.all("/delay/:delay", async (c) => {
  const delay = Number(c.req.param().delay);

  await new Promise<void>((resolve) => {
    setTimeout(resolve, delay);
  });

  return c.text("Delay " + delay);
});

app.get("/time", (c) => c.text(Date.now().toString()));

app.use("/server-info", etag());
app.get("/server-info", async (c) => {
  return c.json(await getAllData());
});

export default app;
