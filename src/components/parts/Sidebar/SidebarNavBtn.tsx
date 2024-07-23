import classNames from 'classnames';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useGlobalContext } from '@/contexts/global';

export default function SidebarNavBtn({
  className,
  href,
  disableActive = false,
  activeClass = '!text-primary font-bold',
  children,
}: {
  href: string;
  disableActive?: boolean;
  activeClass?: string;
} & ComponentProps) {
  const router = useRouter();
  const { dispatch } = useGlobalContext();

  const pathWithoutQuery = router.asPath.replace(/\/*\?.*$/, '');
  const isActive = pathWithoutQuery.replaceAll('/', '') === href.replaceAll('/', '');

  return (
    <Button
      component={Link}
      href={href}
      className={classNames([
        className,
        'flex text-black py-2 pl-12 normal-case text-xl justify-start',
        {
          [activeClass]: isActive && !disableActive,
        },
      ])}
      onClick={() => dispatch({ type: 'setSidebarOpen', payload: false })}
    >
      {children}
    </Button>
  );
}
