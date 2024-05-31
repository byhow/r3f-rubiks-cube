import Cube from "./components/Cube";
import Cube3D from "./components/Cube3D";

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl font-bold">Rubik&apos;s Cube</h1>
      <Cube />
      <Cube3D />
    </main>
  );
}
