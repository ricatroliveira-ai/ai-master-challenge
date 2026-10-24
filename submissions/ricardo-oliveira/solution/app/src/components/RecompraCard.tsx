import type { Row } from "@/lib/types";
import { R } from "@/lib/types";
import { str, usd } from "@/lib/parse";

export function RecompraCard({ row }: { row: Row }) {
  const situacao = str(row[R.situacao]);
  return (
    <article className="card p-4 border-gold/60">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-2xl font-extrabold text-gold-dark">{str(row[R.ordem])}</span>
        <h3 className="text-base font-extrabold">{str(row[R.conta])}</h3>
        <span className="tag tag-navy">{str(row[R.produto])}</span>
        <span className="font-semibold">{usd(row[R.preco])}</span>
        <span className={`tag ${situacao === "Overdue" ? "tag-bad" : "tag-warn"}`}>{situacao === "Overdue" ? "recompra já passou" : "entrando na janela"}</span>
        {str(row[R.icp]) && <span className="tag tag-navy">{str(row[R.icp])}</span>}
        <span className="tag tag-gold">sem deal no CRM</span>
      </div>
      <p className="mt-3 text-sm"><span className="font-semibold">Por quê.</span> {str(row[R.porque])}</p>
      <p className="mt-1 text-sm"><span className="font-semibold">Próxima ação.</span> {str(row[R.acao])}</p>
    </article>
  );
}
