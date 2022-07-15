import { combineLatest, debounceTime, filter, from, fromEvent, map, Observable, switchMap } from "rxjs";
import { Jelo } from "../models/Jelo";
import { Kulinarstvo } from "../models/Kulinarstvo";
import { Kuvar } from "../models/Kuvar";
import { Ziri } from "../models/Ziri";
import { serverURL } from "../server";

function getTok(input: HTMLInputElement, kulinarstvo: string, input$: HTMLInputElement[]): Observable<Ziri | Kuvar | Jelo> {
  return fromEvent(input, "input")
    .pipe(
      debounceTime(1000),
      map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
      filter((ime: string) => ime.length >= 3),
      switchMap((ime) => {
        if(input$ !== null) {
          return getKulinarstvo(input, kulinarstvo, ime, input$);
        }
        return getKulinarstvo(input, kulinarstvo, ime, null);
      })
    );
}

function getKulinarstvo(inputt: HTMLInputElement, kulinarstvo: string, ime: string, input$: HTMLInputElement[]): Observable<Ziri | Kuvar | Jelo> {
  let naziv: string = "ime";
  if(kulinarstvo === "jela") {
    naziv = "naziv";
  }
  return from(
    fetch(`${serverURL.api}/${kulinarstvo}/?${naziv}=${ime}`)
      .then((response) => {
        if(!response.ok) {
          throw new Error("Nije pronadjen/o!");
        } else {
          return response.json().then(data => {
            if(typeof data[0] === "undefined") {
              return "Nije pronadjen!";
            }
            if(typeof data[0] !== "undefined" && input$ !== null) {
              input$.forEach(input => {
                if(inputt !== input && input.value === data[0].ime) {
                  data[0] = "Već je izabran!";
                }
              });
            }
            return data[0];
          });
        }
      })
      .catch(err => console.error(err))
  );
}

export function napraviTokove (
  inputKuvari: HTMLInputElement[],
  inputJelo: HTMLInputElement,
  inputZiri: HTMLInputElement[]
) {
  let kuvariTokovi: Observable<Kuvar>[] = [];
  for(let i = 0; i < 5; i++) {
    kuvariTokovi[i] = <Observable<Kuvar>>(getTok(inputKuvari[i], "kuvari", inputKuvari));
    kuvariTokovi[i].subscribe((kuvar: Kuvar | string) => {
      if(typeof kuvar === "string"){
        inputKuvari[i].value = "";
        inputKuvari[i].placeholder = kuvar;
      }
    });
  }

  const jelo = <Observable<Jelo>>(getTok(inputJelo, "jela", null));
  jelo.subscribe((jelo: Jelo | string) => {
    if(typeof jelo === "string"){
      inputJelo.value = "";
      inputJelo.placeholder = jelo;
    }
  });

  let ziriTokovi: Observable<Ziri>[] = [];
  for(let i = 0; i < 3; i++) {
    ziriTokovi[i] = <Observable<Ziri>>(getTok(inputZiri[i], "ziri", inputZiri));
    ziriTokovi[i].subscribe((ziri: Ziri | string) => {
      if(typeof ziri === "string"){
        inputZiri[i].value = "";
        inputZiri[i].placeholder = ziri;
      }
    });
  }

  combineLatest([
    kuvariTokovi[0],
    kuvariTokovi[1],
    kuvariTokovi[2],
    kuvariTokovi[3],
    kuvariTokovi[4],
    jelo
  ]).subscribe(([kuvar1, kuvar2, kuvar3, kuvar4, kuvar5, jelo]) => {
    if( typeof kuvar1 !== "string" &&
        typeof kuvar2 !== "string" &&
        typeof kuvar3 !== "string" &&
        typeof kuvar4 !== "string" &&
        typeof kuvar5 !== "string" &&
        typeof jelo !== "string"
      ) {
      console.log([kuvar1, kuvar2, kuvar3, kuvar4, kuvar5]);
      const kulinarstvo = new Kulinarstvo([kuvar1, kuvar2, kuvar3, kuvar4, kuvar5], jelo, ziriTokovi);
      kulinarstvo.kreni();
    }
  });
}