interface TotalCountProps {
  count: number;
}

export const TotalCount = ({ count }: TotalCountProps) => {
  return (
    <div className="mt-4 flex justify-between items-center">
      <div className="text-sm text-gray-700">
        মোট {count}টি জোন দেখাচ্ছে
      </div>
    </div>
  );
};
