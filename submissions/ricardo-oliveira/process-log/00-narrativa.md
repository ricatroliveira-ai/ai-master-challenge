# Process log: narrativa

Diário de como eu e a IA chegamos na solução. Atualizado a cada etapa, junto com os commits.

**Ferramenta principal:** Claude Code (Opus), rodando dentro do meu sistema operacional pessoal (um vault Obsidian com meu contexto, regras e histórico de trabalho).

---

## Etapa 0: entender o problema antes de abrir qualquer ferramenta (23/10)

- Escolhi o 003, Lead Scorer, porque é o que eu faço há anos: liderar time comercial e decidir onde o vendedor gasta a semana.
- Pedi pro Claude ler o README do challenge, o CONTRIBUTING, o guia de submissão e o template direto do repositório, em vez de colar o brief num chat.
- O que tirei da leitura: o pedido real da Head de RevOps não é "prever quem fecha". É "o vendedor abre na segunda e sabe onde focar". Probabilidade de ganho é só um pedaço disso.
- Ângulo definido: **prioridade não é probabilidade**. Prioridade = chance de ganhar x valor em jogo x urgência (o deal está esfriando em relação ao ciclo normal de quem ganha?). Cada deal sai com o motivo em português claro e uma próxima ação.
- Regra que eu impus: nenhuma variável entra no score sem provar, nos deals já fechados, que mexe na taxa de ganho. E o score passa por um backtest num período posterior antes de ir pra tela.

## Etapa 1: setup

- Fork, clone e branch `submission/ricardo-oliveira` feitos pelo Claude Code com a credencial git que já estava configurada na minha máquina.
- Pegadinha: o `.gitignore` do próprio repo ignora `submissions/`, e a regra do PR proíbe mexer em qualquer arquivo fora da minha pasta. Editar o `.gitignore` quebraria a regra. Solução: `git add -f` só na minha pasta.

## Etapa 2: método e primeira pergunta pros dados (23/10)

- Antes de qualquer código, defini o método e pedi pro Claude organizar num SOP: primeiro o ICP (quem compra, recompra e fica, por região se mudar), depois o MEDDPICC deal a deal, e só então a prioridade.
- O Claude leu os CSVs e trouxe o que muda o plano: 68% dos deals abertos (1.425 de 2.089) não têm conta, região é o escritório do vendedor e não do cliente, e o CRM não tem nenhum campo de MEDDPICC além de aproximações.
- Minha primeira pergunta no pipeline: quantas contas únicas, quantas ganhamos, quantas perdemos. Resposta: 85 contas, e as 85 têm deal ganho e deal perdido. Nenhuma conta só ganha ou só perde. Taxa de ganho por conta vai de 53% a 75% (mediana 63%, geral 63,2%).
- Leitura: contar contas não separa nada. O ICP vai ter que sair da taxa de ganho, do ticket e da recompra por conta, não de "comprou ou não comprou".
- Minha hipótese seguinte: o jogo é upsell e cross-sell na mesma conta. Pedi pro Claude testar antes de assumir. Resultado: não é bem isso. Toda conta já comprou 6 ou 7 dos 7 produtos, e 88% dos ganhos (3.716 de 4.238) são recompra de um produto que a conta já tinha. É um motion de recompra em alto volume (mediana de 83 deals por conta em 14 meses), não de expansão. Ressalva: os fechamentos só começam em mar/2017, então a primeira compra de cada conta pode ser anterior à janela.
- Achado de RevOps que eu não esperava: mediana de 14 vendedores diferentes trabalhando a mesma conta. Não existe dono de conta.
- Subi o pipeline numa Google Sheet pra olhar com meus próprios olhos e criei a coluna `sales_cycle_days` (close_date menos engage_date). Pedi pro Claude abrir uma aba por estágio (Won 4.238, Lost 2.473, Engaging 1.589, Prospecting 500) com FILTER sobre a aba original, pra ver o funil etapa por etapa sem duplicar dado. Ele conferiu as contagens contra o CSV e apontou que minha coluna de ciclo quebra nos deals abertos (sem close_date a conta fica negativa e aparece como data de 1782).
- Mantive `sales_cycle_days` só pra Won e Lost (em branco nos abertos).
- Foquei nos ganhos e pedi duas tabelas na planilha, uma por conta e uma por vendedor, todas em fórmula sobre a aba Won (dá pra clicar e ver de onde vem cada número). O Claude rodou a mesma análise em código antes e conferiu a planilha contra ela. O que saiu:
  - De 8 a 29 vendedores ganharam deal na mesma conta (mediana 10). Dentro da conta, o mesmo produto é vendido por mais de um vendedor em 502 de 522 combinações conta e produto. Não há dono de conta nem especialização por produto.
  - LTV por conta de 51,6 mil a 341 mil (mediana 111,5 mil). Três contas puxam o topo (Kan-code, Konex, Condax), o resto é uma curva suave. As 21 maiores somam 37% do LTV: não é 80/20. Tiers por quartil (A a partir de 140 mil, B 111,5 mil, C 85 mil, D abaixo), com os cortes em células que eu posso mudar.
  - O vendedor que mais fecha deals na conta é o mesmo que mais fatura nela em 47 de 85 contas. No geral, volume e valor são habilidades diferentes, como eu suspeitava: Anna Snelling é 4ª em deals e 18ª em receita (ticket médio 1.322), Versie Hillebrand é 5ª e 27ª; Elease Gluck é 26ª em deals e 16ª em receita (ticket 3.615).
  - Ciclo médio por produto quase não muda: de 48 a 55 dias, só o GTK 500 vai a 64 (15 deals). Na matriz vendedor x produto, várias células têm 1 a 3 deals, então a média ali é ruído até ter amostra mínima.

---

## Onde a IA errou e como corrigi

_(preenchido ao longo do build)_

## O que eu adicionei que a IA sozinha não faria

_(preenchido ao longo do build)_
