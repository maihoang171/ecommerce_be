import { describe, vi, expect, it, beforeEach } from "vitest";
import { findCampaignListService } from "./campaign-services";
import { prisma } from "../lib/prisma";

vi.mock("../lib/prisma", () => ({
  prisma: {
    campaign: {
      findMany: vi.fn(),
    }
  },
}));

describe("findCampaignListService", () => {
  it("should return campaign list on success", async () => {
    const mockRes = [
      {
        id: 1,
        title: "mock title 1",
        subTitle: "mock subtitle 1",
        imageUrl: "mock_imageUrl_1",
        linkUrl: "mock_linkUrl_1",
      },
      {
        id: 2,
        title: "mock title 2",
        subTitle: "mock subtitle 2",
        imageUrl: "mock_imageUrl_2",
        linkUrl: "mock_linkUrl_2",
      },
    ];

    vi.mocked(prisma.campaign.findMany).mockResolvedValue(mockRes);
    const res = await findCampaignListService();

    expect(res).toEqual(mockRes);
    expect(prisma.campaign.findMany).toHaveBeenCalledOnce();
  });
});
