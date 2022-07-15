import { concatMap, from } from "rxjs";
import { crtajTakmicare } from "../view/crtaj";
import { Jelo } from "./Jelo";
import { Kuvar } from "./Kuvar";
import { Takmicar } from "./Takmicar";
import { Ziri } from "./Ziri";

export class Kulinarstvo {
  kuvari: Kuvar[];
  jelo: Jelo;
  ziri: Ziri[];
  
  takmicari: Takmicar[] = [];

  constructor(kuvari: Kuvar[], jelo: Jelo, ziri: Ziri[]) {
    this.kuvari = kuvari;
    this.jelo = jelo;
    this.ziri = ziri;
    this.kuvari.forEach(kuvar => {
      this.takmicari.push({
        ime: kuvar.ime,
        ocene: [],
        ocena: -1
      })
    });
  }

  sortirajTakmicare() {
    this.takmicari.sort((takmicar1, takmicar2) => takmicar2.ocena - takmicar1.ocena);
    crtajTakmicare(this.takmicari);
  }

  izracunajOcenu() {
    this.takmicari.forEach(takmicar => {
      takmicar.ocena = takmicar.ocene.reduce((acc, current) => acc += current, 0) / takmicar.ocene.length;
    });
    this.sortirajTakmicare();
  }

  koeficijent(kuvar: Kuvar): number {
    return (Math.round(Math.random() * (kuvar.iskustvo + kuvar.znanje))) + (Math.abs(this.jelo.tezina  - this.jelo.vreme));
  }

  oceniKuvara(ziri: Ziri, kuvar: Kuvar) {
    let ocena: number = this.koeficijent(kuvar);
    for(let i = 0; i < this.jelo.brojSastojaka; i++) {
      ocena += Math.round(Math.random() * ziri.kriterijum);
    }
    const takmicar: Takmicar = this.takmicari.find(ocena => ocena.ime === kuvar.ime);
    takmicar.ocene.push(ocena);
  }

  oceni() {
    const ziri$ = from(this.ziri);
    from(this.kuvari)
      .pipe(
        concatMap(() => ziri$, (kuvar, ziri) => {
          return {kuvar, ziri};
        }),
      )
      .subscribe(podaci => this.oceniKuvara(podaci.ziri, podaci.kuvar));
    this.izracunajOcenu();
  }

  kreni() {
    this.takmicari.forEach(takmicar => {
      takmicar.ocene = [];
    });
    this.oceni();
  }
}