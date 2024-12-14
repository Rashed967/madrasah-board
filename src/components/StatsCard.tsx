interface StatsCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
}

export default function StatsCard({ icon, value, label }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="text-gray-500">{icon}</div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}
