interface InfoItemProps {
  label: string
  value: string | number
  subValue?: string
}

export default function InfoItem({ label, value, subValue }: InfoItemProps) {
  return (
    <div>
      <h5 className="font-semibold">{label}</h5>
      <p className="text-gray-700">{value}</p>
      {subValue && <p className="text-gray-500 text-sm">{subValue}</p>}
    </div>
  )
} 