import { PrismaClient } from "@prisma/client";
import RepositoryClientView from "./RepositoryClientView";

const prisma = new PrismaClient();

export default async function RepositoryPage() {
  const projects = await prisma.project.findMany({
    include: {
      modules: {
        include: {
          testCases: true
        }
      }
    }
  });

  return <RepositoryClientView projects={projects} />;
}
