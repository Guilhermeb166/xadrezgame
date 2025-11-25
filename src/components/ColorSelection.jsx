import { Chessboard } from "react-chessboard";
import styles from "./ColorSelection.module.css";

export default function ColorSelection({ onSelectColor }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>♟️ Jogo de Xadrez ♟️</h1>
      <p className={styles.subtitle}>Escolha a cor das suas peças</p>

      <div className={styles.buttonContainer}>
        <button
          onClick={() => onSelectColor("white")}
          className={`${styles.button} ${styles.whiteButton}`}
        >
          <span className={styles.piece}>♔</span>
          Jogar com Brancas
        </button>

        <button
          onClick={() => onSelectColor("black")}
          className={`${styles.button} ${styles.blackButton}`}
        >
          <span className={styles.piece}>♚</span>
          Jogar com Pretas
        </button>
      </div>

      <div className={styles.preview}>
        <Chessboard
          position="start"
          boardWidth={400}
          arePiecesDraggable={false}
        />
      </div>
    </div>
  );
}