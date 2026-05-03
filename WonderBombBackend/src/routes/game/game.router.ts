import express from "express"
import GameController from "./game.controller"
import { AuthMiddleware } from "../../middlewares/Auth.middleware"

export const GameRouter = express.Router()

GameRouter.use(AuthMiddleware)

GameRouter.get("/state", GameController.getGameState)
