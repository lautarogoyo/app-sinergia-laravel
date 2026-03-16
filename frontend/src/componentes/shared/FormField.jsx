export default function FormField({ label, id, error, children }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 text-lg font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="text-red-600 text-sm font-semibold mt-1">{error}</p>}
    </div>
  );
}