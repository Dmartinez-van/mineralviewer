import "./App.css";
import MyThree from "./Threejs";
import { useState } from "react";

function App() {
  const [selected, setSelected] = useState<string>("Gypsum");

  return (
    <>
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <title>
        Mineral Viewer: Your one stop shop for all your mineral viewing needs
      </title>
      <div className="app-container">
        <div className="content">
          <aside className="sidebar">
            <h3>Minerals</h3>
            <ul className="mineral-list">
              <li
                className={selected === "Biotite" ? "active" : undefined}
                onClick={() => setSelected("Biotite")}
              >
                Biotite
              </li>
              <li
                className={selected === "Gypsum" ? "active" : undefined}
                onClick={() => setSelected("Gypsum")}
              >
                Gypsum
              </li>
              <li
                className={selected === "Rhodonite" ? "active" : undefined}
                onClick={() => setSelected("Rhodonite")}
              >
                Rhodonite
              </li>
              <li
                className={selected === "Sphalerite" ? "active" : undefined}
                onClick={() => setSelected("Sphalerite")}
              >
                Sphalerite
              </li>
              <li
                className={selected === "Tourmaline" ? "active" : undefined}
                onClick={() => setSelected("Tourmaline")}
              >
                Tourmaline
              </li>
              <li
                className={selected === "Wollastonite" ? "active" : undefined}
                onClick={() => setSelected("Wollastonite")}
              >
                Wollastonite
              </li>
            </ul>
          </aside>

          <main className="viewer">
            <MyThree
              mineralName={selected}
              filePath={`/models/${selected.toLowerCase()}/scene.gltf`}
            />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
