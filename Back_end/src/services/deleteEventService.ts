import prisma from "../lib/prisma.js";

export const deleteEventService = async (eventId: number, user: any) => {
  // 🔍 Check if event exists AND belongs to user
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      organizer: {
        email: user.email,
      },
    },
  });

  if (!event) {
    throw new Error("Event not found or not yours");
  }

  // 🗑️ Delete event
  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  return {
    message: "Event deleted successfully",
  };
};