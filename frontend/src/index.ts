import "./style.css";
import * as Phaser from "phaser";

function component() {
  const element = document.createElement("div");

  console.log(Phaser);
  element.innerHTML = "Hello world!";

  return element;
}

document.body.appendChild(component());
