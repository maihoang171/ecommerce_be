import { beforeEach, describe, it, vi, expect } from "vitest";
import { findCampaignListService } from "../../services/campaign-services";
import { findCampaignListController } from "./campaign-controllers";
import { sendSuccess } from "../../utils/response-utils";
import { mockCategoryList } from "../../tests/mockData";

vi.mock("../../utils/response-utils", () => ({
  sendSuccess: vi.fn(),
}));

vi.mock("../../services/campaign-services", () => ({
  findCampaignListService: vi.fn(),
}));

describe("findCampaignListController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockReq = {} as any;
  const mockRes = {} as any;
  const mockNext = vi.fn();

  it("should pass error to next() on internal server error", async () => {
    const mockErr = new Error("Something went wrong");

    vi.mocked(findCampaignListService).mockRejectedValue(mockErr);

    await findCampaignListController(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockErr);
  });

  it("should sendSuccess with status code 200 and campaign list data on success", async () => {
    const mockCampaignList = mockCategoryList[0]?.campaigns;

    vi.mocked(findCampaignListService).mockResolvedValue(mockCampaignList);

    await findCampaignListController(mockReq, mockRes, mockNext);

    expect(sendSuccess).toHaveBeenCalledWith(mockRes, 200, mockCampaignList);
  });
});
