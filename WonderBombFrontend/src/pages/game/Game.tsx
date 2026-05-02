import { useEffect, useRef, useState } from "react"
import { GameCanvas } from "./GameCanvas"

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

    useEffect(() => {
    }, [])

    const crecerBola = (_magnitude: number) => {
        setInterval(() => {
            if (!sensorActiveRef.current) return
            crecerBola(latestMagnitudeRef.current)
        }, 500)
    }

    const activarSensor = () => {
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
