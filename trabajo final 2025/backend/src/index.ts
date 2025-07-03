import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/request-logger.middleware";
import { tareaRoute } from "./routes/tarea.route";
import { tableroRoute } from "./routes/tablero.route";
import { userRoute } from "./routes/user.route";
import cookieParser from "cookie-parser"
import { collabRoute } from "./routes/colaboracion.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(requestLogger);
app.use(cookieParser("secret"));

//Enrutado
app.use("/api/tableros/tasks", tareaRoute);
app.use("/api/tableros", tableroRoute);
app.use("/api/users", userRoute);
app.use("/api/tableros/collabs", collabRoute)

//chek endpoint
app.get("/health", (_, res) => {   
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((req ,res) =>
{
    res.status(404).json({error: "Ruta no encontrada"});
})


//port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`health check: http://localhost:${PORT}/health`);
});

// apagado controlado
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});


