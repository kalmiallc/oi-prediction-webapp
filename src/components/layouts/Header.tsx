import classNames from 'classnames';
import Logo from '/public/next.svg';

export default function Header() {
  return (
    <>
      <div
        className={classNames([
          'sticky -top-px z-10 flex w-full justify-between gap-4 border-b bg-gradient-to-b px-4 transition-all 2xl:px-10 h-[60px]',
          'from-zinc-700 to-zinc-800 ',
          'border-black/5 ',
        ])}
      >
        {/* Left Side */}
        <div className="flex items-center gap-3 xl:gap-8">
          <div>
            <Logo className="text-[60px] text-white" />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 xl:gap-2">
          <w3m-button balance={'hide'} />
        </div>
      </div>
    </>
  );
}
