interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ className = '', size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-gray-900 ${sizeClasses[size]} ${className}`}
      />
    </div>
  );
}
