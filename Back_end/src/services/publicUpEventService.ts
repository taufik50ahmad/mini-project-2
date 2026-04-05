import prisma from "../lib/prisma.js";

async function publicUpEventService(user: any, isPublic: boolean) {
  const now = new Date();

  // 🎯 ORGANIZER MODE (only if NOT public)
  if (!isPublic && user && user.role === "ORGANIZER") {
    const events = await prisma.event.findMany({
      where: {
        organizer: {
          email: user.email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        price: true,
        availableSeats: true,
        totalSeats: true,
        organizerId: true,
        eventDate: true,
        organizer: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      message: "Organizer events retrieved",
      data: events,
    };
  }

  // 🌍 PUBLIC MODE (your original logic)
  const events = await prisma.event.findMany({
    where: {
      eventDate: { gt: now },
      availableSeats: { gt: 0 },
    },
    orderBy: {
      eventDate: "asc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      price: true,
      availableSeats: true,
      totalSeats: true,
      eventDate: true,
      organizer: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    message: "Upcoming events retrieved",
    data: events,
  };
}

export default publicUpEventService;