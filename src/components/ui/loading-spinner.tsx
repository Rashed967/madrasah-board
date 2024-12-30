export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin"></div>
      <p className="mt-4 text-emerald-600">লোড হচ্ছে...</p>
    </div>
  );
}
