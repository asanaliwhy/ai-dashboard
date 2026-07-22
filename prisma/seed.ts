import { PrismaClient, Role, Theme } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("12345678", 10)

  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "johnDoe@gmail.com",
      password: hashedPassword,
      image: null,

      setting: {
        create: {
            theme: Theme.SYSTEM,
            defaultModel: "llama-3.3",
        },
      },
     
      workspaces: {
        create: {
            name: "My workspace",
            description: "Main personal workspace",
            color: "#3b82f6",
        },
      },
    },
    include: {
        workspaces: true,
    }
  });

  const workspace = user.workspaces[0];

  const chat = await prisma.chat.create({
    data: {
      title: "Welcome Chat",
      aiModel: "llama-3.3",
      userId: user.id,
      workspaceId: workspace.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        role: Role.USER,
        content: "Hello!",
        chatId: chat.id,
      },
      {
        role: Role.ASSISTANT,
        content: "Hello! How can I help you today?",
        chatId: chat.id,
      },
      {
        role: Role.USER,
        content: "Tell me about this project.",
        chatId: chat.id,
      },
      {
        role: Role.ASSISTANT,
        content: "This is your AI Workspace starter project.",
        chatId: chat.id,
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
.catch((error)=>{
    console.error(error);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})