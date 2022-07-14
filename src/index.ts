import { napraviTokove } from "./controllers/tokovi";
import { kreirajElemente } from "./view/crtaj";

let labelZiri: HTMLLabelElement[] = [];
let inputZiri: HTMLInputElement[] = [];
let divZiri: HTMLDivElement[] = [];

let labelKuvari: HTMLLabelElement[] = [];
let inputKuvari: HTMLInputElement[] = [];
let divKuvari: HTMLDivElement[] = [];

let labelJelo: HTMLLabelElement;
let inputJelo: HTMLInputElement;
let divJelo: HTMLDivElement;

let divInputs: HTMLDivElement;

const vrednosti = kreirajElemente(
  labelZiri,
  inputZiri,
  divZiri,
  labelKuvari,
  inputKuvari,
  divKuvari,
  labelJelo,
  inputJelo,
  divJelo,
  divInputs
);

labelJelo = vrednosti.label;
inputJelo = vrednosti.input;
divJelo = vrednosti.div;

napraviTokove(
  inputZiri,
  inputKuvari,
  inputJelo
);


const divRezultati: HTMLDivElement = document.createElement("div");
divRezultati.className = "rezultati";
document.body.appendChild(divRezultati);