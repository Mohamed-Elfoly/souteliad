export default function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-gray-50">
      <td className="px-3 py-3 w-9"><div className="h-4 w-4 bg-gray-200 rounded" /></td>
      <td className="px-3 py-3 w-8"><div className="h-3.5 w-4 bg-gray-200 rounded" /></td>
      <td className="px-3 py-3"><div className="h-3.5 w-32 bg-gray-200 rounded" /></td>
      <td className="px-3 py-3 hidden lg:table-cell"><div className="h-3.5 w-16 bg-gray-200 rounded" /></td>
      <td className="px-3 py-3 hidden md:table-cell"><div className="h-3.5 w-20 bg-gray-200 rounded" /></td>
      <td className="px-3 py-3 hidden xl:table-cell"><div className="h-3.5 w-16 bg-gray-200 rounded" /></td>
      <td className="px-3 py-3 hidden sm:table-cell"><div className="h-3.5 w-20 bg-gray-200 rounded" /></td>
      <td className="px-3 py-3"><div className="h-8 w-24 bg-gray-200 rounded-2xl" /></td>
    </tr>
  ));
}