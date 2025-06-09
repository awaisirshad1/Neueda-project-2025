"use client";

import { useState } from "react";

export function MortgageChatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          loanAmount: "500000",
          termYears: "30",
          interestRate: "3.5",
          downPayment: "100000",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setAnswer(data.answer);
    } catch (err: any) {
      setAnswer("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 md:mt-16 border rounded-2xl p-6 shadow-md bg-background">
      <h2 className="text-2xl font-bold mb-4">Ask MortgageMoose 🦌</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded-md resize-none text-sm"
          rows={3}
          placeholder="Ask me anything about mortgages..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading || question.trim() === ""}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          {loading ? "Thinking..." : "Ask Moose"}
        </button>
      </form>
      {answer && (
        <div className="mt-6 p-4 border rounded-md bg-muted text-sm whitespace-pre-line">
          <strong>Moose says:</strong> {answer}
        </div>
      )}
    </section>
  );
}
