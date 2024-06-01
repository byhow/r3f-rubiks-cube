import { GeometryMove } from "@/lib/types";

const MovesExplanation = ({
  allMoves,
}: {
  allMoves: Record<string, GeometryMove>;
}) => {
  return (
    <div>
      {Object.values(allMoves).map((move: GeometryMove) => (
        <p key={move.name}>
          Move <strong>{move.name}</strong> rotates around the axis{" "}
          <strong>{move.axis.toString()}</strong>.
        </p>
      ))}
    </div>
  );
};

export default MovesExplanation;
