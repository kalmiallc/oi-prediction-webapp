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
        id="price"
        name="price"
        type="number"
        placeholder="0.00"
        className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
      />

      {!!error && <div className="text-red-600 text-xs mt-1">{error}</div>}
    </div>
  );
}
