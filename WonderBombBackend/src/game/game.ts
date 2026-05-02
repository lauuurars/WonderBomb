interface Player {
    id: string
    size: number
}

export const MAX_SIZE = 100
const INITIAL_SIZE = 10
const GROWTH_FACTOR = 0.4

const players = new Map<string, Player>()

export const addPlayer = (id: string): void => {
    players.set(id, { id, size: INITIAL_SIZE })
}

export const removePlayer = (id: string): void => {
    players.delete(id)
}

export const growBall = (id: string, magnitude: number): boolean => {
    const player = players.get(id)
    if (!player) return false
    player.size = Math.min(player.size + magnitude * GROWTH_FACTOR, MAX_SIZE)
    return player.size >= MAX_SIZE
}

export const getState = (): Player[] => {
    return Array.from(players.values())
}
