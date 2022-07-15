import { combineLatest, concatMap, from, Observable } from "rxjs";
import { Jelo } from "./Jelo";
import { Kuvar } from "./Kuvar";
import { Ziri } from "./Ziri";

interface Takmicar {
  ime: string,
  ocene: number[],
  ocena: number
}

export class Kulinarstvo {
  kuvari: Kuvar[];
  jelo: Jelo;
  ziri$: Observable<Ziri>[] = [];
  
  takmicari: Takmicar[] = [];

  constructor(kuvari: Kuvar[], jelo: Jelo, ziri$: Observable<Ziri>[]) {
    this.kuvari = kuvari;
    this.jelo = jelo;
    this.ziri$ = ziri$;
    this.kuvari.forEach(kuvar => {
      this.takmicari.push({
        ime: kuvar.ime,
        ocene: [],
        ocena: -1
      })
    });
  }

  IzracunajOcenu() {
    this.takmicari.forEach(takmicar => {
      takmicar.ocena = Math.round((takmicar.ocene.reduce((acc, current) => acc += current, 0) / takmicar.ocene.length));
      console.log(takmicar.ocena);
    });
  }

  Koeficijent(kuvar: Kuvar): number {
    return (Math.round(Math.random() * (kuvar.iskustvo + kuvar.znanje))) + (Math.abs(this.jelo.tezina  - this.jelo.vreme));
  }

  OceniKuvara(ziri: Ziri, kuvar: Kuvar) {
    console.log(kuvar.ime, ziri.ime);
    let ocena: number = this.Koeficijent(kuvar);
    for(let i = 0; i < this.jelo.brojSastojaka; i++) {
      ocena += Math.round(Math.random() * ziri.kriterijum);
    }
    const takmicar: Takmicar = this.takmicari.find(ocena => ocena.ime === kuvar.ime);
    takmicar.ocene.push(ocena);
  }

  Oceni(ziri: Ziri[]) {
    const ziri$ = from(ziri);
    from(this.kuvari)
      .pipe(
        concatMap(() => ziri$, (kuvar, ziri) => {
          return {kuvar, ziri};
        }),
      )
      .subscribe(podaci => this.OceniKuvara(podaci.ziri, podaci.kuvar));
    this.IzracunajOcenu();
  }

  kreni() {
    combineLatest([
      this.ziri$[0],
      this.ziri$[1],
      this.ziri$[2]
    ]).subscribe(([ziri1, ziri2, ziri3]) => {
      if( typeof ziri1 !== "string" &&
          typeof ziri2 !== "string" &&
          typeof ziri3 !== "string"
      ) {
        this.takmicari.forEach(takmicar => {
          takmicar.ocene = [];
        });
        this.Oceni([ziri1, ziri2, ziri3]);
      }
    })
  }
}