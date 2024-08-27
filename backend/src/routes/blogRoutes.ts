import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { HTTPException } from "hono/http-exception";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
  createblogInput,
  updateblogInput,
} from "@simran4661/medium-types-common";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const END_POINTS = {
  POST_BLOG: "/",
  UPDATE_BLOG: "/",
  GET_BLOG: "/:id",
  ALL_BLOG: "/bulk",
};

// region Blog-create
blogRouter.post(END_POINTS.POST_BLOG, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const { title, content } = await c.req.json();

    const { success } = createblogInput.safeParse({ title, content });

    if (!success) {
      throw new HTTPException(400, {
        message: "Missing required fields",
      });
    }

    const jwtPayload = c.get("jwtPayload");

    if (!jwtPayload.userId) {
      throw new HTTPException(401, {
        message: "Unauthenticated",
      });
    }

    const res = await prisma.post.create({
      data: {
        title,
        content,
        authorId: jwtPayload.userId,
      },
    });

    return c.json({
      id: res.id,
      message: "blog created successfully",
    });
  } catch (error: any) {
    return c.json({ message: error.message }, error.status || 500);
  }
});

// region Blog-update
blogRouter.put(END_POINTS.UPDATE_BLOG, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const { title, content, blogId, published } = await c.req.json();
    const jwtPayload = c.get("jwtPayload");

    console.log("Log", title, content, blogId, published);

    const { success } = updateblogInput.safeParse({
      title,
      content,
      blogId,
      published,
    });

    if (!success) {
      throw new HTTPException(400, {
        message: "Missing required fields",
      });
    }

    if (!title || !content || !blogId) {
      throw new HTTPException(400, {
        message: "Missing required fields: title, name, or password",
      });
    }
    if (published !== true && published !== false) {
      throw new HTTPException(400, {
        message: "Published must be true or false",
      });
    }

    const isBlogExist = await prisma.post.findFirst({
      where: {
        id: blogId,
      },
    });
    if (!isBlogExist) {
      throw new HTTPException(400, {
        message: "Please check you enter data",
      });
    }

    const res = await prisma.post.update({
      where: {
        id: blogId,
      },
      data: {
        title,
        content,
        published,
      },
    });

    return c.json({
      message: "blog updated successfully",
    });
  } catch (error: any) {
    console.log("Error", error);
    return c.json({ message: error.message }, error.status || 500);
  }
});

// region Blog Bulk
blogRouter.get(END_POINTS.ALL_BLOG, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const { userId } = c.get("jwtPayload");
    const page = parseInt(c.req.query("page") || "1", 10);
    const pageSize = parseInt(c.req.query("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    if (page < 0) {
      throw new HTTPException(406, {
        message: "Invalid page count",
      });
    }

    const allBlogs = await prisma.post.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const totalBlog = await prisma.post.count({});

    const totalPages = Math.ceil(totalBlog / pageSize);

    return c.json({
      allBlogs,
      pageSize,
      totalBlog,
      totalPages,
      currentPage: page,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    });
  } catch (error: any) {
    // console.log('Error', error)
    return c.json({ message: error.message }, error.status || 500);
  }
});

// region Blog-get
blogRouter.get(END_POINTS.GET_BLOG, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blogId = c.req.param("id");
    const blog = await prisma.post.findFirst({
      where: {
        id: blogId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: true,
      },
    });

    if (!blog?.id) {
      throw new HTTPException(404, {
        message: "Blog not found",
      });
    }

    return c.json({
      ...blog,
    });
  } catch (error: any) {
    return c.json({ message: error.message }, error.status || 500);
  }
});

export default blogRouter;
