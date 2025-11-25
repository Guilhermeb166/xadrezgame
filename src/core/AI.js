class AIEngine {
    constructor() {
        this.engine = null;
        this.ready = false;
        this.initEngine();
    }

    initEngine() {
        console.log("🔧 Iniciando carregamento do Stockfish...");
        
        // Tenta carregar via Web Worker (mais moderno)
        try {
            // Cria um Web Worker inline com o Stockfish
            const workerCode = `
                importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
                var engine = STOCKFISH();
                engine.postMessage = self.postMessage.bind(self);
                self.onmessage = function(e) {
                    engine.postMessage(e.data);
                };
            `;
            
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const workerUrl = URL.createObjectURL(blob);
            
            this.engine = new Worker(workerUrl);
            this.engine.postMessage("uci");
            
            this.engine.onmessage = (e) => {
                if (e.data.includes("uciok")) {
                    this.ready = true;
                    console.log("✅ Stockfish carregado via Worker!");
                }
            };
            
        } catch (error) {
            console.error("❌ Erro ao criar Worker:", error);
            // Fallback: usar IA simples
            this.useFallbackAI();
        }
    }

    useFallbackAI() {
        console.log("🎲 Usando IA simplificada (movimentos aleatórios)");
        this.ready = true;
        this.engine = { isFallback: true };
    }

    async waitForReady() {
        let attempts = 0;
        while (!this.ready && attempts < 100) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!this.ready) {
            console.log("⚠️ Timeout - usando IA simplificada");
            this.useFallbackAI();
        }
    }

    async calculateMove(fen, depth = 12) {
        await this.waitForReady();
        
        // Se estiver usando fallback AI (aleatória)
        if (this.engine.isFallback) {
            return this.calculateRandomMove(fen);
        }
        
        // Usa Stockfish real
        return new Promise((resolve) => {
            this.engine.postMessage(`position fen ${fen}`);
            this.engine.postMessage(`go depth ${depth}`);

            this.engine.onmessage = (event) => {
                const text = event.data || event;
                const match = text.match(/bestmove\s(\S+)/);
                
                if (match) {
                    resolve(match[1]);
                }
            };
        });
    }

    calculateRandomMove(fen) {
        // IA simples: movimento aleatório válido
        const Chess = window.Chess || require('chess.js').Chess;
        const tempGame = new Chess(fen);
        const moves = tempGame.moves({ verbose: true });
        
        if (moves.length === 0) return null;
        
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        return `${randomMove.from}${randomMove.to}`;
    }
}

export default new AIEngine();