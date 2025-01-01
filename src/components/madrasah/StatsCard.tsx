import { IconType } from 'react-icons';

interface StatsCardProps {
  icon: IconType;
  label: string;
  value: number | null | undefined;
}

export function StatsCard({ icon: Icon, label, value }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <Icon className="text-2xl text-gray-600" />
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-[#52b788]">{value || '-'}</p>
        </div>
      </div>
    </div>
  );
}
