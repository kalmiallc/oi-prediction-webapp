import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@mui/material';
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <>
      <div
        className={classNames([
          'sticky top-0 z-10 flex w-full justify-between gap-4 px-4 transition-all 2xl:px-8',
          'h-[100px]',
          'bg-white',
          'shadow-[0_4px_4px_0] shadow-black/25',
        ])}
      >
        {/* Left Side */}
        <div className="flex items-center gap-3 xl:gap-8 ">
          <Button className="lg:hidden">
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
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 xl:gap-2">
          <ConnectButton />
        </div>
      </div>
    </>
  );
}
