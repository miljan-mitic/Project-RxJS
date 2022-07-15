import { Jelo } from "./Jelo";

export class Kuvar {
  id: number;
  ime: string;
  znanje: number;
  iskustvo: number;

  koeficijent(jelo: Jelo): number {
    return this.znanje * this.iskustvo * jelo.brojSastojaka * jelo.tezina * jelo.vreme;
  }
}