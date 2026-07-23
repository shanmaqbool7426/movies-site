import { Router, type IRouter } from "express";
import healthRouter from "./health";
import moviesRouter from "./movies";
import tvRouter from "./tv";
import searchRouter from "./search";
import streamsRouter from "./streams";
import genresRouter from "./genres";
import discoverRouter from "./discover";

const router: IRouter = Router();

router.use(healthRouter);
router.use(moviesRouter);
router.use(tvRouter);
router.use(searchRouter);
router.use(streamsRouter);
router.use(genresRouter);
router.use(discoverRouter);

export default router;
