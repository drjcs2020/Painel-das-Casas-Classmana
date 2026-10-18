# ClassMana — Painel das Casas | Projeto modular

**Versão da organização:** 1.0.2 — 18/10/2026  
**Data exibida no painel:** 18/10/2026  
**Base dos alunos:** acumulado mais recente, relatórios de 16–17/10/2026  
**Método:** Índice ClassMana v1.0; notas adotadas como referência de outubro (simulação aprovada para continuidade, não uma fórmula original recuperada do V15).

## Abrir e testar no Windows

1. Descompacte o arquivo ZIP **mantendo as pastas**.
2. Abra a pasta `ClassMana_Painel_Modular_2026-10`.
3. Para testes rápidos, tente abrir `index.html` no navegador. Para obter um comportamento mais próximo da publicação, use um servidor local.
4. No CMD, entre na pasta extraída e execute:

   ```bat
   python -m http.server 8000
   ```

5. Acesse `http://localhost:8000` no navegador. Para parar, pressione `Ctrl+C` no CMD.

**Importante:** não execute `index.html` sozinho fora da estrutura de pastas; imagens e scripts dependem de caminhos relativos. O HTML usa fontes do Google (necessita internet para essas fontes; fontes alternativas existem no CSS).

## Organização

```text
ClassMana_Painel_Modular_2026-10/
├── index.html                    ← marcação HTML, sem CSS/JS/imagens gigantes embutidas
├── README.md                     ← este guia
├── css/
│   └── style.css                 ← cores, layout e visual do protótipo V15
├── js/
│   ├── assets.js                 ← catálogo de imagens e seus caminhos relativos
│   ├── game-data.js              ← alunos, Casas, notas dos eixos e médias atuais
│   └── app.js                    ← navegação, carrossel, modais, ranking e renderização
├── data/
│   └── baseline-indice-2026-10.json ← fórmula, referências FIXAS e registros por eixo
├── docs/
│   └── METODOLOGIA_CLASSMANA.md  ← explicação detalhada para futuras atualizações
└── assets/
    ├── images/                   ← 36 imagens extraídas do HTML original
    ├── sounds/                   ← preparada para efeitos de áudio
    ├── animations/               ← preparada para animações
    └── icons/                    ← preparada para ícones adicionais
```

## Como editar sem quebrar o projeto

- **Alterar textos e blocos da página:** `index.html`.
- **Alterar cores, fontes e responsividade:** `css/style.css`.
- **Alterar navegação, botões, animações futuras e ações:** `js/app.js`.
- **Trocar imagens:** colocar o arquivo em `assets/images/` e alterar o caminho correspondente em `js/assets.js`. Alguns banners são referenciados diretamente em `js/app.js`.
- **Atualizar alunos e recursos:** `js/game-data.js` — coleção `STUDENTS`. Atualizar **todas as três turmas** na mesma base acumulada, sem repetir estudantes.
- **Atualizar as notas da Casa:** no objeto `H` em `js/game-data.js`, campos `axes.conv`, `axes.tech`, `axes.learn`, `axes.comp`, `axes.mission`. A aplicação calcula novamente a média dos recursos e o Índice ClassMana a partir das notas.
- **Registros para atualizar as notas:** manter os totais por eixo em `data/baseline-indice-2026-10.json` e seguir `docs/METODOLOGIA_CLASSMANA.md`. Este protótipo **não se conecta automaticamente à plataforma ClassMana**: exportações e novas notas exigem conferência e atualização manual.
- **Adicionar som:** use `assets/sounds/` e ligue o evento correspondente em `js/app.js`, respeitando o bloqueio de reprodução automática dos navegadores.
- **Adicionar animação:** use `assets/animations/` e vincule por CSS ou JavaScript; mantenha recursos opcionais fora do `index.html`.

## Números de referência — outubro de 2026

| Métrica | 4º A | 4º B | 4º C |
|---|---:|---:|---:|
| Alunos | 24 | 28 | 26 |
| XP total | 300.616 | 382.928 | 385.504 |
| XP médio | 12.525,67 | 13.676,00 | 14.827,08 |
| Índice ClassMana | **8,06** | **6,88** | **6,73** |

Os XP são a soma dos saldos **acumulados atuais** de cada estudante. O Índice usa cinco eixos ponderados, **não** os saldos de XP, HP, Mana ou Ouro. Consulte a metodologia para os detalhes e os critérios de conservação entre versões.

## GitHub

1. Crie um repositório privado se for guardar dados individuais dos estudantes.
2. Envie a pasta completa, incluindo `assets/images`, `css`, `js` e `data`.
3. Para publicar uma versão pública, substitua nomes completos de estudantes por identificadores ou nomes autorizados e evite publicar registros sensíveis. **Não coloque os relatórios brutos de advertências no repositório público.**
4. Para hospedar como site estático, basta servir o diretório raiz (por exemplo, GitHub Pages); não é necessário backend no protótipo atual.
5. Faça um commit por atualização e registre a data, a base acumulada e a versão da metodologia no histórico.

## Checklist quinzenal

- [ ] Confirmar a data de corte dos relatórios acumulados desde o primeiro dia do projeto.
- [ ] Conferir quantidade de alunos e grupos (inclusive ingressos e transferências).
- [ ] Somar XP, HP, nível, Mana e Ouro; conferir médias por integrante.
- [ ] Reclassificar novas recompensas e advertências com a **mesma taxonomia**, conferindo eventos coletivos, recorrência, gravidade e recuperação.
- [ ] Conferir missões concluídas e objetivos concluídos sem dupla contagem; pendências não contam.
- [ ] Aplicar as **mesmas referências fixas** documentadas.
- [ ] Comparar o novo índice com a versão anterior e conferir os cinco eixos.
- [ ] Abrir o projeto localmente e verificar imagens, navegação, carrossel e ranking.
- [ ] Criar commit e somente então publicar.

## Notas técnicas

O código foi separado conservando os componentes visuais e as rotinas do protótipo HTML V15. As 36 imagens foram extraídas sem recompressão e referenciadas por caminhos locais. Esta refatoração **não converte o projeto para PlayCanvas** e não adiciona sons ou animações novos; cria apenas uma estrutura preparada para essa evolução.
