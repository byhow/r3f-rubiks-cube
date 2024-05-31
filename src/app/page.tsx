import Cube from "./components/Cube";

export default function Home() {
  return (
    <main className="ml-4 mt-4">
      <h1 className="text-2xl font-bold">Rubik&apos;s Cube</h1>
      <div className="mt-4">
        <Cube />
      </div>
    </main>
  );
}
