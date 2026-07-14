import CinematicBackground from "./components/CinematicBackground";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import SceneOne from "./scenes/SceneOne";
import SceneTwo from "./scenes/SceneTwo";
import SceneThree from "./scenes/SceneThree";
import SceneFour from "./scenes/SceneFour";
import SceneFive from "./scenes/SceneFive";
import SceneSix from "./scenes/SceneSix";

function App() {
  useSmoothScroll();

  return (
    <div className="relative isolate overflow-x-clip bg-slate-950 text-white">
      <CinematicBackground />
      <main id="portfolio-world" className="relative z-10">
        <SceneOne />
        <SceneTwo />
        <SceneThree />
        <SceneFour />
        <SceneFive />
        <SceneSix />
      </main>
    </div>
  );
}

export default App;
