import express, { Request, Response } from "express"
import socketio from "socket.io"
import { createServer } from "http"
import cors from "cors"
import "dotenv/config"

import { AuthRouter } from "./routes/auth/auth.router"
import { GameRouter } from "./routes/game/game.router"
import { addPlayer, getState, growBall, removePlayer } from './game/game';

const app = express()
app.use(cors())
app.use(express.json())

app.use("/auth", AuthRouter)
app.use("/game", GameRouter)

app.get("/", (_req: Request, res: Response) => {
    res.send("WonderBomb Backend")
})

const rawServer = createServer(app)

rawServer.listen(8080, () => {
    console.log("Server running on port 8080")
})

const io = new socketio.Server(rawServer, {
    path: "/real-time",
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("connected:", socket.id)

    addPlayer(socket.id) // registramos nuevo jugador 

    // avisamos a todos los clientes el estado completo del juego
    io.emit("game-update", {
        players: getState()
    })

    // evento shake 
    socket.on("shake", (payload: { magnitude: number }) => {

        const magnitude = Number(payload?.magnitude ?? 0)
        const exploded = growBall(socket.id, magnitude)

        io.emit("game-update", { players: getState() }) // actualiza el estado nuevo

        // emitimos q el juego terminó y enviamos el ganador
        if (exploded) {
            io.emit("game-over", {
                winner: socket.id
            })
        }
    })

    // eliminamos jugador y actualizamos el estado 
    socket.on("disconnect", () => {
        console.log("disconnected:", socket.id)
        removePlayer(socket.id)
        io.emit("game-update", { players: getState() })
    })
})