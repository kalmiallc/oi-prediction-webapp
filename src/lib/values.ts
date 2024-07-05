export enum Sports {
  Basketball = 'Basketball',
  Basketball3x3 = 'Basketball 3x3',
  Badminton = 'Badminton',
  BeachVolley = 'Beach Volley',
  FieldHockey = 'Field Hockey',
  Soccer = 'Soccer',
  Handball = 'Handball',
  TableTennis = 'Table Tennis',
  Tennis = 'Tennis',
  Volleyball = 'Volleyball',
  WaterPolo = 'Water Polo',
}

export const sportByLink = {
  basketball: Sports.Basketball,
  basketball3x3: Sports.Basketball3x3,
  badminton: Sports.Badminton,
  beachvolley: Sports.BeachVolley,
  fieldhockey: Sports.FieldHockey,
  soccer: Sports.Soccer,
  handball: Sports.Handball,
  tabletennis: Sports.TableTennis,
  tennis: Sports.Tennis,
  volleyball: Sports.Volleyball,
  waterpolo: Sports.WaterPolo,
} as { [key: string]: string };
