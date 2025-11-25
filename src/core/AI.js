import initStockfish from "stockfish.wasm";

const engine = await initStockfish();
engine.postMessage("uci");
engine.onmessage = console.log;
/* Estou trazendo para dentro do código o Stockfish, que é uma IA de xadrez muito famosa e muito forte.*/
class AIEngine {
    constructor() {
        this.engine = Stockfish() // Cria uma nova instância da IA Stockfish, uma cópia dela rodando dentro do navegador.
        this.engine.postMessage("uci")
        /*O Stockfish funciona usando um “protocolo” chamado UCI
        Isso é só para avisar ao robô que queremos conversar usando esse idioma */
    }

    calculateMove(fen, depth = 12) {
        return new Promise((resolve) => {
            this.engine.postMessage(`position fen ${fen}`)
            /*Isso envia para a IA o seguinte comando: “Essa é a posição atual do tabuleiro.”
            A IA agora sabe como está a partida. */

            this.engine.postMessage(`go depth ${depth}`)
            /*Quanto maior a profundidade (depth):
            mais o robô pensa
            mais forte ele joga
            mais devagar ele responde
            depth = 12 é um bom equilíbrio para navegador. */

            this.engine.onmessage = (event) => {//Quando a IA mandar uma resposta, execute esta função aqui.

                const text = event.data || event
                //Ele está tentando pegar o conteúdo da mensagem recebida,
                // mas como esse conteúdo pode vir em formatos diferentes, ele usa um “plano A” e um “plano B”.

                const match = text.match(/bestmove\s(\S+)/)
                /*Isso verifica se o texto da IA contém:
                 “bestmove XXXX”
                Se contém, significa que a IA terminou de pensar. */

                if (match) resolve(match[1])
                //Isso devolve a jogada da IA para o resto do jogo.
            }
        })
    }
}

export default new AIEngine();
/*
1- calculateMove(fen, depth = 12)
Isso é uma função que:

recebe o estado atual do tabuleiro (FEN = texto que representa a posição)

manda isso para a IA

espera a IA pensar

pega a resposta

devolve para o jogo 


2- return new Promise((resolve) => { ... })
O que é isso?

A IA não responde na hora.

Ela precisa pensar um pouco.

Então usamos uma Promise, que é um jeito de dizer:

 “Espere a IA terminar de pensar, depois eu te aviso a resposta.”
*/