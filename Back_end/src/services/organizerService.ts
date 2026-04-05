import prisma from "../lib/prisma.js";

export const getOrganizerTransactionsService = async (organizerId: number) => {
  return await prisma.transaction.findMany({
    where: {
      event: {
        organizerId: organizerId,
      },
    },
    include: {
      user: true,
      event: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};