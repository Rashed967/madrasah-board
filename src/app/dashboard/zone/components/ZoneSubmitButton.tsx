import { MdAdd } from 'react-icons/md';

interface ZoneSubmitButtonProps {
  isLoading: boolean;
}

export default function ZoneSubmitButton({ isLoading }: ZoneSubmitButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 bg-[#52B788] text-white rounded-md hover:bg-[#52B788]/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <MdAdd className="mr-2" />
        {isLoading ? 'লোড হচ্ছে...' : 'জোন যোগ করুন'}
      </button>
    </div>
  );
}
