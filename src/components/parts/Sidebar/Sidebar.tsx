import classNames from 'classnames';
import SidebarNav from './SidebarNav';
import SidebarNavBtn from './SidebarNavBtn';
import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <>
      {/* Desktop */}
      <aside
        style={{ transition: 'height 0.2s' }}
        className={classNames([
          'bg-white',
          'shadow-[0_0_4px_0] shadow-black/25',
          'hidden overflow-x-clip lg:flex py-6',
          'min-w-[250px] min-h-[calc(100vh-100px)] h-full',
          'sticky top-[100px]',
          'flex-col justify-between',
        ])}
      >
        <div>
          <SidebarNav />
        </div>
        <div>
          <SidebarNavBtn href="/">How it works</SidebarNavBtn>
          <Link href="https://kalmia.si/" target="_blank" className=" block pl-12 pt-10">
            <Image
              src="/images/kalmia-logo.png"
              alt="Olympics Logo"
              height={12}
              width={122}
              className="hidden md:block"
            />
            <p className="text-[9px] tracking-[3px]">Web3 Development</p>
          </Link>
        </div>
      </aside>
    </>
  );
}
