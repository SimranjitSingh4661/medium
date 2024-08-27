import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client/edge";
import { HTTPException } from "hono/http-exception";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, decode, verify } from "hono/jwt";
import { logger } from "hono/logger";
import userRouter from "./routes/userRoutes";
import blogRouter from "./routes/blogRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use(logger());
//Allowing dev server
app.use(
  "*",
  cors({
    // origin: "http://localhost:5173",
    origin: ["https://writestuff-pi.vercel.app"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
//Auth for all the blog routes
app.use("/api/v1/blog/*", authMiddleware);

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

app.onError((error: any, c) => {
  // console.error("Global Error:", error);
  // return c.text('Internal Server Error', 500);/
  return c.json({ message: error.message }, error.status || 500);
});

export default app;
