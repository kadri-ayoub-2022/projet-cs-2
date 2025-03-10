export default function Title({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-bold text-2xl text-text-primary">{title}</h2>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}