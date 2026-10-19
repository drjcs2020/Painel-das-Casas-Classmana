
/* ClassMana: carregador de dados públicos. Mantém os eixos e o Índice das Casas existentes. */
(function () {
  'use strict';

  const source = 'data/classmana-publico.json';
  let updatedDate = null;

  const normalize = v => String(v || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const teamByKey = new Map(
    teamNames.map(n => [normalize(n), n])
  );

  const safeNumber = n =>
    typeof n === 'number' &&
    Number.isFinite(n) &&
    n >= 0;

  function validate(data) {
    if (!data || data.schema !== 'classmana-painel-publico-v1') {
      throw new Error('Versão dos dados incompatível');
    }

    if (
      !Array.isArray(data.houses) ||
      data.houses.length !== 3 ||
      !Array.isArray(data.students) ||
      data.students.length < 1 ||
      !Array.isArray(data.teams) ||
      data.teams.length < 1
    ) {
      throw new Error('Conjuntos incompletos');
    }

    const codes = new Set(
      data.houses.map(x => x.code)
    );

    if (
      codes.size !== 3 ||
      !['A', 'B', 'C'].every(k => codes.has(k))
    ) {
      throw new Error('Turmas inválidas');
    }

    for (const house of data.houses) {
      if (
        ![
          house.students,
          house.totalXp,
          house.xp,
          house.level,
          house.mana,
          house.hp,
          house.gold
        ].every(safeNumber)
      ) {
        throw new Error('Dados da casa inválidos');
      }

      const people = data.students.filter(
        s => s.house === house.code
      );

      if (
        people.length !== house.students ||
        people.reduce((n, s) => n + s.xp, 0) !== house.totalXp
      ) {
        throw new Error(
          'Total de alunos/XP divergente: ' + house.code
        );
      }
    }

    for (const s of data.students) {
      if (
        !codes.has(s.house) ||
        typeof s.name !== 'string' ||
        !teamByKey.has(normalize(s.team)) ||
        ![
          s.level,
          s.xp,
          s.mana,
          s.hp,
          s.gold
        ].every(safeNumber)
      ) {
        throw new Error('Aluno/equipe inválido');
      }
    }

    if (data.teams.length !== 18) {
      throw new Error('Quantidade de equipes divergente');
    }

    if (!Number.isFinite(Date.parse(data.exportedAt))) {
      throw new Error('Data inválida');
    }
  }

  function applyData(data) {
    validate(data);

    for (const incoming of data.houses) {
      const house = H[incoming.code];

      house.students = incoming.students;
      house.totalXp = incoming.totalXp;
      house.xp = Math.round(incoming.xp);
      house.level = +incoming.level.toFixed(2);
      house.mana = +incoming.mana.toFixed(2);
      house.hp = +incoming.hp.toFixed(2);
      house.gold = Math.round(incoming.gold);

      // Intencionalmente NÃO altera house.axes e house.score.
    }

    STUDENTS.splice(
      0,
      STUDENTS.length,
      ...data.students.map(s => ({
        house: s.house,
        name: s.name,
        team: teamByKey.get(normalize(s.team)),
        level: s.level,
        xp: s.xp,
        mana: s.mana,
        hp: s.hp,
        gold: s.gold
      }))
    );

    // Data e hora da última exportação no horário de Brasília.
    updatedDate = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    }).format(new Date(data.exportedAt)).replace(', ', ' às ');
  }

  function refreshDates() {
    if (!updatedDate) return;

    const top = document.querySelector('.lastUpdate');

    if (top) {
      top.innerHTML =
        '📅 Última atualização dos dados: <strong>' +
        updatedDate +
        '</strong> (Brasília)';
    }

    const warn = document.querySelector('.demoWarn');

    if (warn) {
      warn.textContent =
        '📊 Dados acumulados atualizados em ' +
        updatedDate +
        '. Casas usam o Índice ClassMana ponderado de referência; ' +
        'equipes usam XP médio por integrante; ' +
        'heróis usam XP individual.';
    }

    const detail = document.querySelector('#detail');

    if (
      detail &&
      detail.textContent.includes('18/10/2026')
    ) {
      detail.querySelectorAll('.snapshotNote').forEach(el => {
        el.textContent = el.textContent.replace(
          /18\/10\/2026/g,
          updatedDate
        );
      });

      detail.querySelectorAll('#teamInfo').forEach(el => {
        if (el.textContent.includes('18/10/2026')) {
          el.textContent = el.textContent.replace(
            /18\/10\/2026/g,
            updatedDate
          );
        }
      });
    }
  }

  function startApp() {
    const script = document.createElement('script');
    script.src = 'js/app.js';

    script.onload = function () {
      refreshDates();

      const detail = document.querySelector('#detail');

      if (detail) {
        new MutationObserver(refreshDates).observe(
          detail,
          {
            childList: true,
            subtree: true
          }
        );
      }
    };

    script.onerror = () =>
      console.error(
        'ClassMana: falha ao carregar a interface'
      );

    document.body.appendChild(script);
  }

  fetch(source, { cache: 'no-store' })
    .then(r => {
      if (!r.ok) {
        throw Error('HTTP ' + r.status);
      }

      return r.json();
    })
    .then(applyData)
    .catch(e =>
      console.warn(
        'ClassMana: dados novos indisponíveis; usando referência local.',
        e
      )
    )
    .finally(startApp);

})();
