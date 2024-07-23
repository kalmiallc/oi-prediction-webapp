import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@mui/material';
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useGlobalContext } from '@/contexts/global';
import Balance from '../parts/Balance';

export default function Header() {
  const { dispatch } = useGlobalContext();
  return (
    <>
      <div
        className={classNames([
          'sticky top-0 z-[11] flex w-full justify-between gap-4 px-4 transition-all 2xl:px-8',
          'h-[100px]',
          'bg-white',
          'shadow-[0_4px_4px_0] shadow-black/25',
        ])}
      >
        {/* Left Side */}
        <div className="flex items-center gap-3 xl:gap-8 ">
          <Button className="lg:hidden" onClick={() => dispatch({ type: 'switchSidebarOpen' })}>
            <Icon path={mdiMenu}></Icon>
          </Button>
          <Link href={'https://flare.network/'} target="_blank" className="hidden md:block">
            <Image src="/images/logo.png" alt="Flare Logo" height={35} width={101} />
          </Link>
          <Image
            src="/images/olympics-logo.png"
            alt="Olympics Logo"
            height={80}
            width={80}
            className="hidden md:block"
          />
          <h1 className="typo-h2 hidden md:block">2024 Olypmics Prediction Market</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <Balance />
          <div className="connectButton">
            <ConnectButton
              showBalance={false}
              label="Connect"
              accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
