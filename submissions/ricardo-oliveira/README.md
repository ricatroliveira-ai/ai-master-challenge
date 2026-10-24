# Submissão — Ricardo Oliveira — Challenge 003

## Sobre mim

- **Nome:** Ricardo Oliveira
- **LinkedIn:** [preencher: Rica]
- **Challenge escolhido:** 003 — Lead Scorer (Vendas / RevOps)

---

## Executive Summary

Construí uma lista do dia por vendedor que sai de 8.800 oportunidades e diz, deal a deal, o que fazer primeiro e por quê. A lógica mora numa planilha (toda em fórmula, com um relógio que anda um dia por vez), e um app web com login por vendedor lê essa planilha, mostra os KPIs e a lista, e grava de volta o que o vendedor fez (feito, ganho, perdido). O que os dados mostraram: nenhum atributo da conta muda a chance de fechar (61% a 65% em todo corte), deal perdido morre em duas semanas, nenhum deal fecha depois de 138 dias, e 68% dos deals abertos estão sem conta no CRM. A prioridade, por isso, usa idade do deal, hora de recompra de cada produto em cada conta, valor e ICP, nessa ordem. A recomendação principal pra RevOps vai além da lista: cada conta com um dono, carteiras do tamanho do que cada vendedor já ganhou (ninguém perde comissão), e conta obrigatória no CRM.

---

## Solução

### Abordagem

1. **Entender antes de automatizar.** Li o README, o CONTRIBUTING e o guia direto do repositório. O pedido real da Head de RevOps não é "prever quem fecha", é "o vendedor abre na segunda e sabe onde focar".
2. **Método antes de código.** ICP (quem compra melhor), depois MEDDPICC (o que sabemos de cada deal), depois momento (vivo ou morto), e só então prioridade. O SOP completo está em [`docs/logica.md`](./docs/logica.md).
3. **Dados primeiro, hipótese depois.** Cada regra só entrou depois de provar nos 6.711 deals fechados que muda alguma coisa. O MEDDPICC saiu porque o CRM não tem dado pra seis das oito letras. O ICP ficou como valor em jogo, não como chance de ganhar, porque a taxa de ganho é igual em todo corte.
4. **A planilha é o motor.** Tudo em fórmula, em abas que qualquer pessoa abre e audita: `Hoje` (relógio e regras), `Lista do Dia`, `Fila Sem Conta`, `Recompra sem deal`, `Visão Manager`, `KPIs Vendedor`, `Backtest`, `Atividades`.
5. **O app é a janela.** Next.js lendo a planilha por uma API em Apps Script. Escolha do vendedor (sem login na demo), lista do dia com porquê e próxima ação (o motivo do ICP, o ritmo de recompra da conta naquele produto, a idade do deal e o aviso de compra depois de abrir), os deals sem conta do dia com o campo pra identificar a conta, botões Feito / Ganho / Perdido que gravam na planilha, o bloco Recompra sem deal, o bloco Encerrar, visão do manager, visão RevOps com filtro por manager e região, simulação de "amanhã".
6. **Validar antes de mostrar.** Backtest com snapshot editável: volta no tempo, monta a lista com o que se sabia naquele dia e confere o que aconteceu.

### Resultados / Findings

- **App:** https://g4-lead-scorer-seven.vercel.app (sem login: escolha o vendedor ou o manager na primeira tela). Código em [`solution/app`](./solution/app). Setup em [`docs/setup.md`](./docs/setup.md).
- **Planilha (motor):** aba por aba em [`docs/logica.md`](./docs/logica.md). Link de leitura: https://docs.google.com/spreadsheets/d/1IjZSZTpzergXYVKPxf-IUJwsss5xD9P_Nch5KX3IMDc/edit.
- **Lista do dia:** 664 deals com conta. Só deals limpos entram nos passos: passo 1 (vivo e na hora de recomprar) 16, passo 2 (outros vivos) 2, passo 3 (antigos, conta na hora de recomprar) 133, passo 4 (resto) 43. Os 470 atropelados vão pro bloco Encerrar, no fim. Dentro de cada passo: urgência da recompra, depois valor, depois ICP. E um bloco que não depende de deal: Recompra sem deal, 263 pares conta e produto na hora de recomprar sem nenhum deal limpo aberto, pra abrir e ligar.
- **Fila sem conta:** 1.425 deals (68% dos abertos), taxa igual em todo time, região e produto. É processo do CRM, não desleixo de alguém. Viram fila com prazo e escalada, e cinco por dia entram na lista do vendedor depois dos vivos, com um campo pra registrar a conta; identificada, o deal entra na lista pelas regras no dia seguinte.
- **Backtest (30/09/2017):** dos 169 deals já passados de 138 dias, nenhum fechou depois. Entre os vivos, estar na hora de recomprar não muda a taxa de ganho (60% nos dois passos). Nos 18 primeiros de cada vendedor, a ordem do SOP ganhou 239 deals e US$ 815 mil, contra 215 deals e US$ 481 mil que o acaso daria. Ordenar só por preço de tabela (o baseline) dá mais dinheiro (US$ 905 mil) com menos ganhos (221). "Mais novo primeiro" ganha mais deals (298) com menos dinheiro (US$ 697 mil), em parte porque neste arquivo um deal velho no snapshot não tem vida pela frente.
- **O sinal de "deal que não vai fechar" que o dataset tem:** em 470 dos 501 deals abertos em Engaging com conta, a conta comprou o mesmo produto de outro vendedor depois que o deal abriu (71 dos 89 vivos). Com 8 a 29 vendedores na mesma conta, o deal de um é atropelado pela venda do outro. Cada card mostra quantas vezes a conta comprou depois de o deal abrir e com quem. Decisão: esse deal não é prioridade de venda, é prioridade de encerrar; sai dos passos e vai pro fim da lista. Honestidade: neste arquivo gerado os atropelados ainda fecharam quase como os limpos (58% contra 63%), então a regra é de operação comercial, não do backtest. Exemplo que me fez ver isso: Treequote, GTX Plus Pro, deal aberto há 92 dias, a conta comprou o produto cinco vezes nesse período, a última ontem.
- **O que eu mudei por causa do backtest:** a ordem dentro do passo era ICP antes de valor. O backtest mostrou 26% mais receita com a mesma taxa de ganho invertendo. Inverti. Depois, com os atropelados no fim e a urgência antes do valor, o backtest dá 264 ganhos (contra 239) e menos receita (US$ 624 mil contra 815 mil): a regra nova é a certa pra operação, e o arquivo não a premia porque não sabe que o pedido já foi atendido.
- **Screenshots:** [`process-log/screenshots`](./process-log/screenshots).

### Recomendações

1. **Rodar a lista do dia como está, já na segunda**, no modo "como está hoje" (cada vendedor vê o que já tem). Não depende de nenhuma mudança de organização.
2. **Conta obrigatória na criação do deal** e relatório semanal de deals sem conta por vendedor até o furo sumir. Enquanto isso, a fila sem conta no app.
3. **Cada conta com um dono.** Hoje de 8 a 29 vendedores ganham deal na mesma conta. Proposta de carteiras do tamanho do que cada vendedor ganhou nos últimos 14 meses (-4% a +7%), deals vivos ficam com quem está neles, o resto vai pro dono. Os managers recebem a divisão como sugestão e reorganizam dentro do time numa faixa de 10%. Piloto: time da Celia Rouche. O app roda nos dois modos pra RevOps comparar.
4. **GTK 500 com três especialistas** (já é assim na prática: 37 dos 40 deals), como suporte ao dono da conta, com KPIs e decisão em 2 a 3 trimestres.
5. **Descobrir por que o time do Dustin Brinkmann nunca vendeu GTXPro** (35% da receita): acesso ao produto ou treinamento.
6. **Campos de MEDDPICC e de desafio do cliente no CRM**, pra um dia dar pra separar deal real de torcida.
7. **Login e permissão por papel** quando a ferramenta for aprovada: SSO da empresa, cada vendedor vê só a sua lista, cada manager só o time. A demo escolhe o vendedor na primeira tela porque os e-mails do dataset não existem.

### Limitações

- **O dataset é gerado.** O deal ganho mais longo e o perdido mais longo param nos mesmos 138 dias, e a taxa de ganho é igual em todo corte. Os cortes (57 e 138 dias) são percentis deste arquivo, em células editáveis. Num CRM real seriam recalculados todo mês, e provavelmente haveria sinal de probabilidade de fechamento que aqui não existe.
- **Não existe data de último contato.** A lista diz "aberto há X dias", nunca "parado". A partir do app, cada ação vira uma linha em `Atividades`, e aí passa a existir.
- **"Hora de recomprar" é estimativa**, não contrato: última compra mais o intervalo médio daquela conta naquele produto. A lista mostra em quantas compras cada estimativa se baseia.
- **"Ninguém perde comissão" é meta, não resultado demonstrado.** A carteira preserva o potencial histórico; o efeito real depende do que cada conta comprar daqui pra frente, e é checado no piloto junto com a carga de trabalho.
- **Prospecting não tem data**, então fica fora do backtest e entra na lista ordenado pelo valor do produto até o vendedor engajar e registrar a data.
- **A redistribuição de carteiras precisa de aprovação da RevOps.** Por isso o app funciona sem ela.
- **O relógio é simulado.** O "hoje" dos dados é 31/12/2017; o job diário anda um dia por vez em cima de um CRM congelado. Com um CRM vivo, o mesmo job leria o export do dia.
- **Sem login na demo.** Os e-mails dos vendedores não existem no dataset, então um login seria de mentira. A primeira tela escolhe quem está olhando. Com a aprovação da RevOps, entra o login da empresa (SSO) e a permissão por papel: cada vendedor vê só a sua lista, cada manager só o time, RevOps vê tudo. O app já separa os dados por vendedor e por manager; falta só a porta.
- **Mensagens diárias por e-mail** (Apps Script). Slack entra com um webhook, sem mudar o resto.

---

## Process Log — Como usei IA

> **Este bloco é obrigatório.** Sem ele, a submissão é desclassificada.

### Ferramentas usadas

| Ferramenta | Para que usou |
|------------|--------------|
| Claude Code (Opus e Fable), dentro do meu sistema operacional pessoal (vault Obsidian com contexto e regras) | Leitura do repositório e dos dados, análise em código, construção da planilha em fórmula, SOP, backtest, app, Apps Script |
| GPT / Codex | Revisão independente da estratégia antes do app, com instrução explícita de discordar |
| Google Sheets | O motor: toda a lógica em fórmula, auditável célula a célula |
| Google Apps Script | API da planilha, job diário das 9h, mensagens |
| Next.js + Vercel | O app que o vendedor abre |

### Workflow

1. Li o README, o CONTRIBUTING, o guia e o template direto do repositório (não colei o brief num chat). Defini o ângulo: prioridade não é probabilidade.
2. Fork, clone, branch. Pegadinha do `.gitignore` que ignora `submissions/` (resolvida com `git add -f`, sem tocar em arquivo fora da minha pasta).
3. Método antes de código: SOP em português com ICP, MEDDPICC, momento, prioridade. Primeira leitura dos dados pelo Claude: 68% dos abertos sem conta, região é do vendedor, nada de MEDDPICC.
4. Planilha, aba por aba, sempre em fórmula, conferida contra o código: ganhos e perdidos, contas e vendedores, recompra por conta e produto, ICP, ICP por time, carteiras, redistribuição, prioridade.
5. Cada hipótese minha testada antes de virar regra: GTK 500 especialistas (sim, já é assim), AE por conta (organização, não conversão), deals sem conta como new logo (não: furo de cadastro), GTXPro especializado (não).
6. Duas revisões independentes (Claude Fable e GPT) antes de construir. Aceitei a maioria, recusei uma (abandonar as carteiras) e voltei atrás noutra: tinha insistido no login por e-mail e tirei depois, porque os e-mails do dataset não existem. Detalhe na narrativa, etapa 8.
7. Motor na planilha com relógio simulado, lista do dia, fila sem conta, visão do manager, KPIs, backtest, atividades. Clock testado com 20 dias.
8. Apps Script (API + job diário), app em Next.js (escolha do vendedor, meu dia, fila, manager, simulação), deploy. Screenshots do fluxo real.

A narrativa completa, etapa por etapa, está em [`process-log/00-narrativa.md`](./process-log/00-narrativa.md). A conversa inteira da tarde de 23/10 (das carteiras ao SOP) está em [`process-log/chat-exports`](./process-log/chat-exports).

### Onde a IA errou e como corrigi

- A fórmula de top 3 produtos devolvia o cabeçalho da QUERY no lugar do produto nº 1. Só apareceu na versão dos perdidos.
- A IA descreveu o ICP pelo valor da conta. ICP é quem é o cliente (desafios, comportamento, perfil); o valor é a evidência de qual perfil compra melhor, não a definição.
- "Os especialistas de GTK ganham 60%" era a taxa de todos os deals de GTK; a dos especialistas é 65,2%.
- Eu mesmo misturei GTK 500 com GTXPro numa decisão; a IA separou os dois com a tabela de preços antes de eu decidir em cima do produto errado.
- O SOP trazia 448 e 127 nos passos 3 e 4; a planilha em fórmula deu 443 e 132 (75 + 443 = 518, o número que o documento já citava). Corrigi o SOP pela planilha.
- A revisão me descontou por "tempo gasto" assumindo um dia corrido. Foi em várias sessões, dentro do orçamento.
- Fórmulas com intervalo aberto (`$J$2:$J`) sobre resultados de `MAP` devolviam vazio na `Lista do Dia`; o lookup escalar funcionava. Intervalo fechado resolveu. A IA demorou três tentativas pra isolar.

### O que eu adicionei que a IA sozinha não faria

- A leitura de operação comercial: carteira fixa por vendedor justificada por organização e cadência, assumindo abertamente que os dados não mostram ganho de conversão.
- "Ninguém pode perder comissão" como regra de desenho. Foi isso que mudou o critério das carteiras e a regra dos deals vivos.
- Reorganizar agora em vez de esperar o pipeline zerar, e travar o CRM pra só aceitar deal em conta própria.
- Dar aos managers a palavra final dentro do time, com travas, em vez de impor a divisão.
- Pedir duas revisões adversárias antes de construir, e inverter uma regra minha (ICP antes de valor) quando o backtest mostrou o contrário.
- Manter a lógica numa planilha que RevOps consegue abrir e mudar sem desenvolvedor, e fazer o app ser só a janela.

---

## Evidências

- [x] Screenshots do app em uso: [`process-log/screenshots`](./process-log/screenshots)
- [ ] Screen recording do workflow
- [x] Chat export: [`process-log/chat-exports`](./process-log/chat-exports)
- [x] Git history (código e process log na branch `submission/ricardo-oliveira`)
- [x] Narrativa escrita: [`process-log/00-narrativa.md`](./process-log/00-narrativa.md)

---

_Submissão enviada em: [data]_
