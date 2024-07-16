import React from 'react';
import { Button, CircularProgress, Dialog } from '@mui/material';

export default function Modal({
  className,
  children,
  isOpen,
  title,
  isLoading,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  title: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
} & ComponentProps) {
  return (
    <Dialog open={isOpen} onClose={() => onClose?.()} className={className}>
      <div className="p-2.5 min-w-[min(300px,80vw)] ">
        <div className="px-4 pt-2 text-center">
          <h1 className="mb-4 font-bold">{title}</h1>
          {children}
        </div>
        <div className="flex mt-4 gap-2.5">
          <Button disabled={isLoading} variant="outlined" className="w-full" onClick={onClose}>
            {isLoading && <CircularProgress size={12} className="absolute" />}
            Cancel
          </Button>
          <Button disabled={isLoading} variant="contained" className="w-full" onClick={onConfirm}>
            {isLoading && <CircularProgress size={12} className="absolute" />}
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
