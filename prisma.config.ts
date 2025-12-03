// Ce fichier a été généré par Prisma et suppose que vous avez installé les dépendances suivantes :
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Utiliser DIRECT_URL pour les migrations (évite les problèmes de pooler)
    url: process.env.DIRECT_URL || env("DATABASE_URL"),
  },
});
