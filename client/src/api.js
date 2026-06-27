const API_URL = import.meta.env.VITE_API_URL;

export const generateCourse = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/course/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};