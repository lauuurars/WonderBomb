import { useEffect, useRef, useState } from "react"
import { GameCanvas } from "./GameCanvas"
import { io, type Socket } from "socket.io-client"
import { BASE_URL } from "../../consts/api"

interface Player {
    id: string
    size: number
}

export const Game = () => {
    const [players, setPlayers] = useState<Player[]>([])
    const [myId, setMyId] = useState("")
    const [winner, setWinner] = useState<string | null>(null)
    const [sensorActive, setSensorActive] = useState(false)
    const sensorActiveRef = useRef(false)
    const latestMagnitudeRef = useRef(0)
    const socketRef = useRef<Socket | null>(null) // sirve para enviar eventos al server

    useEffect(() => {
        const socket = io(BASE_URL, { path: "/real-time" }) // al montar /game se conecta al server
        socketRef.current = socket

        socket.on("connect", () => {
            setMyId(socket.id ?? "")
        })

        // actualiza el estado del juego (jugadores)
        socket.on("game-update", (payload: { players: Player[] }) => {
            setPlayers(payload.players)
        })

        // actualiza el estado del juego (ganador)
        socket.on("game-over", (payload: { winner: string }) => {
            setWinner(payload.winner)
        })

        // desmontar /game se desconecta del server
        return () => {
            window.removeEventListener("devicemotion", handleDeviceMotion)
            sensorActiveRef.current = false
            socket.disconnect()
            socketRef.current = null
        }
    }, [])

// función de crecer la bola
    const crecerBola = (magnitude: number) => {
        const targetId = socketRef.current?.id ?? myId
        if (!targetId) return

        const MAX_SIZE = 100
        const GROWTH_FACTOR = 0.4

        setPlayers((prev) =>
            prev.map((player) =>
                player.id === targetId
                    ? { ...player, size: Math.min(player.size + magnitude * GROWTH_FACTOR, MAX_SIZE) }
                    : player
            )
        )
    }

    // configuramos el evento del acelerómetro
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
        if (!sensorActiveRef.current) return

        const acc = e.accelerationIncludingGravity ?? e.acceleration
        if (!acc) return

        const x = acc.x ?? 0
        const y = acc.y ?? 0
        const z = acc.z ?? 0

        const magnitude = Math.abs(x) + Math.abs(y) + Math.abs(z)
        latestMagnitudeRef.current = magnitude

        crecerBola(magnitude)
        socketRef.current?.emit("shake", { magnitude })
    }

    const initMotionEvents = () => {
        window.addEventListener("devicemotion", handleDeviceMotion)

        sensorActiveRef.current = true
        setSensorActive(true)
    }

    const activarSensor = async () => {

        if (window.DeviceMotionEvent) {
            if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
                try {
                    const permissionState = await (DeviceMotionEvent as any).requestPermission()
                    if (permissionState === "granted") {
                        initMotionEvents()
                    } else {
                        alert("Permission to access device motion data denied :c")
                    }
                } catch (error) {
                    alert(error)
                }
            } else {
                initMotionEvents()
            }
        } else {
            alert("DeviceMotionEvent is not supported by this browser :p")
        }
    }

    if (winner) {
        return (
            <section>
                <h1>{winner === myId ? "💥 ¡Ganaste!" : "💀 ¡Perdiste!"}</h1>
                <p>{winner === myId ? "Tu bola fue la primera en explotar." : "Otra bola exploto primero."}</p>
            </section>
        )
    }

    return (
        <section>
            <h1>💣 WonderBomb</h1>
            <GameCanvas players={players} myId={myId} />
            {!sensorActive && (
                <button onClick={activarSensor}>Activar sensor</button>
            )}
            {sensorActive && (
                <p>Sacude tu telefono para crecer tu bola!</p>
            )}
        </section>
    )
}
