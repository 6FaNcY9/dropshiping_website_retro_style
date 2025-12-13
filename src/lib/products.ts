import { Prisma } from "@prisma/client";
import { resolvePrisma } from "./db";

export type ProductLike = {
  id: string;
  name: string;
  description: string;
  price: number | Prisma.Decimal;
  imageUrl?: string | null;
  imageKey?: string | null;
  createdAt?: Date;
};

export const demoProducts: ProductLike[] = [
  {
    id: "demo-polaroid",
    name: "Polaroid Sun 600 Revival",
    description:
      "Rebuilt instant camera with new color filters and eco film packs.",
    price: 129,
    imageUrl:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "demo-cassette-speaker",
    name: "Cassette Bluetooth Speaker",
    description:
      "Retro tape design hiding a modern 360° Bluetooth 5.2 speaker.",
    price: 89,
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "demo-neon-clock",
    name: "Neon Desk Clock",
    description:
      "Warm glow clock with silent sweep movement and dimmable light.",
    price: 59,
    imageUrl:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80",
  },
];

export async function listProducts() {
  const prismaResult = resolvePrisma();
  if (!prismaResult.ok) {
    return {
      products: [] as ProductLike[],
      missingEnv: prismaResult.missing,
      source: "missing" as const,
    };
  }

  const products = await prismaResult.prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (!products.length) {
    return {
      products: demoProducts,
      missingEnv: [] as string[],
      source: "demo" as const,
    };
  }

  return { products, missingEnv: [] as string[], source: "db" as const };
}

export async function getProductById(id: string) {
  const prismaResult = resolvePrisma();
  if (!prismaResult.ok) {
    return {
      product: null,
      missingEnv: prismaResult.missing,
      source: "missing" as const,
    };
  }

  const product = await prismaResult.prisma.product.findUnique({
    where: { id },
  });
  if (product) {
    return { product, missingEnv: [] as string[], source: "db" as const };
  }

  const productCount = await prismaResult.prisma.product.count();
  if (productCount === 0) {
    const fallback = demoProducts.find((item) => item.id === id) ?? null;
    return {
      product: fallback,
      missingEnv: [] as string[],
      source: "demo" as const,
    };
  }

  return { product: null, missingEnv: [] as string[], source: "db" as const };
}
