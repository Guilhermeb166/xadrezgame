import Stockfish from 'stockfish'

class AIEngine {
    constructor() {
        this.engine = Stockfish()
        this.engine.postMessage("uci")
    }

    calculateMove(fen, depth = 12) {
        return new Promise((resolve) => {
            this.engine.postMessage(`position fen ${fen}`)
            this.engine.postMessage(`go depth ${depth}`)

            this.engine.onmessage = (event) => {
                const text = event.data || event
                const match = text.match(/bestmove\s(\S+)/)

                if (match) resolve(match[1])
            }
        })
    }
}

export default new AIEngine();