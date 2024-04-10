import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { config } from "./config/config";
import Logging from "./library/Logging";
import bookRoutes from "./routes/Book.routes";
import * as cron from "node-cron";
import { generateWeeklyReport } from "./library/GenerateReport";

const router = express();

/** Only start the server when ORM connects */
const StartServer = () => {
  router.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the Request */
    Logging.info(
      `Incoming --> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      /** Log the Response */
      Logging.info(
        `Outgoing --> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /** Rules of our API */
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  router.use("/books", bookRoutes);

  /** Health check */
  router.get("/ping", (req: Request, res: Response, next: NextFunction) =>
    res.status(200).json({ message: "Testing!!!" })
  );

  /** Error Handling */
  router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("<--Not Found-->");
    Logging.error(error);

    return res.status(404).json({ message: error });
  });

  /** Cron Jon to Generate Weekly Report */
  const cronSchedule = config.cronSchedule;

  // cron.schedule(
  //   cronSchedule,
  //   async () => {
  //     Logging.info(`<-- Weekly Report Generation Cron Job Started -->`);
  //     try {
  //       await generateWeeklyReport();
  //       console.log("Weekly report generated successfully.");
  //     } catch (error) {
  //       console.error("Error generating weekly report:", error);
  //     }
  //     Logging.info(`<-- Weekly Report Generation Cron Job Completed -->`);
  //   },
  //   {
  //     timezone: "Asia/Kolkata",
  //   }
  // );

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`<-- Server is running on PORT: ${config.server.port} -->`)
    );
};

StartServer();
