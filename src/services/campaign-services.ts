import { prisma } from "../lib/prisma";

export const findCampaignListService = async () => {
  return await prisma.campaign.findMany({
    select: {
      id: true,
      title: true,
      subTitle: true,
      imageUrl: true,
      linkUrl: true,
    },
  });
};
