import classNames from 'classnames';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';
import { Button } from '@mui/material';
import Link from 'next/link';

export default function SidebarSportsBtn({
  href,
  disableActive = false,
  activeClass = '!font-bold !bg-[#fb6f00]/10',
  onClick,
  children,
}: {
  href: string | UrlObject | any;
  disableActive?: boolean;
  activeClass?: string;
  onClick?: () => void;
} & ComponentProps) {
  const router = useRouter();

  const isActive = router.query?.sport === href;

  return (
    <Button
      component={Link}
      href={href}
      className={classNames([
        '!flex w-full !my-2 !py-2 ',
        {
          [activeClass]: isActive && !disableActive,
        },
      ])}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
