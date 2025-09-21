"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"

export default function Home() {
  const [text, setText] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const [obligations, setObligations] = useState([])
  const [risks, setRisks] = useState([])
  const [benefits, setBenefits] = useState([])

  async function handleSimplify() {
    if (!text.trim() && !file) return alert("Paste legal text or upload a file first")

    setLoading(true)
    setSummary("")
    setObligations([])
    setRisks([])
    setBenefits([])

    try {
      let response
      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        response = await fetch("/api/simplify", {
          method: "POST",
          body: formData,
        })
      } else {
        response = await fetch("/api/simplify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ legalText: text }),
        })
      }

      const data = await response.json()
      setSummary(data.summary || "")
      setObligations(Array.isArray(data.obligations) ? data.obligations : [])
      setRisks(Array.isArray(data.risks) ? data.risks : [])
      setBenefits(Array.isArray(data.benefits) ? data.benefits : data.benefits ? [data.benefits] : [])
    } catch (err) {
      console.error("Error:", err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function handleFile(e) {
    const uploaded = e.target.files?.[0]
    if (!uploaded) return

    setFile(uploaded)
    setText("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <Navbar />
      </div>

      {/* HERO SECTION */}
      <section className="gradient-hero py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Simplify Legal Documents with <span className="text-primary">AI Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Transform complex legal jargon into clear, actionable insights. Understand your rights, obligations, and
              risks in plain English.
            </p>
          </div>

          {/* MAIN INTERFACE */}
          <div className="max-w-5xl mx-auto">
            <div className="glass-card rounded-2xl p-8 shadow-2xl animate-slideInUp">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* LEFT - INFO */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">Why Legal Clarity Matters</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Legal documents are filled with complex terminology that can hide important details. Our AI breaks
                      down these barriers, giving you the confidence to make informed decisions about contracts,
                      agreements, and legal obligations.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-secondary/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">99%</div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">5s</div>
                      <div className="text-sm text-muted-foreground">Analysis</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">24/7</div>
                      <div className="text-sm text-muted-foreground">Available</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT - INPUT */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Legal Document Input</label>
                    <textarea
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value)
                        setFile(null)
                      }}
                      rows={8}
                      className="w-full p-4 rounded-xl bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 custom-scrollbar resize-none"
                      placeholder="Paste your contract, terms of service, privacy policy, or any legal document here..."
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200">
                        <svg
                          className="w-5 h-5 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm font-medium text-foreground">
                          {file ? `Selected: ${file.name}` : "Upload PDF, DOC, or DOCX"}
                        </span>
                      </div>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
                    </label>

                    <button
                      onClick={handleSimplify}
                      disabled={loading}
                      className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 animate-pulse-glow"
                    >
                      {loading && (
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path className="opacity-75" d="M4 12a8 8 0 018-8v8z" fill="currentColor" />
                        </svg>
                      )}
                      <span>{loading ? "Analyzing..." : "Analyze Document"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="gradient-card rounded-2xl p-8 shadow-xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Document Analysis</h2>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                  <p className="text-muted-foreground">Analyzing your document with AI...</p>
                </div>
              </div>
            )}

            {!loading && summary && (
              <div className="space-y-6">
                <div className="bg-secondary/30 rounded-xl p-6 border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Executive Summary</h3>
                  <p className="text-foreground leading-relaxed">{summary}</p>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      key: "obligations",
                      label: "Your Obligations",
                      items: obligations,
                      icon: "⚖️",
                      color: "bg-amber-50 border-amber-200 text-amber-800",
                    },
                    {
                      key: "risks",
                      label: "Potential Risks",
                      items: risks,
                      icon: "⚠️",
                      color: "bg-red-50 border-red-200 text-red-800",
                    },
                    {
                      key: "benefits",
                      label: "Key Benefits",
                      items: benefits,
                      icon: "✅",
                      color: "bg-green-50 border-green-200 text-green-800",
                    },
                  ].map(({ key, label, items, icon, color }) => (
                    <div key={key} className="border border-border rounded-xl overflow-hidden bg-card">
                      <div className="w-full text-left px-6 py-4 bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{icon}</span>
                          <span className="font-semibold text-foreground">{label}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                            {items.length} items
                          </span>
                        </div>
                      </div>
                      <div className="px-6 pb-6 border-t border-border bg-secondary/10">
                        <ul className="space-y-3 mt-4">
                          {items.length > 0 ? (
                            items.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span className="text-foreground leading-relaxed">{item}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-muted-foreground italic">No items found in this category</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && !summary && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground">
                  Upload a document or paste legal text above to get started with AI analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 px-6 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why Choose LegalEase AI?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI technology makes legal documents accessible to everyone, regardless of legal background or
              expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Lightning Fast",
                description: "Get comprehensive analysis of complex legal documents in seconds, not hours.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Highly Accurate",
                description:
                  "Our AI is trained on millions of legal documents to ensure precise and reliable analysis.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
                title: "Secure & Private",
                description: "Your documents are processed securely and never stored or shared with third parties.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="gradient-card rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 animate-slideInUp"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-foreground mb-2">LegalEase AI</h4>
              <p className="text-sm text-muted-foreground">Making legal documents accessible to everyone</p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>⚠️ For educational purposes only, not legal advice</span>
              <span>© {new Date().getFullYear()} LegalEase AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
