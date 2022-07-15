import { combineLatest, debounceTime, filter, from, fromEvent, map, Observable, switchMap } from "rxjs";
import { Jelo } from "../models/Jelo";
import { Kuvar } from "../models/Kuvar";
import { Ziri } from "../models/Ziri";
import { serverURL } from "../server";

function getTok(input: HTMLInputElement, kulinarstvo: string, input$: HTMLInputElement[]): Observable<any> {
  return fromEvent(input, "input")
    .pipe(
      debounceTime(1000),
      map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
      filter((ime: string) => ime.length >= 3),
      switchMap((ime) => {
        if(input$ !== null) {
          return getKulinarstvo(input, kulinarstvo, ime, input$)
        }
        return getKulinarstvo(input, kulinarstvo, ime, null);
      }),
      map(podaci => {
        if(typeof podaci === "string") {
          return podaci;
        }
        return podaci[0];
      })
    );
}

function getKulinarstvo(inputt: HTMLInputElement, kulinarstvo: string, ime: string, input$: HTMLInputElement[]): Observable<any[]> {
  let naziv: string = "ime";
  if(kulinarstvo === "jela") {
    naziv = "naziv";
  }
  return from(
    fetch(`${serverURL.api}/${kulinarstvo}/?${naziv}=${ime}`)
      .then((response) => {
        if(!response.ok) {
          throw new Error("Nije pronadjen!");
        } else {
          return response.json().then(data => {
            if(typeof data[0] === "undefined") {
              return "Nije pronadjen!";
            }
            if(typeof data[0] !== "undefined" && input$ !== null) {
              input$.forEach(input => {
                if(inputt !== input && input.value === data[0].ime) {
                  data = "Već je izabran!";
                }
              });
            }
            return data;
          });
        }
      })
      .catch(err => console.error(err))
  );
}

export function napraviTokove (
  inputZiri: HTMLInputElement[],
  inputKuvari: HTMLInputElement[],
  inputJelo: HTMLInputElement
) {
  let ziriTokovi: Observable<Ziri>[] = [];
  for(let i = 0; i < 3; i++) {
    ziriTokovi[i] = getTok(inputZiri[i], "ziri", inputZiri);
    ziriTokovi[i].subscribe((ziri: Ziri | string) => {
      if(typeof ziri !== "string"){
        console.log(ziri);
      } else {
        inputZiri[i].value = "";
        inputZiri[i].placeholder = ziri;
      }
    });
  }
  
  let kuvariTokovi: Observable<Kuvar>[] = [];
  for(let i = 0; i < 5; i++) {
    kuvariTokovi[i] = getTok(inputKuvari[i], "kuvari", inputKuvari);
    kuvariTokovi[i].subscribe((kuvar: Kuvar | string) => {
      if(typeof kuvar !== "string"){
        console.log(kuvar);
      } else {
        inputKuvari[i].value = "";
        inputKuvari[i].placeholder = kuvar;
      }
    });
  }

  const jelo = getTok(inputJelo, "jela", null);
  jelo.subscribe((jelo: Jelo | string) => {
    if(typeof jelo !== "string"){
      console.log(jelo);
    } else {
      inputJelo.value = "";
      inputJelo.placeholder = jelo;
    }
  });

  combineLatest([
    ziriTokovi[0],
    ziriTokovi[1],
    ziriTokovi[2],
    kuvariTokovi[0],
    kuvariTokovi[1],
    kuvariTokovi[2],
    kuvariTokovi[3],
    kuvariTokovi[4],
    jelo
  ]).subscribe(([ziri1, ziri2, ziri3, kuvar1, kuvar2, kuvar3, kuvar4, kuvar5, jelo]) => {
    if(ziri1 && ziri2 && ziri3 && kuvar1 && kuvar2 && kuvar3 && kuvar4 && kuvar5 && jelo) {
      // const kulinarstvo = new Kulinarstvo([ziri1, ziri2, ziri3], [kuvar1, kuvar2, kuvar2, kuvar4, kuvar5]);
      // kulinarstvo.kreni();
      console.log([ziri1, ziri2, ziri3], [kuvar1, kuvar2, kuvar2, kuvar4, kuvar5]);
    }
  });
}