import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully via Prisma!");

    app.listen(
      PORT,
      console.log(`Server is running on : http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Cannot start server: ", error);
    await prisma.$disconnect();
    process.exit(1);
  }

  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("Server is disconnected!");
    process.exit(0);
  });
}

startServer();
