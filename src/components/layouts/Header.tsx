import classNames from 'classnames';
import Logo from '/public/next.svg';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      <div
        className={classNames([
          'sticky -top-px z-10 flex w-full justify-between gap-4 border-b px-4 transition-all 2xl:px-10',
          'h-[60px]',
          'bg-white',
          'border-black/5 ',
        ])}
      >
        {/* Left Side */}
        <div className="flex items-center gap-3 xl:gap-8">
          <Link href={'/'}>
            <Logo className="text-[60px] text-primary" />
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 xl:gap-2">
          <w3m-button />
        </div>
      </div>
    </>
  );
}
