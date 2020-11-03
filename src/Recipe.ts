
export type Recipe = {
  name: string;

  description: string;
    
  ingredients: Ingredient[];
}
export enum UnitType {
  CUPS = "CUPS",
  OUNCES = "OUNCES",
}

export type Ingredient = {

    name;

    unitType: UnitType;

    amount;
}

