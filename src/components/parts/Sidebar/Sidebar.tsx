import classNames from 'classnames';
import SidebarSports from './SidebarSports';

export default function Sidebar() {
  return (
    <>
      {/* Desktop */}
      <aside
        style={{ transition: 'height 0.2s' }}
        className={classNames([
          'bg-white',
          'shadow-[0_0_4px_0] shadow-black/25',
          'hidden overflow-x-clip lg:block py-6',
          'min-w-[250px] min-h-[calc(100vh-100px)]',
          'sticky top-[100px]',
        ])}
      >
        <div style={{ transition: 'width 150ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <div>
            <SidebarSports />
          </div>
        </div>
      </aside>
    </>
  );
}
