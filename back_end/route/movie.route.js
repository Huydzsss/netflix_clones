import express from "express"
import {    getCategoryMovie,
            getMovieDetails,
            getSimilarMovie,
            getTrailersMovie,
            getTrendingMovie } 
from "../controller/movie.controller.js";

const router = express.Router();

router.get("/trending",getTrendingMovie);
router.get("/:id/trailers",getTrailersMovie);
router.get("/:id/details",getMovieDetails);
router.get("/:id/similar",getSimilarMovie);
router.get("/:category",getCategoryMovie);


export default router;