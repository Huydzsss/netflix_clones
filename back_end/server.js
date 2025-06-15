import express from "express";
import authRoutes from "./route/auth.route.js";
import dotenv from "dotenv";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import movieRoutes from "./route/movie.route.js"
import tvRoutes from "./route/tv.route.js"
import { protectRoute } from "./middleware/protectRoute.js";
import searchRoutes from "./route/search.route.js"
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = ENV_VARS.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute,movieRoutes);
app.use("/api/v1/tv", protectRoute,tvRoutes);
app.use("/api/v1/search", protectRoute,searchRoutes);


if (ENV_VARS.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


app.listen(PORT, () => {
    console.log("Server started at: http://localhost:" + PORT);
    connectDB();
});
