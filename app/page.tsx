"use client";

import { useRef, useState, useEffect } from "react";
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";
import styles from "./page.module.css";

export default function Page() {
  const sessionRef = useRef<RealtimeSession | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Limpiar sesión al desmontar
    return () => {
      try {
        sessionRef.current?.close?.(); // ✅ método correcto
      } catch (e) {
        console.error(e);
      } finally {
        sessionRef.current = null;
      }
    };
  }, []);

  async function connect() {
    setStatus("connecting");
    setError(null);

    try {
      const tokenRes = await fetch("/api/realtime-token");
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData?.error ?? "Error al obtener token");

      const agent = new RealtimeAgent({
        name: "Assistant",
        instructions: "Eres un asistente útil. Responde en español, claro y directo.",
      });

      const session = new RealtimeSession(agent, { model: "gpt-realtime" });

      await session.connect({ apiKey: tokenData.value });
      sessionRef.current = session;

      setStatus("connected");
      setIsListening(true);
    } catch (e: any) {
      setStatus("error");
      setError(e?.message ?? "Error desconocido");
      setIsListening(false);
    }
  }

  function disconnect() {
    try {
      sessionRef.current?.close?.(); // ✅ método correcto
    } catch (e) {
      console.error("Error al desconectar:", e);
    } finally {
      sessionRef.current = null;
      setStatus("idle");
      setIsListening(false);
    }
  }

  const toggleMicrophone = () => {
    if (status === "connected") {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.circleWrapper}>
          <div
            className={`${styles.circle} ${isListening ? styles.pulsing : ""}`}
            aria-hidden="true"
          />
        </div>

        <div className={styles.statusContainer}>
          <p className={styles.statusText}>
            {status === "idle" && "Presiona el botón para comenzar"}
            {status === "connecting" && "Conectando..."}
            {status === "connected" && "Escuchando..."}
            {status === "error" && "Error de conexión"}
          </p>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        <button
          className={`${styles.microphoneButton} ${isListening ? styles.active : ""}`}
          onClick={toggleMicrophone}
          disabled={status === "connecting"}
          aria-label={isListening ? "Desactivar micrófono" : "Activar micrófono"}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.microphoneIcon}
          >
            {isListening ? (
              <path
                d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1ZM19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H7V12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12V10H19ZM12 21C13.1 21 14 21.9 14 23H10C10 21.9 10.9 21 12 21Z"
                fill="currentColor"
              />
            ) : (
              <path
                d="M12 14C13.1 14 14 13.1 14 12V4C14 2.9 13.1 2 12 2C10.9 2 10 2.9 10 4V12C10 13.1 10.9 14 12 14ZM16.3 12C16.3 15.3 13.6 18 10.3 18H9.7C6.4 18 3.7 15.3 3.7 12H5.7C5.7 14.2 7.5 16 9.7 16H10.3C12.5 16 14.3 14.2 14.3 12H16.3ZM19 10H17V12C17 15.9 13.9 19 10 19C6.1 19 3 15.9 3 12V10H1V12C1 16.97 5.03 21 10 21C14.97 21 19 16.97 19 12V10Z"
                fill="currentColor"
              />
            )}
          </svg>
        </button>
      </div>
    </main>
  );
}
