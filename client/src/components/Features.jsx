export default function Features() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-2">Smart Curriculum</h3>
        <p className="text-gray-500 text-sm">
          AI structures your course into lessons and modules.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-2">Content Analysis</h3>
        <p className="text-gray-500 text-sm">
          Extracts key topics from your materials.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-2">Instant Results</h3>
        <p className="text-gray-500 text-sm">
          Generate a complete course in minutes.
        </p>
      </div>
    </div>
  );
}
