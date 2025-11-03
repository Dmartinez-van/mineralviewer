import "./App.css";
import MyThree from "./Threejs";
import { useState } from "react";

function App() {
  const [selected, setSelected] = useState<string>("Quartz");

  return (
    <div className="app-container">
      <div className="content">
        <aside className="sidebar">
          <h3>Minerals</h3>
          <ul className="mineral-list">
            <li
              className={selected === "Quartz" ? "active" : undefined}
              onClick={() => setSelected("Quartz")}
            >
              Quartz
            </li>
            <li
              className={selected === "Feldspar" ? "active" : undefined}
              onClick={() => setSelected("Feldspar")}
            >
              Feldspar
            </li>
            <li
              className={selected === "Mica" ? "active" : undefined}
              onClick={() => setSelected("Mica")}
            >
              Mica
            </li>
            <li
              className={selected === "Calcite" ? "active" : undefined}
              onClick={() => setSelected("Calcite")}
            >
              Calcite
            </li>
            <li
              className={selected === "Pyrite" ? "active" : undefined}
              onClick={() => setSelected("Pyrite")}
            >
              Pyrite
            </li>
            <li
              className={selected === "Gypsum" ? "active" : undefined}
              onClick={() => setSelected("Gypsum")}
            >
              Gypsum
            </li>
          </ul>
        </aside>

        <main className="viewer">
          <MyThree mineralName={selected} />
        </main>
      </div>
    </div>
  );
}

export default App;
