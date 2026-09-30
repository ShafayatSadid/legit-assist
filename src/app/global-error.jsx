// app/global-error.jsx
"use client";

export default function GlobalError({ error, reset }) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    fontFamily: "system-ui, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    background: "#F8FAFC",
                    color: "#172033",
                }}
            >
                <div style={{ textAlign: "center", padding: "2rem" }}>
                    <h1
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            marginBottom: "0.5rem",
                        }}
                    >
                        Application error
                    </h1>
                    <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>
                        A critical error occurred. Please try again.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            background: "#0F2747",
                            color: "white",
                            border: "none",
                            padding: "0.6rem 1.5rem",
                            borderRadius: "0.5rem",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}