"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { escolherUsuario, limparUsuario, currentUser } from "./session";
import { findUser, isLive, apiPost } from "./data";
import { writeLocalActivity, clearLocalActivities } from "./localActivities";

export type ActionState = { error?: string; ok?: string } | undefined;

export async function escolher(formData: FormData): Promise<void> {
  const key = String(formData.get("quem") || "").trim();
  const user = await findUser(key);
  if (!user) redirect("/");
  await escolherUsuario(key);
  redirect(user.papel === "manager" ? "/manager" : "/meu-dia");
}

export async function trocar(): Promise<void> {
  await limparUsuario();
  redirect("/");
}

export async function registrar(deal: string, acao: "feito" | "ganho" | "perdido", valor?: number, nota?: string): Promise<ActionState> {
  const user = await currentUser();
  if (!user) return { error: "Sessão expirada." };
  if (isLive()) {
    const r = await apiPost<{ ok?: boolean; error?: string }>({ action: "activity", deal, rep: user.nome, acao, valor: valor ?? 0, nota: nota ?? "" });
    if (r.error) return { error: r.error };
  } else {
    await writeLocalActivity(deal, { acao, valor });
  }
  revalidatePath("/meu-dia");
  revalidatePath("/manager");
  return { ok: `${deal}: ${acao}` };
}

export async function registrarConta(deal: string, conta: string): Promise<ActionState> {
  const user = await currentUser();
  if (!user) return { error: "Sessão expirada." };
  if (!conta.trim()) return { error: "Escreva o nome da conta." };
  if (isLive()) {
    const r = await apiPost<{ ok?: boolean; error?: string; status?: string; conta?: string }>({ action: "conta", deal, rep: user.nome, conta: conta.trim() });
    if (r.error) return { error: r.error };
    await writeLocalActivity(deal, { acao: "conta", conta: r.conta });
    revalidatePath("/meu-dia"); revalidatePath("/fila"); revalidatePath("/manager");
    return { ok: r.status === "Identificada" ? `${r.conta}: identificada. O deal entra na lista pelas regras.` : `${r.conta} não é nenhuma das 85 contas: fica marcado como new logo.` };
  }
  await writeLocalActivity(deal, { acao: "conta", conta: conta.trim() });
  revalidatePath("/meu-dia"); revalidatePath("/fila");
  return { ok: `${conta.trim()}: anotado neste navegador (modo snapshot).` };
}

export async function avancarDia(): Promise<ActionState> {
  const user = await currentUser();
  if (!user) return { error: "Sessão expirada." };
  if (!isLive()) return { error: "Avançar o dia precisa da planilha conectada (APPS_SCRIPT_URL). No snapshot o relógio é fixo." };
  const r = await apiPost<{ ok?: boolean; error?: string; hoje?: string }>({ action: "advance" });
  if (r.error) return { error: r.error };
  revalidatePath("/", "layout");
  return { ok: `Hoje agora é ${r.hoje}` };
}

export async function resetarDemo(): Promise<ActionState> {
  const user = await currentUser();
  if (!user) return { error: "Sessão expirada." };
  if (isLive()) {
    const r = await apiPost<{ ok?: boolean; error?: string }>({ action: "reset" });
    if (r.error) return { error: r.error };
  } else {
    await clearLocalActivities();
  }
  revalidatePath("/", "layout");
  return { ok: "Demo zerada: relógio em 0 e atividades limpas." };
}

export async function dispararMensagens(): Promise<ActionState> {
  const user = await currentUser();
  if (!user) return { error: "Sessão expirada." };
  if (!isLive()) return { error: "As mensagens saem do Apps Script; precisa da planilha conectada." };
  const r = await apiPost<{ ok?: boolean; error?: string; mensagens?: number }>({ action: "notify" });
  if (r.error) return { error: r.error };
  return { ok: `${r.mensagens} mensagens enviadas.` };
}
