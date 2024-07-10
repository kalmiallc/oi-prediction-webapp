import { Toaster } from 'sonner';
import Sidebar from '../parts/Sidebar/Sidebar';
import Header from './Header';
import classNames from 'classnames';
import Head from 'next/head';

export default function BaseLayout({ children, className }: ComponentProps) {
  return (
    <>
      <Toaster richColors expand />
      <div id="base-layout" className={className}>
        <Header />

        <div className="relative flex h-full overflow-x-clip overflow-y-visible">
          <Sidebar />
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
