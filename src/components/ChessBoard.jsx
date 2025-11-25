import { Chessboard } from "react-chessboard";

export default function ChessBoard({ position, onDrop, boardOrientation = "white" }) {
  console.log(position, onDrop)
  return (
    <Chessboard
      position={position}
      onPieceDrop={onDrop}
      boardWidth={520}
      boardOrientation={boardOrientation}
      arePiecesDraggable={true}
      customBoardStyle={{
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
      }}
    />
  );
}