import { concatMap, delay, from, Observable, of } from "rxjs";
import { Jelo } from "./Jelo";
import { Kuvar } from "./Kuvar";
import { Ziri } from "./Ziri";

interface Takmicar {
  ime: string,
  ocene: number[],
}

export class Kulinarstvo {
  kuvari: Kuvar[];
  jelo: Jelo;
  ziriTokovi: Observable<Ziri>[] = [];
  
  takmicari: Takmicar[] = [];

  constructor(kuvari: Kuvar[], jelo: Jelo, ziriTokovi: Observable<Ziri>[]) {
    this.kuvari = kuvari;
    this.jelo = jelo;
    this.ziriTokovi = ziriTokovi;
    this.kuvari.forEach(kuvar => {
      this.takmicari.push({
        ime: kuvar.ime,
        ocene: []
      })
    });
  }

  OceniKuvara(ziri: Ziri, kuvar: Kuvar) {
    let ocena = kuvar.koeficijent(this.jelo);
    const takmicar: Takmicar = this.takmicari.find(ocena => ocena.ime === kuvar.ime);
    takmicar.ocene.push(ocena);
    console.log(ocena);
  }

  Oceni(ziri: Ziri) {
    from(this.kuvari)
      .pipe(
        concatMap(kuvar => of(kuvar))
      )
      .subscribe(kuvar => this.OceniKuvara(ziri, kuvar));
  }

  kreni(inputZiri: HTMLInputElement[]) {
    for(let i = 0; i < 3; i++) {
      this.ziriTokovi[i].subscribe((ziri: Ziri | string) => {
        if(typeof ziri !== "string"){
          this.Oceni(ziri);
        } else {
          inputZiri[i].value = "";
          inputZiri[i].placeholder = ziri;
        }
      });
    }
  }
}