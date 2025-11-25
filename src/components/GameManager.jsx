import { useState } from "react";
import ChessBoard from "./ChessBoard";
import ColorSelection from "./ColorSelection";
import game from "../core/game";
import AI from "../core/AI";
import styles from "./GameManager.module.css";

export default function GameManager() {
  const [position, setPosition] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [message, setMessage] = useState("");
  const [isAIThinking, setIsAIThinking] = useState(false);

  const handleColorSelection = (color) => {
    console.log("🎨 Cor selecionada:", color);
    game.reset();
    setPlayerColor(color);
    const initialFen = game.getFen();
    console.log("📍 Posição inicial:", initialFen);
    setPosition(initialFen);
    setMessage(`Você está jogando com as peças ${color === "white" ? "brancas" : "pretas"}!`);

    // Se escolheu preto, aguarda mais tempo para IA estar pronta
    if (color === "black") {
      setMessage("Aguarde, a IA está se preparando...");
      setTimeout(() => {
        makeAIMove();
      }, 2000); // Aumentado para 2 segundos
    }
  };

  const makeAIMove = async () => {
    setIsAIThinking(true);
    try {
      const aiMove = await AI.calculateMove(game.getFen());
      game.move(aiMove);
      setPosition(game.getFen());

      if (game.isGameOver()) {
        setMessage("Jogo acabou! A IA venceu! 😢");
      }
    } catch (error) {
      console.error("Erro na IA:", error);
      setMessage("Erro ao calcular movimento da IA");
    }
    setIsAIThinking(false);
  };

  const handleDrop = (source, target) => {
    console.log("🎯 Tentando mover de", source, "para", target);
    
    if (isAIThinking) {
      console.log("⏳ IA está pensando, aguarde...");
      return false;
    }

    const move = game.move({
      from: source,
      to: target,
      promotion: "q",
    });

    console.log("📋 Resultado do movimento:", move);

    if (move === null) {
      console.log("❌ Movimento inválido!");
      return false;
    }

    setPosition(game.getFen());
    console.log("✅ Movimento válido! Nova posição:", game.getFen());

    if (game.isGameOver()) {
      setMessage("Xeque-mate! Você venceu! 🎉");
      
      // IA joga depois do state atualizar
      setTimeout(() => {
        makeAIMove();
      }, 300);
      
      return true;
    }

    // IA joga depois do state atualizar
    setTimeout(() => {
      makeAIMove();
    }, 300);

    return true;
  };

  const resetGame = () => {
    game.reset();
    setPosition(null);
    setPlayerColor(null);
    setMessage("");
    setIsAIThinking(false);
  };

  // Tela de seleção de cor
  if (!playerColor) {
    return <ColorSelection onSelectColor={handleColorSelection} />;
  }

  // Tela do jogo
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>♟️ Jogo de Xadrez ♟️</h1>

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}

      <div className={styles.gameInfo}>
        <span className={styles.colorIndicator}>
          Você: {playerColor === "white" ? "♔ Brancas" : "♚ Pretas"}
        </span>
        <span className={styles.turnIndicator}>
          {isAIThinking ? "🤔 IA pensando..." : "✋ Sua vez!"}
        </span>
      </div>

      <div className={styles.boardContainer}>
        <ChessBoard
          position={position}
          onDrop={handleDrop}
          boardOrientation={playerColor}
        />
        <div style={{marginTop: '10px', color: 'white', fontSize: '14px'}}>
          Debug: Position = {position ? "OK" : "NULL"}
        </div>
      </div>

      <button onClick={resetGame} className={styles.resetButton}>
        🔄 Novo Jogo
      </button>
    </div>
  );
}