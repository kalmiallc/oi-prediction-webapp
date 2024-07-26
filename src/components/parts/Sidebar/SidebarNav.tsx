import classNames from 'classnames';
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
  return (
    <div className={classNames(['flex flex-col h-full flex-grow justify-between', className])}>
      <div>
        <div className="mb-4">
          <SidebarNavBtn href="/predictions">My predictions</SidebarNavBtn>
        </div>
        {sports.map((sport, i) => (
          <SidebarNavBtn key={'sport-' + i} href={sport.link}>
            {sport.name}
          </SidebarNavBtn>
        ))}
      </div>
      <div className="mt-4">
        <SidebarNavBtn href="/faucet">Get OI Coins</SidebarNavBtn>
        <SidebarNavBtn href="/about">How it works</SidebarNavBtn>
      </div>
    </div>
  );
}
