import { useState, useEffect } from "react";

import { API_URL } from "./config";

export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setPage("dashboard");
    }
  }, []);

  return (
    <div style={bg}>
      <Navbar setPage={setPage} />

      {page === "home" && <Home setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "signup" && <Signup setPage={setPage} />}
      {page === "dashboard" && <Dashboard setPage={setPage} />}
    </div>
  );
}

/* ---------------- NAVBAR ---------------- */

function Navbar({ setPage }) {
  return (
    <div style={nav}>
      <h1 style={logo}>ReplyAstra</h1>

      <div>
        <button style={navBtn} onClick={() => setPage("home")}>
          Home
        </button>

        {!localStorage.getItem("token") && (
          <>
            <button style={navBtn} onClick={() => setPage("login")}>
              Login
            </button>

            <button style={signupBtn} onClick={() => setPage("signup")}>
              Sign Up
            </button>
          </>
        )}

        {localStorage.getItem("token") && (
          <button
            style={signupBtn}
            onClick={() => {
              localStorage.removeItem("token");
              setPage("login");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- HOME ---------------- */

function Home({ setPage }) {
  return (
    <div style={home}>
      <h2 style={heroTitle}>Automate Instagram DMs 🚀</h2>
      <p style={heroSub}>
        Convert followers into customers automatically
      </p>

      <button style={cta} onClick={() => setPage("signup")}>
        Get Started Free
      </button>
    </div>
  );
}

/* ---------------- LOGIN ---------------- */

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin() {
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setPage("dashboard");
      } else {
        setMsg(data.msg || "Login failed");
      }
    } catch {
      setMsg("Server error");
    }
  }

  return (
    <div style={card}>
      <h3 style={cardTitle}>Welcome Back 👋</h3>

      <input
        placeholder="Email"
        style={input}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        style={input}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={mainBtn} onClick={handleLogin}>
        Login
      </button>

      <p style={link} onClick={() => setPage("signup")}>
        Don't have account? Sign up
      </p>

      {msg && <p style={error}>{msg}</p>}
    </div>
  );
}

/* ---------------- SIGNUP ---------------- */

function Signup({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSignup() {
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      setMsg(data.msg);

      if (data.msg?.includes("success")) {
        setTimeout(() => setPage("login"), 1500);
      }
    } catch {
      setMsg("Server error");
    }
  }

  return (
    <div style={card}>
      <h3 style={cardTitle}>Create Account 🚀</h3>

      <input
        placeholder="Email"
        style={input}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        style={input}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={mainBtn} onClick={handleSignup}>
        Sign Up
      </button>

      <p style={link} onClick={() => setPage("login")}>
        Already have account? Login
      </p>

      {msg && <p style={success}>{msg}</p>}
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard() {
  const [trigger, setTrigger] = useState("");
  const [reply, setReply] = useState("");
  const [rules, setRules] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch rules on load
  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    const res = await fetch(`${API_URL}/api/rules`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setRules(data);
  }

  async function saveRule() {
    if (!trigger || !reply) return alert("Fill all fields");

    const res = await fetch(`${API_URL}/api/rules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ trigger, reply })
    });

    const data = await res.json();

    alert(data.msg);
    setTrigger("");
    setReply("");
    fetchRules();
  }

  return (
    <div style={dash}>
      <h2 style={dashTitle}>Dashboard</h2>

      <div style={dashCard}>
        <h3>Create Automation</h3>

        <input
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="Trigger word"
          style={input}
        />

        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Auto reply"
          style={{ ...input, height: 80 }}
        />

        <button style={saveBtn} onClick={saveRule}>
          Save Rule
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Saved Rules</h3>

        {rules.map((r, i) => (
          <div key={i} style={rule}>
            <p><b>Trigger:</b> {r.trigger}</p>
            <p><b>Reply:</b> {r.reply}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ---------------- STYLES ---------------- */

const bg = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#667eea,#764ba2)"
};

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: 20,
  background: "#fff"
};

const logo = { fontSize: 24, fontWeight: "bold", color: "#667eea" };

const navBtn = { marginRight: 10, background: "none", border: "none", cursor: "pointer" };

const signupBtn = {
  background: "#667eea",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 5,
  cursor: "pointer"
};

const home = { textAlign: "center", padding: 120, color: "#fff" };
const heroTitle = { fontSize: 48, fontWeight: "bold" };
const heroSub = { marginTop: 10 };

const cta = {
  marginTop: 40,
  padding: "14px 32px",
  border: "none",
  borderRadius: 8,
  fontSize: 18,
  cursor: "pointer"
};

const card = {
  maxWidth: 400,
  margin: "80px auto",
  background: "#fff",
  padding: 30,
  borderRadius: 10
};

const cardTitle = { fontSize: 22, marginBottom: 20 };

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 15,
  borderRadius: 5,
  border: "1px solid #ddd"
};

const mainBtn = {
  width: "100%",
  padding: 12,
  background: "#667eea",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  cursor: "pointer"
};

const link = {
  marginTop: 15,
  color: "#667eea",
  cursor: "pointer",
  textAlign: "center"
};

const error = { color: "red", marginTop: 10 };
const success = { color: "green", marginTop: 10 };

const dash = { padding: 40, color: "#fff" };
const dashTitle = { fontSize: 32 };

const dashCard = {
  background: "#fff",
  padding: 25,
  borderRadius: 10,
  color: "#333",
  maxWidth: 500
};

const saveBtn = {
  padding: "10px 20px",
  background: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  cursor: "pointer"
};

const rule = {
  background: "#fff",
  padding: 15,
  borderRadius: 5,
  marginTop: 10,
  color: "#333"
};
