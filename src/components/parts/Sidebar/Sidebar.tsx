import Icon from '@mdi/react';
import classNames from 'classnames';
import { mdiBasketball } from '@mdi/js';
import { useEffect, useMemo, useRef, useState } from 'react';
import SidebarSports from './SidebarSports';

export default function Sidebar() {
  return (
    <>
      {/* Desktop */}
      <aside
        style={{ transition: 'height 0.2s' }}
        className={classNames(['bg-zinc-800', 'hidden overflow-x-clip lg:block', 'min-w-[250px]'])}
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
