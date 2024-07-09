import {
  mdiBadminton,
  mdiBasketball,
  mdiHandball,
  mdiHockeySticks,
  mdiSoccer,
  mdiTableTennis,
  mdiTennis,
  mdiVolleyball,
  mdiWaterPolo,
} from '@mdi/js';
import Icon from '@mdi/react';
import classNames from 'classnames';
import React from 'react';
import { Sports } from '@/lib/values';
import SidebarSportsBtn from './SidebarSportsBtn';

export default function SidebarSports({ className }: ComponentProps) {
  const sports = [
    {
      name: Sports.Basketball,
      icon: mdiBasketball,
      link: 'basketball',
    },
    {
      name: Sports.Basketball3x3,
      icon: mdiBasketball,
      link: 'basketball3x3',
    },
    {
      name: Sports.Badminton,
      icon: mdiBadminton,
      link: 'badminton',
    },
    {
      name: Sports.BeachVolley,
      icon: mdiVolleyball,
      link: 'beachvolley',
    },
    {
      name: Sports.FieldHockey,
      icon: mdiHockeySticks,
      link: 'fieldhockey',
    },
    {
      name: Sports.Soccer,
      icon: mdiSoccer,
      link: 'soccer',
    },
    {
      name: Sports.Handball,
      icon: mdiHandball,
      link: 'handball',
    },
    {
      name: Sports.TableTennis,
      icon: mdiTableTennis,
      link: 'tabletennis',
    },
    {
      name: Sports.Tennis,
      icon: mdiTennis,
      link: 'tennis',
    },
    {
      name: Sports.Volleyball,
      icon: mdiVolleyball,
      link: 'volleyball',
    },
    {
      name: Sports.WaterPolo,
      icon: mdiWaterPolo,
      link: 'waterpolo',
    },
  ];
  return (
    <div className={classNames(['overflow-y-auto overflow-x-hidden break-words', className])}>
      <div className="p-1">
        {sports.map((sport, i) => (
          <SidebarSportsBtn className={classNames([''])} key={'sport-' + i} href={sport.link}>
            <Icon path={sport.icon} size={1} className="mr-1" />
            {sport.name}
          </SidebarSportsBtn>
        ))}
      </div>
    </div>
  );
}
