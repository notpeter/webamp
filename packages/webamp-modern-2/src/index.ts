import JSZip from "jszip";
// This module is imported early here in order to avoid a circular dependency.
import { classResolver } from "./skin/resolver";
import SkinParser from "./skin/parse";

function hack() {
  // Without this Snowpack will try to treeshake out resolver causing a circular
  // dependency.
  classResolver("A funny joke about why this is needed.");
}

async function main() {
  const response = await fetch("assets/CornerAmp_Redux.wal");
  // const response = await fetch("assets/Default_winamp3_build499.wal");
  const data = await response.blob();
  const zip = await JSZip.loadAsync(data);

  const parser = new SkinParser(zip);

  await parser.parse();

  for (const container of parser._containers) {
    container.init({ containers: parser._containers });
  }

  let node = document.createElement("div");

  for (const container of parser._containers) {
    node.appendChild(container.getDebugDom());
  }

  document.body.appendChild(node);
  setInterval(() => {
    if (window.pause) {
      return;
    }
    document.body.removeChild(node);
    node = document.createElement("div");
    for (const container of parser._containers) {
      node.appendChild(container.getDebugDom());
    }
    document.body.appendChild(node);
  }, 1000);
}

main();