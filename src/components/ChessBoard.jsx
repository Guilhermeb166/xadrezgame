import { Chessboard } from "react-chessboard";


export default function ChessBoard({ position, onDrop }) {
  return (
    <Chessboard
      position={position}
      onPieceDrop={onDrop}
      boardWidth={520}
    />
  )
}
