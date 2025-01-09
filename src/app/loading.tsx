export default function Loading() {
  return (
    <div className="min-h-screen bg-[#EDEDE9] flex items-center justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-12 bg-gray-300 rounded-full mx-auto"></div>
        <div className="h-4 w-32 bg-gray-300 rounded mx-auto"></div>
      </div>
    </div>
  );
}
