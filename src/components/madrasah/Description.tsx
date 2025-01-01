interface DescriptionProps {
  text: string | null | undefined;
}

export function Description({ text }: DescriptionProps) {
  if (!text) return null;
  
  return (
    <div className="p-4 text-center">
      <p className="text-gray-600 max-w-2xl mx-auto">{text || '-'}</p>
    </div>
  );
}
