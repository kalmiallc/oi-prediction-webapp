import classNames from 'classnames';
import * as React from 'react';

export default function NumberInput({
  className,
  error,
  ...rest
}: React.ComponentPropsWithoutRef<'input'> & { error?: string } & ComponentProps) {
  return (
    <div className={className}>
      <input
        {...rest}
        type="number"
        placeholder="0"
        className={classNames([
          className,
          'outline-none',
          'block w-full rounded-md border-0 py-1.5 px-4 ',
          'ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset',
          'text-gray-900  sm:text-sm sm:leading-6',
        ])}
      />

      {!!error && <div className="text-red text-xs mt-1">{error}</div>}
    </div>
  );
}
