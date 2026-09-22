"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AvailabilityManager } from "./AvailabilityManager";

type Lead = {
  id: number;
  created_at: string;
  source: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  business_name: string | null;
  website_url: string | null;
  industry: string | null;
  location: string | null;
  primary_goal: string | null;
  message: string | null;
  status: "new" | "contacted" | "won" | "lost";
  notes: string | null;
};

const STORAGE_KEY = "wc_admin_auth";
const STATUSES: Lead["status"][] = ["new", "contacted", "won", "lost"];
const STATUS_COLORS: Record<Lead["status"], string> = {
  new: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  contacted: "bg-amber-500/15 text-gold border-amber-500/30",
  won: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  lost: "bg-slate-500/10 text-ink-4 border-slate-500/25",
};

export const AdminDashboard: React.FC = () => {
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState<"all" | Lead["status"]>("all");
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState<"leads" | "schedule">("leads");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (stored) setAuthHeader(stored);
  }, []);

  const fetchLeads = useCallback(async (header: string) => {
    setLoadError("");
    try {
      const res = await fetch("/api/leads", { headers: { Authorization: header } });
      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setAuthHeader(null);
        setLoginError("Session expired — please log in again.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load leads");
      const data = await res.json();
      setLeads(data.leads);
    } catch {
      setLoadError("Could not load leads. Check your connection and try again.");
    }
  }, []);

  useEffect(() => {
    if (authHeader) fetchLeads(authHeader);
  }, [authHeader, fetchLeads]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const header = "Basic " + btoa("admin:" + password);
    try {
      const res = await fetch("/api/leads", { headers: { Authorization: header } });
      if (!res.ok) {
        setLoginError("Incorrect password.");
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, header);
      setAuthHeader(header);
      setPassword("");
    } catch {
      setLoginError("Could not reach the server. Try again.");
    }
  };

  const updateLead = async (id: number, patch: { status?: Lead["status"]; notes?: string }) => {
    if (!authHeader) return;
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const { lead } = await res.json();
      setLeads((prev) => prev?.map((l) => (l.id === id ? lead : l)) ?? null);
    }
  };

  if (!authHeader) {
    return (
      <div className="max-w-sm mx-auto py-24 px-6">
        <h1 className="text-2xl font-bold text-ink mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full glass border border-hair rounded-lg px-3.5 py-2.5 text-sm text-ink outline-none focus:border-amber-500/60"
          />
          {loginError && <p className="text-sm text-red-600">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            Log In
          </button>
        </form>
      </div>
    );
  }

  const filteredLeads = leads?.filter((l) => filter === "all" || l.status === filter) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-8 border-b border-hair">
        {(["leads", "schedule"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t ? "page" : undefined}
            className={`pressable -mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t
                ? "border-amber-600 text-ink"
                : "border-transparent text-ink-4 hover:text-ink-2"
            }`}
          >
            {t === "leads" ? "Leads" : "Schedule"}
          </button>
        ))}
      </div>

      {tab === "schedule" ? (
        <AvailabilityManager authHeader={authHeader} />
      ) : (
        <>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-ink">Leads</h1>
        <div className="flex gap-2">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                filter === s
                  ? "bg-amber-500 text-slate-950 border-amber-500"
                  : "glass text-ink-3 border-hair hover:text-ink"
              }`}
            >
              {s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loadError && <p className="text-sm text-red-600 mb-4">{loadError}</p>}
      {!leads && !loadError && <p className="text-sm text-ink-3">Loading…</p>}

      {leads && (
        <div className="overflow-x-auto rounded-xl border border-hair">
          <table className="w-full text-sm">
            <thead>
              <tr className="glass text-left text-xs uppercase tracking-wide text-ink-3">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Goal</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-hair align-top">
                  <td className="px-4 py-3 text-ink-3 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{lead.source}</td>
                  <td className="px-4 py-3 text-ink">{lead.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-2">{lead.business_name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-2">
                    <div>{lead.email ?? "—"}</div>
                    {lead.phone && <div className="text-ink-4">{lead.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-ink-2">{lead.primary_goal ?? lead.message ?? "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLead(lead.id, { status: e.target.value as Lead["status"] })}
                      className={`text-xs font-medium rounded-full border px-2.5 py-1 outline-none ${STATUS_COLORS[lead.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-white text-ink">
                          {s[0].toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-4">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
        </>
      )}
    </div>
  );
};
