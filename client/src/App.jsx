import { useState } from "react";
import {
  useAuth,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import "./App.css";

/* ================= FORMAT CURRICULUM ================= */
const formatCurriculum = (text = "") => {
  if (!text) return "";

  let formatted = text;

  // clickable links
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+)/g,
    url => `
      <a href="${url}" target="_blank" rel="noopener noreferrer"
         style="color:#2563eb;font-weight:600;text-decoration:underline;">
        ${url}
      </a>
    `
  );

  // new line for numbers
  formatted = formatted.replace(/(\d+\.)/g, "<br/><br/><strong>$1</strong>");

  // space after dash points
  formatted = formatted.replace(/ - /g, "<br/>• ");

  return formatted;
};


function App() {
  const { getToken } = useAuth();

  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("1-2 hours");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===== CHAT STATES ===== */
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [question, setQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  /* ================= GENERATE COURSE ================= */
  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please enter a course description");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = await getToken();

      const res = await fetch("http://localhost:5000/api/course/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, level, duration }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Unauthorized or backend error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= AI CHAT ================= */
  const handleAsk = async () => {
    if (!question.trim()) return alert("Ask a question first!");

    setChatLoading(true);
    setChatAnswer("");

    const token = await getToken();
    const formData = new FormData();

    if (file) formData.append("file", file);
    if (link) formData.append("link", link);
    formData.append("question", question);

    try {
      const res = await fetch("http://localhost:5000/api/course/ask", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      setChatAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setChatAnswer("Failed to get answer");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      {/* LOGGED OUT */}
      <SignedOut>
        <h2>Please login to generate a course</h2>
        <SignInButton mode="modal">
          <button style={{ marginTop: "20px" }}>Login</button>
        </SignInButton>
      </SignedOut>

      {/* LOGGED IN */}
      <SignedIn>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UserButton afterSignOutUrl="/" />
        </div>

        <h1 style={{ textAlign: "center" }}>Create Your Course with AI</h1>

        <textarea
          placeholder="Describe your course (e.g. Java inheritance)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", height: "100px" }}
        />

        <br /><br />

        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option>1-2 hours</option>
          <option>3-5 hours</option>
          <option>10+ hours</option>
        </select>

        <br /><br />

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Course"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* ================= AI CURRICULUM ================= */}
        {result && (
          <div style={{ marginTop: "40px" }}>
            <h2>AI Curriculum</h2>

            <div
              style={{ lineHeight: "1.9" }}
              dangerouslySetInnerHTML={{
                __html: formatCurriculum(result.curriculum),
              }}
            />

            {/* ================= YOUTUBE ================= */}
            <h2 style={{ marginTop: "50px" }}>YouTube Videos</h2>

            {result.videos?.map((v, index) => (
              <div key={index} style={{ marginBottom: "40px" }}>
                <h4>{v.title}</h4>

                <a
                  href={`https://www.youtube.com/watch?v=${v.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  ▶ Watch on YouTube
                </a>

                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${v.videoId}`}
                  title={v.title}
                  frameBorder="0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            ))}

            {/* ================= AI CHAT BOX ================= */}
            <h2 style={{ marginTop: "60px" }}>
              Ask Questions from Files or Links
            </h2>

            <div
              style={{
                border: "2px dashed #999",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />

              <p style={{ margin: "10px 0" }}>or paste a link</p>

              <input
                type="text"
                placeholder="Paste article or docs link here"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <textarea
              placeholder="Ask your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: "100%", height: "80px" }}
            />

            <br /><br />

            <button onClick={handleAsk} disabled={chatLoading}>
              {chatLoading ? "Thinking..." : "Ask AI"}
            </button>

            {chatAnswer && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  lineHeight: "1.8",
                }}
              >
                <strong>AI Answer:</strong>
                <p>{chatAnswer}</p>
              </div>
            )}
          </div>
        )}
      </SignedIn>
    </div>
  );
}

export default App;
