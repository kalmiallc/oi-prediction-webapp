import Header from './Header';
import classNames from 'classnames';

export default function BaseLayout({ children, className }: ComponentProps) {
  return (
    <>
      <div id="base-layout" className={className}>
        <Header />

        <div className="relative flex h-full overflow-x-clip overflow-y-visible">
          <main
            className={classNames([
              'min-h-[calc(100vh-60px)] min-w-0 flex-auto px-4 py-5 lg:py-8 2xl:px-10',
            ])}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
