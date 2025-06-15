import express from "express"
import { searchMovie,searchTV,searchPerson,getSearchHistory,removeItemFromHistory } from "../controller/search.controller.js";
const router = express.Router();

router.get("/person/:query",searchPerson);
router.get("/movie/:query",searchMovie);
router.get("/tv/:query",searchTV);
router.get("/history",getSearchHistory);
router.delete("/history/:id",removeItemFromHistory);


export default router;