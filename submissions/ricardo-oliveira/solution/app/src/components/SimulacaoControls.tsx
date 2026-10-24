"use client";

import { useState, useTransition } from "react";
import { avancarDia, resetarDemo, dispararMensagens } from "@/lib/actions";

export function SimulacaoControls({ live }: { live: boolean }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const run = (fn: () => Promise<{ error?: string; ok?: string } | undefined>) =>
    start(async () => { const r = await fn(); setMsg(r?.error ? `Erro: ${r.error}` : r?.ok ?? "ok"); });
  return (
    <div className="card p-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" disabled={pending || !live} onClick={() => run(avancarDia)}>Avançar um dia</button>
        <button className="btn-secondary" disabled={pending || !live} onClick={() => run(dispararMensagens)}>Mandar as mensagens de hoje</button>
        <button className="btn-ghost" disabled={pending} onClick={() => run(resetarDemo)}>Zerar a demo</button>
      </div>
      {!live && <p className="text-xs text-warn">Sem a planilha conectada (APPS_SCRIPT_URL), o relógio não anda. Zerar a demo limpa o que você marcou neste navegador.</p>}
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
