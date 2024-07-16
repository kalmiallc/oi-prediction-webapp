import classNames from 'classnames';
import React from 'react';
import { Sports, sportsNames } from '@/lib/values';
import SidebarNavBtn from './SidebarNavBtn';

export default function SidebarNav({ className }: ComponentProps) {
  const sports = [
    {
      name: sportsNames[Sports.Basketball],
      link: '/basketball',
    },
    {
      name: sportsNames[Sports.Basketball3x3],
      link: '/basketball3x3',
    },
    {
      name: sportsNames[Sports.FieldHockey],
      link: '/fieldhockey',
    },
    {
      name: sportsNames[Sports.Football],
      link: '/football',
    },
    {
      name: sportsNames[Sports.Handball],
      link: '/handball',
    },
    {
      name: sportsNames[Sports.Volleyball],
      link: '/volleyball',
    },
    {
      name: sportsNames[Sports.WaterPolo],
      link: '/waterpolo',
    },
  ];
  const isAdmin = true;
  return (
    <div className={classNames(['overflow-y-auto overflow-x-hidden break-words', className])}>
      <div>
        <div className="mb-4">
          <SidebarNavBtn href="/bets">My bets</SidebarNavBtn>
          {isAdmin && <SidebarNavBtn href="/bets/admin">All bets</SidebarNavBtn>}
        </div>
        {sports.map((sport, i) => (
          <SidebarNavBtn key={'sport-' + i} href={sport.link}>
            {sport.name}
          </SidebarNavBtn>
        ))}
      </div>
    </div>
  );
}
