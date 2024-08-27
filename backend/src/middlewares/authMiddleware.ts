import { HTTPException } from "hono/http-exception";
import { sign, decode, verify } from "hono/jwt";

//Authontication middleware
export const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  // console.log("AUTH", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }
  const token = authHeader.substring(7);
  try {
    const decodedPayload = await verify(token, c.env.JWT_SECRET);
    c.set("jwtPayload", { userId: decodedPayload.id });
    await next();
  } catch (error) {
    console.error("Authentication Error:", error);
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }
};
