import express from "express"

import { getTrendingTV,
    getCategoryTV,
    getSimilarTV,
    getTVDetails,
    getTrailersTV
 } from "../controller/tv.controller.js";

const router = express.Router();

router.get("/trending",getTrendingTV);
router.get("/:id/trailers",getTrailersTV);
router.get("/:id/details",getTVDetails);
router.get("/:id/similar",getSimilarTV);
router.get("/:category",getCategoryTV);

export default router;