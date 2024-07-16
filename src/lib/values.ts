export enum Sports {
  Basketball,
  Basketball3x3,
  Badminton,
  BeachVolley,
  FieldHockey,
  Football,
  Handball,
  TableTennis,
  Tennis,
  Volleyball,
  WaterPolo,
}

export const sportByLink = {
  basketball: Sports.Basketball,
  basketball3x3: Sports.Basketball3x3,
  fieldhockey: Sports.FieldHockey,
  football: Sports.Football,
  handball: Sports.Handball,
  volleyball: Sports.Volleyball,
  waterpolo: Sports.WaterPolo,
} as { [key: string]: number };

export const sportsNames = {
  [Sports.Basketball]: 'Basketball',
  [Sports.Basketball3x3]: 'Basketball 3x3',
  [Sports.FieldHockey]: 'Field Hockey',
  [Sports.Football]: 'Football',
  [Sports.Handball]: 'Handball',
  [Sports.Volleyball]: 'Volleyball',
  [Sports.WaterPolo]: 'Water Polo',
} as { [key in Sports]: string };
