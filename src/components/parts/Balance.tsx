import classNames from 'classnames';
import { useGlobalContext } from '@/contexts/global';

export default function Balance({ className }: ComponentProps) {
  const {
    state: { balance },
  } = useGlobalContext();
  return (
    <div className={classNames(['font-bold', className])}>
      {'Balance: '}
      {balance}
      {' OI'}
    </div>
  );
}
