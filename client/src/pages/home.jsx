import { useState } from "react";
import {
  useAuth,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";


const linkifyText = (text = "") => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
};

function Home() {
  const { getToken } = useAuth();
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("1-2 hours");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Unauthorized or backend error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      {/* 🔒 LOGGED OUT */}
      <SignedOut>
        <h2>Please login to generate a course</h2>
        <SignInButton mode="modal">
          <button style={{ marginTop: "20px" }}>Login</button>
        </SignInButton>
      </SignedOut>

      {/* 🔓 LOGGED IN */}
      <SignedIn>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <UserButton afterSignOutUrl="/" />
        </div>

        <h1>Create Your Course with AI</h1>

        <textarea
          placeholder="Describe your course (e.g. Python for beginners)"
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

        {result && (
          <div>
            <h2>AI Curriculum</h2>

            <div
              style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}
              dangerouslySetInnerHTML={{
                __html: linkifyText(result.curriculum || ""),
              }}
            />

            <h2 style={{ marginTop: "40px" }}>YouTube Videos</h2>

            {Array.isArray(result.videos) && result.videos.length > 0 ? (
              result.videos.map((v, index) => (
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
              ))
            ) : (
              <p>No videos found</p>
            )}
          </div>
        )}
      </SignedIn>
    </div>
  );
}

export default Home;
