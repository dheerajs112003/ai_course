export const generateCourse = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/course/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
