export function kreirajElemente (
  labelZiri: HTMLLabelElement[],
  inputZiri: HTMLInputElement[],
  divZiri: HTMLDivElement[],
  labelKuvari: HTMLLabelElement[],
  inputKuvari: HTMLInputElement[],
  divKuvari: HTMLDivElement[],
  labelJelo: HTMLLabelElement,
  inputJelo: HTMLInputElement,
  divJelo: HTMLDivElement,
  host: HTMLDivElement
) {
  host = document.createElement("div");
  host.className = "inputs";

  for(let i = 0; i < 5; i++) {
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
  
  for(let i = 0; i < 3; i++) {
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
  input = document.createElement("input");
  input.placeholder = inputPlaceholder;
  div = document.createElement("div");
  div.className = divClass;
  div.appendChild(label);
  div.appendChild(input);
  host.appendChild(div);
  return {label, input, div}
}