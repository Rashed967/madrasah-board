import Link from 'next/link';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Link 
        href="/dashboard/zone/create-zone" 
        className="bg-[#52B788] text-white px-4 py-2 rounded-lg hover:bg-[#52B788]/90 transition-colors"
      >
        নতুন জোন যোগ করুন
      </Link>
    </div>
  );
};
