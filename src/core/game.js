import { Chess } from "chess.js";
//* É como trazer um árbitro profissional de xadrez para dentro do seu jogo.

class Game {
    constructor(){
        this.game = new Chess()
        //* É como colocar um novo tabuleiro na mesa e arrumar as peças.
    }

    reset(){
        this.game.reset()
        //* Reinicia o jogo
    }
    
    getFen(){
        return this.game.fen()
        //* o tabuleiro usa essa frase para atualizar a tela.
    }

    getMoves(fromSquare) {
        return this.game.moves({ square: fromSquare, verbose: true })
        //* Isso pega todos os movimentos válidos de uma peça
        //* O jogo usa isso para impedir o jogador de fazer movimentos ilegais.
    }

    move(move){
        return this.game.move(move)
        //* Essa função realiza um movimento.
    }

    isGameOver() {
    return this.game.isGameOver();
    //* Pergunta ao árbitro: "O jogo terminou?"
    /*Ele pode responder:
    ✔ xeque-mate
    ✔ rei afogado
    ✔ empate
    ✔ sem movimentos possíveis 
    */
  }
}

export default new Game()