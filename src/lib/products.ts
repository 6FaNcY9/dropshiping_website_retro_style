import { resolvePrisma } from "./db";

export async function listProducts() {
  const prismaResult = resolvePrisma();
  if (!prismaResult.ok) {
    return { products: [], missingEnv: prismaResult.missing } as const;
  }

  const products = await prismaResult.prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { products, missingEnv: [] as string[] } as const;
}

export async function getProductById(id: string) {
  const prismaResult = resolvePrisma();
  if (!prismaResult.ok) {
    return { product: null, missingEnv: prismaResult.missing } as const;
  }

  const product = await prismaResult.prisma.product.findUnique({ where: { id } });
  return { product, missingEnv: [] as string[] } as const;
}
