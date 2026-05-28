import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try{
        console.log("Connecting to the database...")
        await prisma.$connect();
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        })
    } catch(error){
        await prisma.$disconnect();
        console.error("Can not connect to the database: ", error);
        process.exit(1);
    }

    process.on("SIGINT", async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
}

startServer();