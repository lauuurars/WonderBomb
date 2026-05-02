import { Request, Response } from "express"
import { getState } from "../../game/game"

const getGameState = (_req: Request, res: Response) => {
    res.json({ players: getState() })
}

export default { getGameState }
