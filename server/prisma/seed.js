import bcrypt from "bcryptjs";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function seed() {
    const password = await bcrypt.hash("admin", 10);
    const goshPass = await bcrypt.hash("12345", 10);

    const adminRoleAndUser = await prisma.role.upsert({ 
        where: { name: "ADMIN" },
        update: {},
        create: { 
            name: "ADMIN", 
            users: { create: {
                name: "Pesho", username: "admin", password
             } },
         }
    });

    const userRoleAndUser =  await prisma.role.upsert({ 
        where: { name: "USER" },
        update: {},
        create: {
            name: "USER",
            users: {
                create: {
                    name: "Gosho", username: "gosho", password: goshPass
                }
            }
        }
    });
}

export default function initiateSeed() {
    seed()
            .catch(e => {
                console.error(e);
                process.exit(1);
            })
            .finally( async () => {
                await prisma.$disconnect();
            });
}
