"use client";

/**
 * Speech Service: Web Speech API text-to-speech abstraction
 * Provides clean narration synchronization with lesson step progression.
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakNarration(
  text: string,
  onEnd?: () => void,
  rate = 0.95,
  pitch = 1.0
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  cancelSpeech();

  if (!text || text.trim() === "") return;

  try {
    const cleanText = text
      .replace(/\\\[.*?\\\]/g, "equation")
      .replace(/\\\((.*?)\\\)/g, "$1")
      .replace(/\$+(.*?)\$+/g, "$1")
      .replace(/[*_#`]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("Premium"))
    );

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    if (onEnd) {
      utterance.onend = () => {
        currentUtterance = null;
        onEnd();
      };
    }

    utterance.onerror = () => {
      currentUtterance = null;
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis unavailable:", err);
  }
}

export function cancelSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    } catch (e) {}
  }
}

export function isSpeechSpeaking(): boolean {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
