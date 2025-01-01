import { IconType } from 'react-icons';

interface InfoCardProps {
  icon: IconType;
  label: string;
  value: string | number | null | undefined;
}

export function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="text-2xl text-gray-600" />
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium">{value || '-'}</p>
      </div>
    </div>
  );
}
