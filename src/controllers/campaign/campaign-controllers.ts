import type {
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { findCampaignListService } from "../../services/campaign-services";
import { sendSuccess } from "../../utils/response-utils";

export const findCampaignListController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const campaignList = await findCampaignListService();

    sendSuccess(res, 200, campaignList);
  } catch (error) {
    next(error);
  }
};
