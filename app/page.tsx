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
      const tokenRes = await fetch("/api/realtime-token", {
        method: "POST",
        cache: "no-store",
      });
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
          {isListening ? (
            <svg
              width="32"
              height="32"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.microphoneIcon}
            >
              <path
                d="M14.7058 9.04155C15.2351 9.19909 15.5365 9.75591 15.379 10.2852C14.4875 13.2804 11.8895 15.5417 8.71047 15.9381V17H10.2105C10.7628 17 11.2105 17.4477 11.2105 18C11.2105 18.5523 10.7628 19 10.2105 19H5.21047C4.65818 19 4.21047 18.5523 4.21047 18C4.21047 17.4477 4.65818 17 5.21047 17H6.71047V15.9381C3.53138 15.5418 0.933237 13.2805 0.0418092 10.2852C-0.11573 9.75591 0.185674 9.19909 0.715013 9.04155C1.24435 8.88401 1.80118 9.18541 1.95872 9.71475C2.69654 12.1939 4.99384 14 7.71038 14C10.4269 14 12.7242 12.1939 13.4621 9.71475C13.6196 9.18541 14.1764 8.88401 14.7058 9.04155Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.2104 8V4.5C10.2104 3.11929 9.09116 2 7.71045 2C6.32974 2 5.21045 3.11929 5.21045 4.5V8C5.21045 9.38071 6.32974 10.5 7.71045 10.5C9.09116 10.5 10.2104 9.38071 10.2104 8ZM7.71045 0C5.22517 0 3.21045 2.01472 3.21045 4.5V8C3.21045 10.4853 5.22517 12.5 7.71045 12.5C10.1957 12.5 12.2104 10.4853 12.2104 8V4.5C12.2104 2.01472 10.1957 0 7.71045 0Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              width="32"
              height="32"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.microphoneIcon}
            >
              <path
                d="M0.292734 0.792969C0.658857 0.426965 1.23789 0.404293 1.63063 0.724609L1.7068 0.792969L17.7068 16.793L17.7752 16.8691C18.0954 17.2619 18.0728 17.8409 17.7068 18.207C17.3407 18.5731 16.7617 18.5956 16.3689 18.2754L16.2927 18.207L12.9548 14.8691C12.0747 15.4174 11.0739 15.7901 9.99977 15.9336V17H11.4998C12.0519 17.0001 12.4998 17.4478 12.4998 18C12.4998 18.5522 12.0519 18.9999 11.4998 19H6.49977C5.94748 19 5.49977 18.5523 5.49977 18C5.49977 17.4477 5.94748 17 6.49977 17H7.99977V15.9336C4.90425 15.5213 2.40765 13.2211 1.70094 10.2295C1.57417 9.6921 1.90671 9.15331 2.4441 9.02637C2.98139 8.8998 3.52031 9.23322 3.64723 9.77051C4.22038 12.1958 6.40058 13.9999 8.99977 14C9.89577 13.9999 10.7407 13.7832 11.488 13.4023L10.3484 12.2627C9.92682 12.4143 9.47353 12.5 8.99977 12.5C6.79073 12.4999 4.99977 10.7091 4.99977 8.5V6.91406L0.292734 2.20703L0.224375 2.13086C-0.0959754 1.73809 -0.0733816 1.15908 0.292734 0.792969Z"
                fill="currentColor"
              />
              <path
                d="M14.3523 9.77051C14.4793 9.23323 15.0181 8.89973 15.5554 9.02637C16.0925 9.15345 16.4261 9.6923 16.2996 10.2295C16.1586 10.8264 15.9438 11.3954 15.6697 11.9277L14.157 10.415C14.2347 10.2059 14.3003 9.99077 14.3523 9.77051Z"
                fill="currentColor"
              />
              <path
                d="M8.99977 0C11.2087 0.000206889 12.9998 1.79099 12.9998 4V8.5C12.9998 8.73756 12.978 8.97011 12.9382 9.19629L5.61305 1.87109C6.32111 0.747114 7.57324 7.89196e-05 8.99977 0Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>
    </main>
  );
}
