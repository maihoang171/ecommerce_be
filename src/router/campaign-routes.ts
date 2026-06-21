import express from "express";
import { findCampaignListController } from "../controllers/campaign/campaign-controllers";

const campaignRouter = express.Router();

campaignRouter.get("", findCampaignListController);

export default campaignRouter;
