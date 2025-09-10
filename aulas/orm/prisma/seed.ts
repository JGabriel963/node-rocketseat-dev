import { prisma } from "@/prisma";

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        name: "João Gabriel",
        email: "joaogabriel@gmail.com",
      },
      {
        name: "Demo",
        email: "demo@gmail.com",
      },
    ],
  });
}

seed().then(() => {
  console.log("Database seede");
  prisma.$disconnect();
});
