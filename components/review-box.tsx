"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useStore } from "@/lib/store";

type Gate = {
  eligible: boolean;
  waiting: boolean;
  size: string | null;
  color: string | null;
  review: { rating: number; text: string; fit: string; heightCm: number | null } | null;
};

const FITS = ["Smaller than expected", "As described", "Larger than expected"];

export function ReviewBox({ slug, onPublished }: { slug: string; onPublished?: (text: string) => void }) {
  const { user, ready, submitReview } = useStore();
  const [gate, setGate] = useState<Gate | null>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [fit, setFit] = useState("As described");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [pop, setPop] = useState(0);

  useEffect(() => {
    if (!ready || !user) {
      setGate(null);
      return;
    }
    let cancelled = false;
    api<Gate>(`/catalog/${slug}/review`)
      .then((result) => {
        if (cancelled) return;
        setGate(result);
        if (result.review) {
          setRating(result.review.rating);
          setText(result.review.text);
          setFit(result.review.fit || "As described");
        }
      })
      .catch(() => {
        if (!cancelled) setGate(null);
      });
    return () => {
      cancelled = true;
    };
  }, [ready, user, slug]);

  if (!user || !gate) return null;
  if (!gate.eligible) {
    return gate.waiting ? <p className="mt-3 text-sm text-muted">You can review this piece after it is delivered.</p> : null;
  }

  async function publish(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setNote(null);
    const message = await submitReview(slug, { rating, text, fit });
    setBusy(false);
    if (message) {
      setNote(message);
      return;
    }
    setGate((current) => (current ? { ...current, review: { rating, text, fit, heightCm: null } } : current));
    setSent(true);
    setNote("Your review is on the piece.");
    onPublished?.(text);
    window.setTimeout(() => setSent(false), 1400);
  }

  return (
    <form onSubmit={publish} className="mt-4 border border-line bg-paper p-4">
      <p className="text-sm">
        You received {gate.color}, {gate.size}.
      </p>
      <div className="mt-3 flex gap-1" role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
            aria-pressed={star <= rating}
            onClick={() => {
              setRating(star);
              setPop(star);
            }}
            onAnimationEnd={() => setPop((current) => (current === star ? 0 : current))}
            className={`h-9 w-9 border text-sm ${star <= rating ? "border-ink bg-ink text-cream" : "border-line bg-cream"} ${pop === star ? "star-pop" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      <label className="mt-4 block text-sm" htmlFor="review-text">
        Your review
      </label>
      <textarea
        id="review-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        maxLength={400}
        className="mt-2 w-full border border-line bg-cream px-3 py-2 text-sm outline-none"
      />
      <p className="mt-4 text-sm">How does it compare with the dimensions?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {FITS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFit(option)}
            className={`h-10 border px-3 text-sm ${option === fit ? "border-ink bg-ink text-cream" : "border-line bg-cream"}`}
          >
            {option}
          </button>
        ))}
      </div>
      <button type="submit" disabled={busy || rating < 1} className={`motion-btn relative mt-4 h-11 border border-ink px-4 text-xs tracking-[0.14em] disabled:text-muted ${sent ? "done" : ""}`}>
        <span className="lbl">{gate.review ? "UPDATE REVIEW" : "PUBLISH REVIEW"}</span>
        <span className="tick" aria-hidden="true">
          ✓
        </span>
      </button>
      {note && (
        <p className="note-in mt-3 flex items-center gap-2 text-sm text-muted">
          {sent && (
            <svg width="18" height="18" viewBox="0 0 18 18" className="text-olive" aria-hidden="true">
              <circle className="draw-ring draw-ring-sm" cx="9" cy="9" r="7" />
              <path className="draw-check draw-check-sm" d="M5.5 9.2 8 11.6 12.6 6.4" />
            </svg>
          )}
          {note}
        </p>
      )}
    </form>
  );
}
