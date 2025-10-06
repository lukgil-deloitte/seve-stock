import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCpuModel() {
      const cpuModel = await window.electron.getCpuModel();
      console.log("CPU Model:", cpuModel);
    }

    fetchCpuModel();
  }, []);

  useEffect(() => {
    const unsub = window.electron.subscribeToRamUsage((ramUsage) =>
      console.log("ramUsage: ", ramUsage)
    );

    return unsub;
  }, []);

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Typescript + Electron</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
