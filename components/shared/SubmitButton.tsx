import React from 'react';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  loading?: boolean;
  loadingText?: string;
  clickFn?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SubmitButton = ({
  type = 'submit',
  isLoading,
  loading,
  loadingText,
  className,
  clickFn,
  children,
  disabled,
  ...props
}: SubmitButtonProps) => {
  return (
    <Button
      type={type}
      disabled={isLoading || loading || disabled}
      className={cn(
        'cursor-pointer text-primary-foreground bg-primary h-11  rounded-md mt-2 text-sm font-regular hover:bg-primary/90',
        className,
      )}
      onClick={clickFn}
      {...props}
    >
      {isLoading || loading ? (
        <div className="flex items-center gap-4">
          <Loader className="inline-block ml-2 animate-spin" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;