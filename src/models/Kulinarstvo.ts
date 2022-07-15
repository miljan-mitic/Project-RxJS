import { Kuvar } from "./Kuvar";
import { Ziri } from "./Ziri";

export class Kulinarstvo {
  kuvari: Kuvar[];
  komisija: Ziri[];

  constructor(kuvari: Kuvar[], komisija: Ziri[]) {
    this.kuvari = kuvari;
    this.komisija = komisija;
  }
}