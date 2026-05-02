import { useEffect, useRef } from "react"

interface Player {
    id: string
    size: number
}

interface Props {
    players: Player[]
    myId: string
}

const CANVAS_SIZE = 360
const MAX_SIZE = 100

export const GameCanvas = ({ players, myId }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

        if (players.length === 0) return

        const cols = Math.ceil(Math.sqrt(players.length))
        const rows = Math.ceil(players.length / cols)
        const cellW = CANVAS_SIZE / cols
        const cellH = CANVAS_SIZE / rows

        players.forEach((player, index) => {
            const col = index % cols
            const row = Math.floor(index / cols)
            const cx = col * cellW + cellW / 2
            const cy = row * cellH + cellH / 2
            const maxRadius = Math.min(cellW, cellH) / 2 - 8
            const radius = Math.max((player.size / MAX_SIZE) * maxRadius, 6)

            const isMe = player.id === myId
            const hue = isMe ? 0 : 210
            const lightness = 45 + (player.size / MAX_SIZE) * 20

            ctx.beginPath()
            ctx.arc(cx, cy, radius, 0, Math.PI * 2)
            ctx.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`
            ctx.shadowColor = `hsl(${hue}, 80%, 60%)`
            ctx.shadowBlur = 12
            ctx.fill()
            ctx.shadowBlur = 0

            ctx.fillStyle = "#fff"
            ctx.font = "bold 11px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(isMe ? "Tú" : `J${index + 1}`, cx, cy)

            const barW = cellW * 0.6
            const barH = 6
            const barX = cx - barW / 2
            const barY = cy + radius + 6
            ctx.fillStyle = "#333"
            ctx.fillRect(barX, barY, barW, barH)
            ctx.fillStyle = `hsl(${hue}, 80%, 55%)`
            ctx.fillRect(barX, barY, barW * (player.size / MAX_SIZE), barH)
        })
    }, [players, myId])

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            style={{
                border: "2px solid #333",
                borderRadius: "12px",
                background: "#1a1a2e",
                display: "block"
            }}
        />
    )
}
