import React, { useEffect, useRef } from "react";

export default function StatusToast({ message, type = "info", onClose, duration = 1800 }) {
  const t = useRef(null);
  useEffect(() => { if (!message) return; t.current = setTimeout(() => onClose?.(), duration); return () => clearTimeout(t.current); }, [message, duration, onClose]);
  if (!message) return null;
  return <div className={`toast toast-${type}`} role="status" aria-live="polite">{message}</div>;
}
