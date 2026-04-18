export default function CourseForm() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md mb-12">
      <h2 className="text-3xl font-bold text-center mb-2">
        Create Your Course with AI
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Describe your course idea and let AI generate a curriculum
      </p>

      <label className="block font-medium mb-2">Describe Your Course</label>
      <textarea
        rows="5"
        className="w-full border rounded-lg p-3 mb-6"
        placeholder="Enter course topic, goals, and audience..."
      />

      <label className="block font-medium mb-2">Upload Materials</label>
      <div className="border-2 border-dashed rounded-lg p-6 text-center mb-6">
        Drag & drop files here or click to browse
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <select className="border rounded-lg p-2">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <select className="border rounded-lg p-2">
          <option>1–2 hours</option>
          <option>3–5 hours</option>
          <option>5+ hours</option>
        </select>
      </div>

      <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
        Generate Course
      </button>
    </div>
  );
}
