// src/components/VoiceInput.js
import React, { useEffect, useState } from "react";

// 🌍 Supported Languages
const LANGUAGES = {
  "English (US)": "en-US",
  "English (India)": "en-IN",
  "Hindi (India)": "hi-IN",
  "Spanish (Spain)": "es-ES",
  "French (France)": "fr-FR",
  "German (Germany)": "de-DE",
};

function VoiceInput({ onVoiceCommand, onListeningChange, defaultLanguage = "en-US" }) {
  const [heard, setHeard] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [language, setLanguage] = useState(defaultLanguage);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = false; // stop after one phrase
    recog.interimResults = true;
    recog.lang = language;

    // 🎙️ Handle results
    recog.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;

        // ✅ Fire instantly when final
        if (event.results[i].isFinal) {
          const finalText = transcript.trim();
          if (finalText) {
            onVoiceCommand(finalText);
          }
          setHeard(""); // reset after firing
        }
      }
      setHeard(transcript); // show live transcript
    };

    recog.onend = () => {
      setListening(false);
      onListeningChange(false);
    };

    setRecognition(recog);
  }, [language, onVoiceCommand, onListeningChange]);

  const toggleListening = () => {
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
      onListeningChange(false);
    } else {
      recognition.lang = language;
      recognition.start();
      setListening(true);
      onListeningChange(true);
    }
  };

  return (
    <div className="voice-bar">
      {/* 🌍 Language Dropdown */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="lang-select"
      >
        {Object.entries(LANGUAGES).map(([label, code]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>

      {/* 🎙️ Mic Button */}
      <button
        className={`mic-btn ${listening ? "mic-on" : ""}`}
        onClick={toggleListening}
      >
        🎙️
      </button>

      {/* Transcript */}
      <div className="transcript">
        <div className="transcript-label">
          {listening ? "Listening..." : "Tap mic to start"}
        </div>
        <div className="transcript-text">{heard}</div>
      </div>
    </div>
  );
}

export default VoiceInput;
