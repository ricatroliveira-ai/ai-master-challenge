# Setup: como rodar

Três peças. A planilha é o motor, o Apps Script é a API e o job diário, o app é a janela.

## 1. A planilha (motor)

Google Sheet `sales_pipeline`: https://docs.google.com/spreadsheets/d/1IjZSZTpzergXYVKPxf-IUJwsss5xD9P_Nch5KX3IMDc/edit (leitura). Todas as abas são fórmula, menos `Atividades` (o que o app grava) e as entradas azuis da aba `Hoje`.

| Aba | O que é |
|---|---|
| `Hoje` | O relógio (B3 = dias passados desde 31/12/2017, B4 = hoje), modo de dono (Carteiras / Como está hoje), ordem dentro do passo, cortes (57 e 138 dias, janelas de recompra), resumo do dia |
| `Lista do Dia` | 664 deals com conta: passo, ordem por vendedor, por quê, próxima ação, último contato |
| `Fila Sem Conta` | 1.425 deals sem conta, prazo e escalada, colunas azuis preenchidas pelo vendedor |
| `Recompra sem deal` | Pares conta e produto na hora de recomprar e quantos deals limpos abertos existem; onde não há nenhum, abrir e ligar |
| `Visão Manager` | Carga por vendedor nos dois modos, passos, fila, alertas; por manager a partir da linha 43 |
| `KPIs Vendedor` | Os oito números do topo do app, por vendedor, com e-mail e papel |
| `Backtest` | Data de snapshot editável: a lista daquele dia e o que aconteceu depois |
| `Atividades` | Uma linha por ação do app: feito, ganho, perdido |
| `Account x Product`, `Open Deals`, `Books`, `Rep Books`, `ICP`, `ICP x Team`, `GTK 500 KPIs` | As análises e decisões que alimentam a lista (recompra, carteiras, redistribuição, ICP) |

Pra rodar com seus próprios dados: cole os quatro CSVs nas abas `sales_pipeline`, `accounts`, `sales_teams` e `Products` e tudo recalcula.

## 2. O Apps Script (API e job diário)

Código em [`../solution/apps-script`](../solution/apps-script). Vinculado à planilha, publicado em 23/10/2026 como app da web (versão 7). O app em produção já aponta pra ele; o relógio anda às 9h (America/Sao_Paulo) e as mensagens saem por e-mail.

Pela interface: abra a planilha, Extensões > Apps Script, cole `Code.gs` e `appsscript.json` (ative "Mostrar o arquivo de manifesto" nas configurações), rode `setToken('um-token-seu')` uma vez e `installTrigger()` uma vez (agenda o job das 9h), depois Implantar > Nova implantação > App da Web, executar como você, acesso "Qualquer pessoa". Copie a URL.

Pela linha de comando (Google Workspace CLI, `gws`):

```bash
gws script projects create --json '{"title":"Lead Scorer API","parentId":"<id-da-planilha>"}'
gws script +push --params '{"scriptId":"<scriptId>"}' --dir solution/apps-script
gws script projects deployments create --params '{"scriptId":"<scriptId>"}' --json '{"description":"v1"}'
```

Endpoints: `?action=config`, `?action=users`, `?action=rep&email=...`, `?action=manager&email=...`, `?action=snapshot`. POST com `{token, action: activity|conta|advance|reset|notify}`. `conta` grava Status e Conta na `Fila Sem Conta` e uma linha em `Atividades`.

## 3. O app (Next.js)

```bash
cd solution/app
npm install
cp .env.example .env.local   # preencha APPS_SCRIPT_URL e API_TOKEN pra conectar na planilha
npm run dev                  # http://localhost:3000
```

Sem `APPS_SCRIPT_URL`, o app roda em **modo snapshot**: lê `src/data/snapshot.json` (exportado da planilha em 23/10/2026), e o que o vendedor marca fica num cookie do navegador. Com a URL, cada ação vira uma linha em `Atividades` e o botão "Avançar um dia" anda o relógio.

Sem login na demo: a primeira tela escolhe o vendedor ou o manager. Os e-mails do dataset não existem, então um login seria de mentira; com a aprovação da RevOps entra o SSO da empresa e a permissão por papel.

Em produção: https://g4-lead-scorer-seven.vercel.app. Variáveis no Vercel: `APPS_SCRIPT_URL`, `API_TOKEN`.
