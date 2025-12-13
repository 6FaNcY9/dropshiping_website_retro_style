import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Prisma, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function seedProducts() {
  const productCount = await prisma.product.count();
  if (productCount > 0) return;

  await prisma.product.createMany({
    data: [
      {
        name: "Polaroid Sun 600 Revival",
        description:
          "Rebuilt instant camera with new color filters and eco film packs.",
        price: new Prisma.Decimal(129),
        imageUrl:
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Cassette Bluetooth Speaker",
        description:
          "Retro tape design hiding a modern 360° Bluetooth 5.2 speaker.",
        price: new Prisma.Decimal(89),
        imageUrl:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Neon Desk Clock",
        description:
          "Warm glow clock with silent sweep movement and dimmable light.",
        price: new Prisma.Decimal(59),
        imageUrl:
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80",
      },
    ],
  });
}

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    if (existing.role !== Role.ADMIN) {
      await prisma.user.update({ where: { id: existing.id }, data: { role: Role.ADMIN } });
    }
    return;
  }

  const password = process.env.SEED_ADMIN_PASSWORD ?? crypto.randomBytes(12).toString("hex");
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`Seeded admin user ${email} with generated password: ${password}`);
  } else {
    console.log(`Seeded admin user ${email}`);
  }
}

async function main() {
  await seedProducts();
  await seedAdminUser();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
