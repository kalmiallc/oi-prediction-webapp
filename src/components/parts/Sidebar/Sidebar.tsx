import classNames from 'classnames';
import SidebarNav from './SidebarNav';
import Image from 'next/image';
import Link from 'next/link';
import { useGlobalContext } from '@/contexts/global';

export default function Sidebar() {
  const {
    state: { sidebarOpen },
  } = useGlobalContext();
  return (
    <>
      {/* Desktop */}
      <aside
        className={classNames([
          'bg-white',
          'shadow-[0_0_4px_0] shadow-black/25',
          'overflow-x-clip lg:flex py-6',
          'lg:min-w-[250px] max-h-[calc(100vh-100px)] min-h-[calc(100vh-100px)] h-full',
          'z-10 fixed lg:sticky top-[100px]',
          'flex-col justify-between overflow-auto',
          sidebarOpen ? 'min-w-[250px]' : '!w-0 min-w-0 ',
        ])}
        style={{ transition: 'min-width 250ms cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <SidebarNav />
        <Link href="https://kalmia.si/" target="_blank" className="block ml-12 mt-6">
          <Image src="/images/kalmia-logo.png" alt="Olympics Logo" height={12} width={122} />
          <p className="text-[9px] tracking-[3px]">Web3 Development</p>
        </Link>
      </aside>
    </>
  );
}
