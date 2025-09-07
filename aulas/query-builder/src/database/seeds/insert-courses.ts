import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex("courses").insert([
    { name: "HTML" },
    { name: "CSS" },
    { name: "JavaScript" },
    { name: "TypeScript" },
    { name: "React" },
    { name: "Next.js" },
    { name: "Node.js" },
    { name: "Express" },
    { name: "NestJS" },
    { name: "Vue.js" },
    { name: "Angular" },
    { name: "Svelte" },
    { name: "Tailwind CSS" },
    { name: "Bootstrap" },
    { name: "SQL" },
    { name: "PostgreSQL" },
    { name: "MongoDB" },
    { name: "Docker" },
    { name: "Git & GitHub" },
    { name: "Python" },
  ]);
}
