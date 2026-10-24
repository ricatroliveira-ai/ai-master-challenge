import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import { getConfig, isLive } from "@/lib/data";
import { SimulacaoControls } from "@/components/SimulacaoControls";
import { dateBR, weekdayBR } from "@/lib/parse";

export default async function Simulacao() {
  const user = await currentUser();
  if (!user) redirect("/");
  const c = await getConfig();
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-extrabold">Simulação: <span className="display-accent">amanhã</span></h1>
      <p className="text-sm">
        O "hoje" dos dados é {dateBR(c.fimDosDados)}. O relógio da planilha anda um dia por vez: hoje é {dateBR(c.hoje)} ({weekdayBR(c.hoje)}), {c.diasPassados} dias depois do fim dos dados.
        Quando o dia anda, um produto pode entrar na janela de recompra (o deal sobe), um deal vivo pode passar de {c.cicloMaisLongo} dias (sai dos vivos e vai pro dono requalificar), e a fila sem conta pode vencer o prazo (escala pro manager).
        O job diário das 9h faz isso sozinho e manda a mensagem de cada vendedor. Aqui você faz na mão.
      </p>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="card p-4"><div className="text-xs text-grey uppercase font-semibold">Deals com conta</div><div className="text-2xl font-extrabold">{c.totais.comConta}</div></div>
        <div className="card p-4"><div className="text-xs text-grey uppercase font-semibold">Passo 1 · 2 · 3 · 4</div><div className="text-2xl font-extrabold">{c.totais.passo1} · {c.totais.passo2} · {c.totais.passo3} · {c.totais.passo4}</div></div>
        <div className="card p-4"><div className="text-xs text-grey uppercase font-semibold">Fila sem conta</div><div className="text-2xl font-extrabold">{c.totais.semConta} <span className="text-sm text-bad">{c.totais.filaForaDoPrazo} fora do prazo</span></div></div>
      </div>
      <SimulacaoControls live={isLive()} />
      <div className="text-xs text-grey">
        Regras em uso: ciclo normal {c.cicloNormal} dias · deal ganho mais longo {c.cicloMaisLongo} dias · janela de recompra {c.janelaEntrando} dias · modo de dono {c.modoDono} · ordem dentro do passo: {c.ordemDentroDoPasso}.
      </div>
    </div>
  );
}
