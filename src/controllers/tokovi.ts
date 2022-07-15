import { combineLatest, debounceTime, filter, from, fromEvent, map, Observable, switchMap } from "rxjs";
import { Jelo } from "../models/Jelo";
import { Kulinarstvo } from "../models/Kulinarstvo";
import { Kuvar } from "../models/Kuvar";
import { Ziri } from "../models/Ziri";
import { brojUlaza, kulinarstvo, serverURL } from "../promenljive";

function getTok(input: HTMLInputElement, nazivObjektaUBazi: string, input$: HTMLInputElement[]): Observable<Ziri | Kuvar | Jelo> {
  return fromEvent(input, "input")
    .pipe(
      debounceTime(1000),
      map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
      filter((ime: string) => ime.length >= 3),
      switchMap((ime) => {
        if(input$ !== null) {
          return getKulinarstvo(input, nazivObjektaUBazi, ime, input$);
        }
        return getKulinarstvo(input, nazivObjektaUBazi, ime, null);
      })
    );
}

function getKulinarstvo(inputt: HTMLInputElement, nazivObjektaUBazi: string, ime: string, input$: HTMLInputElement[]): Observable<Ziri | Kuvar | Jelo> {
  let naziv: string = "ime";
  if(nazivObjektaUBazi === kulinarstvo.jela) {
    naziv = "naziv";
  }
  return from(
    fetch(`${serverURL.api}/${nazivObjektaUBazi}/?${naziv}=${ime}`)
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
  
  let tok$: Observable<Ziri | Kuvar | Jelo>[] = [];

  const kuvariTokovi: Observable<Kuvar>[] = [];
  for(let i = 0; i < brojUlaza.kuvari; i++) {
    kuvariTokovi[i] = <Observable<Kuvar>>(getTok(inputKuvari[i], kulinarstvo.kuvari, inputKuvari));
    kuvariTokovi[i].subscribe((kuvar: Kuvar | string) => {
      if(typeof kuvar === "string"){
        inputKuvari[i].value = "";
        inputKuvari[i].placeholder = kuvar;
      }
    });
    tok$.push(kuvariTokovi[i]);
  }

  const jelo = <Observable<Jelo>>(getTok(inputJelo, kulinarstvo.jela, null));
  jelo.subscribe((jelo: Jelo | string) => {
    if(typeof jelo === "string"){
      inputJelo.value = "";
      let niz = jelo.split("");
      niz[niz.length - 1] = 'o';
      niz.push('!');
      inputJelo.placeholder = niz.join("");
    }
  });
  tok$.push(jelo);

  const ziriTokovi: Observable<Ziri>[] = [];
  for(let i = 0; i < brojUlaza.ziri; i++) {
    ziriTokovi[i] = <Observable<Ziri>>(getTok(inputZiri[i], kulinarstvo.ziri, inputZiri));
    ziriTokovi[i].subscribe((ziri: Ziri | string) => {
      if(typeof ziri === "string"){
        inputZiri[i].value = "";
        inputZiri[i].placeholder = ziri;
      }
    });
    tok$.push(ziriTokovi[i]);
  }
  combineLatest(tok$).subscribe(([kuvar1, kuvar2, kuvar3, kuvar4, kuvar5, jelo, ziri1, ziri2, ziri3]) => {
    if( typeof kuvar1 !== "string" &&
        typeof kuvar2 !== "string" &&
        typeof kuvar3 !== "string" &&
        typeof kuvar4 !== "string" &&
        typeof kuvar5 !== "string" &&
        typeof jelo !== "string" &&
        typeof ziri1 !== "string" &&
        typeof ziri2 !== "string" &&
        typeof ziri3 !== "string"
      ) {
      const kulinarstvo = new Kulinarstvo(
        [<Kuvar>kuvar1, <Kuvar>kuvar2, <Kuvar>kuvar3, <Kuvar>kuvar4, <Kuvar>kuvar5], 
        <Jelo>jelo, 
        [<Ziri>ziri1, <Ziri>ziri2, <Ziri>ziri3]
      );
      kulinarstvo.kreni();
    }
  });
}