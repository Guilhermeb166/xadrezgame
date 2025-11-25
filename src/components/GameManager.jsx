import { useState } from "react";
import ChessBoard from "./ChessBoard";
import game from "../core/game";
import AI from "../core/AI";

export default function GameManager() {

    const [position, setPosition] = useState(game.getFen());
    const handleDrop = async (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: "q",
        })

        if (move === null) return false

        setPosition(game.getFen())

        const aiMove = await AI.calculateMove(game.getFen())
        game.move(aiMove)

        setPosition(game.getFen())
        return true
    }

    return (
        <div style={{ paddingTop: 40 }}>
            <ChessBoard position={position} onDrop={handleDrop} />
        </div>
    )
}
