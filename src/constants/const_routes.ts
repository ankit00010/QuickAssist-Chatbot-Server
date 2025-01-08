import { Router, Request, Response } from "express";

export const const_routes = Router();

const_routes.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is up and running." });
});

const_routes.get("/health", (req: Request, res: Response) => {
  res.json({ message: "Server is healthy, up and running." });
});
