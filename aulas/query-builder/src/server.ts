import express, { Request, response, Response } from "express";
import z from "zod";
import { knex } from "./database/knex";

const app = express();
app.use(express.json());

app.post("/courses", async (req: Request, res: Response) => {
  const schemaBody = z.object({
    name: z.string({ error: "Name is required" }),
  });

  const { name } = schemaBody.parse(req.body);

  await knex("courses").insert({ name });
  // await knex.raw("INSERT INTO courses (name) VALUES (?)", [name]);

  return res.status(201).json();
});

app.get("/courses", async (req: Request, res: Response) => {
  const courses = await knex("courses")
    .select("*")
    .orderBy("created_at", "desc");

  return res.json(courses);
});

app.put("/courses/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  await knex("courses")
    .update({ name })
    .where({ id: Number(id) });

  return res.status(204).send();
});

app.delete("/courses/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  await knex("courses").delete().where({ id });

  return res.json();
});

app.post("/modules", async (req: Request, res: Response) => {
  const { name, course_id } = req.body;

  await knex("course_modules").insert({ name, course_id });
  return res.status(201).json();
});

app.get("/modules", async (req: Request, res: Response) => {
  const modules = await knex("course_modules").select("*");
  return res.json(modules);
});

app.get("/courses/:id/modules", async (req: Request, res: Response) => {
  const { id } = req.params;
  const courses = await knex("courses")
    .select(
      "course_modules.id",
      "course_modules.name AS module",
      "courses.name AS course"
    )
    .join("course_modules", "courses.id", "course_modules.course_id");

  return res.json(courses);
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
