import { Takmicar } from "../models/Takmicar";
import { brojUlaza } from "../promenljive";

export function crtajTakmicare(takmicari: Takmicar[]) {
  const divRezultati: HTMLDivElement = document.querySelector(".rezultati");
  divRezultati.innerHTML = "";

  takmicari.forEach((takmicar, index) => {
    const label: HTMLLabelElement = document.createElement("label");
    label.innerHTML = `${takmicar.ime} ${takmicar.ocena.toFixed(2)} poena`;
    divRezultati.appendChild(label);
    if(index == 0) {
      label.innerHTML += ` POBEDNIK!!!`;
      label.className = "green";
    } else {
      label.className = "red";
    }
  });
}

export function kreirajElemente (
  labelKuvari: HTMLLabelElement[],
  inputKuvari: HTMLInputElement[],
  divKuvari: HTMLDivElement[],
  labelJelo: HTMLLabelElement,
  inputJelo: HTMLInputElement,
  divJelo: HTMLDivElement,
  labelZiri: HTMLLabelElement[],
  inputZiri: HTMLInputElement[],
  divZiri: HTMLDivElement[],
  host: HTMLDivElement
) {
  host = document.createElement("div");
  host.className = "inputs";
  
  for(let i = 0; i < brojUlaza.kuvari; i++) {
    const vrednosti = kreirajElement(
      labelKuvari[i],
      "Kuvar: ",
      inputKuvari[i],
      "Ime",
      divKuvari[i],
      "kuvari",
      host
    );
    labelKuvari[i] = vrednosti.label;
    inputKuvari[i] = vrednosti.input;
    divKuvari[i] = vrednosti.div;
  }
  
  const vrednosti = kreirajElement(
    labelJelo,
    "Jelo: ",
    inputJelo,
    "Naziv",
    divJelo,
    "jelo",
    host
  );

  for(let i = 0; i < brojUlaza.ziri; i++) {
    const vrednosti = kreirajElement(
      labelZiri[i],
      "Ziri: ",
      inputZiri[i],
      "Ime",
      divZiri[i],
      "ziri",
      host
    );
    labelZiri[i] = vrednosti.label;
    inputZiri[i] = vrednosti.input;
    divZiri[i] = vrednosti.div;
  }

  document.body.appendChild(host);
  
  return vrednosti;
}

function kreirajElement(
  label: HTMLLabelElement,
  labelNaziv: string,
  input: HTMLInputElement,
  inputPlaceholder: string,
  div: HTMLDivElement,
  divClass: string,
  host: HTMLDivElement
) {
  label = document.createElement("label");
  label.innerHTML = labelNaziv;
  label.className = "labelInput" + divClass;
  input = document.createElement("input");
  input.placeholder = inputPlaceholder;
  div = document.createElement("div");
  div.className = divClass;
  div.appendChild(label);
  div.appendChild(input);
  host.appendChild(div);
  return {label, input, div}
}