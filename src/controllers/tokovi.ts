import { debounceTime, filter, from, fromEvent, map, Observable, switchMap } from "rxjs";
import { Ziri } from "../models/Ziri";
import { serverURL } from "../server";

export function napraviTokove (
  inputZiri: HTMLInputElement[],
  inputKuvari: HTMLElement[],
  inputJelo: HTMLElement
) {
  let ziriTokovi: Observable<Ziri>[] = [];
  for(let i = 0; i < 5; i++) {
    ziriTokovi[i] = ziriTok(inputZiri[i]);
    ziriTokovi[i].subscribe((ziri: Ziri) => console.log(ziri));
  }
}

function ziriTok (inputZiri: HTMLInputElement): Observable<Ziri> {
  return fromEvent(inputZiri, "input")
    .pipe(
      debounceTime(1000),
      map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
      filter((ime: string) => ime.length >= 3),
      switchMap((ime) => getZiri(inputZiri, ime)),
      map(podaci => podaci[0])
    );
}

function getZiri(inputZiri: HTMLInputElement, ime: string): Observable<Ziri[]> {
  return from(
    fetch(`${serverURL.ziri}/?ime=${ime}`)
      .then((response) => {
        if(response.ok) {
          console.log(response);
          return response.json();
        } else {
          throw new Error("Ziri nije pronadjen!");
        }
      })
      .catch(() => inputZiri.placeholder = "Ziri nije pronadjen!")
  );
}