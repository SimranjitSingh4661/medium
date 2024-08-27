import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { HTTPException } from "hono/http-exception";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, decode, verify } from "hono/jwt";
import { signinInput, signupInput } from "@simran4661/medium-types-common";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

interface SignUpBodyResponse {
  name: string;
  email: string;
  password: string;
}

interface SignInBodyResponse {
  email: string;
  password: string;
}

const ENDPOINTS = {
  SIGN_UP: "/signup",
  SIGN_IN: "/signin",
};

// region SignUp
userRouter.post(ENDPOINTS.SIGN_UP, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { email, name, password } = await c.req.json<SignUpBodyResponse>();
    const { success } = signupInput.safeParse({ email, name, password });

    if (!success) {
      throw new HTTPException(400, {
        message: "Missing required fields",
      });
    }

    if (!email || !name || !password) {
      throw new HTTPException(400, {
        message: "Missing required fields: email, name, or password",
      });
    }
    // Check if user is areay exist in DB
    const isUserExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (isUserExist) {
      throw new HTTPException(409, {
        message: "User already exist",
      });
    }
    const res = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
    const token = await sign(
      { id: res.id, email: res.email, name: res.name },
      c.env.JWT_SECRET
    );
    return c.json({ token: token });
    // return c.json({ message: "User created successfully" });
  } catch (error: any) {
    return c.json({ message: error.message }, error.status || 500);
  }
});

// region SignIn
userRouter.post(ENDPOINTS.SIGN_IN, async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const { email, password } = await c.req.json<SignInBodyResponse>();
    const { success } = signinInput.safeParse({ email, password });

    if (!success) {
      throw new HTTPException(400, {
        message: "Missing required fields",
      });
    }

    if (!email || !password) {
      throw new HTTPException(400, {
        message: "Missing required fields: email or password",
      });
    }
    // if user exist continue
    const isUserExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!isUserExist) {
      throw new HTTPException(421, {
        message: "User not found. Please Signup",
      });
    }

    if (email === isUserExist.email && password === isUserExist.password) {
      const token = await sign(
        { id: isUserExist.id, email, name: isUserExist.name },
        c.env.JWT_SECRET
      );
      return c.json({ token: token });
    } else {
      throw new HTTPException(421, {
        message: "User details invalid. Please try again",
      });
    }
  } catch (error: any) {
    return c.json({ message: error.message }, error.status || 500);
  }
});

export default userRouter;
