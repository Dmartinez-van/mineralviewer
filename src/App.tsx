import "./App.css";
import MyThree from "./Threejs";
import { useState } from "react";

// Minimal type describing the facts we show in the left info panel
type MineralInfo = {
  hardness: string;
  color: string;
  crystalSystem: string;
  composition?: string;
  locality: string;
  description?: string;
};

const MINERALS: Record<string, MineralInfo> = {
  Biotite: {
    hardness: "2.5–3",
    color: "Dark brown to black",
    crystalSystem: "Monoclinic",
    composition: "K(Mg,Fe)3AlSi3O10(OH)2",
    locality: "Common in igneous and metamorphic rocks worldwide",
    description:
      "A common mica-group mineral; flaky sheets, dark color, and perfect basal cleavage.",
  },
  Gypsum: {
    hardness: "~2",
    color: "Colorless, white, gray or with impurities",
    crystalSystem: "Monoclinic",
    composition: "CaSO4·2H2O",
    locality: "Evaporite deposits; sedimentary basins worldwide",
    description:
      "A soft sulfate mineral forming clear tabular crystals or fibrous masses (selenite).",
  },
  Rhodonite: {
    hardness: "5.5–6.5",
    color: "Pink to red, often with black manganese oxide veins",
    crystalSystem: "Triclinic",
    composition: "(Mn,Fe,Mg,Ca)SiO3",
    locality: "Notable localities: Russia, Sweden, USA",
    description:
      "A manganese silicate prized as an ornamental stone; typically pink with dark inclusions.",
  },
  Sphalerite: {
    hardness: "3.5–4",
    color: "Yellow to brown to black (zinc sulfide)",
    crystalSystem: "Isometric",
    composition: "(Zn,Fe)S",
    locality: "Common in hydrothermal veins and skarns",
    description:
      "The primary ore of zinc; crystals often show high dispersion (adamantine luster).",
  },
  Tourmaline: {
    hardness: "7–7.5",
    color: "Many colors (often green, black, pink)",
    crystalSystem: "Trigonal",
    composition: "Complex boron silicate; varied chemistry",
    locality: "Pegmatites and metamorphic rocks worldwide",
    description:
      "A group of complex borosilicate minerals that occur in many colors and form prismatic crystals.",
  },
  Wollastonite: {
    hardness: "4.5–5",
    color: "White, gray or pale shades",
    crystalSystem: "Triclinic",
    composition: "CaSiO3",
    locality: "Metamorphosed limestones and skarn deposits",
    description:
      "A calcium inosilicate used as a source of calcium and in ceramics; typically white and fibrous or tabular.",
  },
};

function App() {
  const [selected, setSelected] = useState<string>("Biotite");
  const [showBottom, setShowBottom] = useState<boolean>(true);

  const info = MINERALS[selected];

  return (
    <>
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <title>
        Mineral Viewer - Your one stop shop for all your mineral viewing needs
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

            {/* Info panels for the selected mineral — left and bottom of the canvas */}
            <div id="info-left">
              <div className="info-header">
                <h4>{selected}</h4>
              </div>

              {info ? (
                <>
                  {info.description && <p>{info.description}</p>}
                  <ul>
                    <li>
                      <strong>Hardness:</strong> {info.hardness}
                    </li>
                    <li>
                      <strong>Color:</strong> {info.color}
                    </li>
                    <li>
                      <strong>Crystal system:</strong> {info.crystalSystem}
                    </li>
                    {info.composition && (
                      <li>
                        <strong>Composition:</strong> {info.composition}
                      </li>
                    )}
                    <li>
                      <strong>Locality:</strong> {info.locality}
                    </li>
                  </ul>
                </>
              ) : (
                <p>No information available for {selected}.</p>
              )}
            </div>

            <div id="info-bottom" className={showBottom ? "" : "collapsed"}>
              <div className="info-bottom-left">
                <h4 style={{ margin: 0 }}>Controls</h4>
                <div className="info-bottom-content">
                  <div className="controls-instructions">
                    <ul style={{ margin: "6px 0 0 16px" }}>
                      <li>Rotate: Left mouse drag</li>
                      <li>
                        Zoom: Mouse wheel or use Zoom In / Zoom Out buttons
                      </li>
                      <li>Pan: Right mouse drag (or Ctrl + Left drag)</li>
                      <li>
                        Auto-rotate: Toggle with the Auto-rotate button
                        (top-right)
                      </li>
                      <li>
                        Reset view: Use the Reset View button to restore camera
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                aria-label={showBottom ? "Hide notes" : "Show notes"}
                className="panel-toggle bottom-toggle"
                onClick={() => setShowBottom((s) => !s)}
              >
                {showBottom ? "▾" : "▴"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
