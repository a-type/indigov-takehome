import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { loadConstituentsFromFile } from "~/models/constituent.server";

const prisma = new PrismaClient();

const seedFileLocation = resolve(__dirname, "../existing_constituent_data.csv");

async function seed() {
  const csvFileContent = await readFile(seedFileLocation, "utf-8");
  // reusing same insertion logic as the app will use, which includes
  // validation.
  await loadConstituentsFromFile(csvFileContent);
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
