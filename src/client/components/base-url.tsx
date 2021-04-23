export function BaseUrl({ url }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden text-xs font-mono font-medium text-gray-300">
      <div className="uppercase px-4 py-2">base url</div>
      <p className="bg-gray-700 rounded-b font-light p-4 text-gray-300">
        {url}
      </p>
    </div>
  );
}
