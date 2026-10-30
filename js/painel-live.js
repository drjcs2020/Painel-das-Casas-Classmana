/* ClassMana: dados públicos e Índice das Casas; preserva valores até receber cinco eixos validados. */
(function () {
  'use strict';
  const source = 'data/classmana-publico.json';
  let updatedDate = null, indexUpdated = false;
  const normalize = v => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const teamByKey = new Map(teamNames.map(n => [normalize(n), n]));
  const safeNumber = n => typeof n === 'number' && Number.isFinite(n) && n >= 0;
  const weights = {conv:.40, tech:.25, learn:.15, comp:.10, mission:.10};

  function validate(data) {
    if (!data || data.schema !== 'classmana-painel-publico-v1') throw Error('Versão dos dados incompatível');
    if (!Array.isArray(data.houses) || data.houses.length !== 3 ||
        !Array.isArray(data.students) || data.students.length < 1 ||
        !Array.isArray(data.teams) || data.teams.length < 1) throw Error('Conjuntos incompletos');
    const codes = new Set(data.houses.map(x => x.code));
    if (codes.size !== 3 || !['A','B','C'].every(k => codes.has(k))) throw Error('Turmas inválidas');
    for (const h of data.houses) {
      if (![h.students,h.totalXp,h.xp,h.level,h.mana,h.hp,h.gold].every(safeNumber)) throw Error('Dados inválidos: '+h.code);
      const people = data.students.filter(s => s.house === h.code);
      if (people.length !== h.students || people.reduce((n,s) => n+s.xp,0) !== h.totalXp) throw Error('Alunos/XP divergentes: '+h.code);
    }
    for (const s of data.students) {
      if (!codes.has(s.house) || typeof s.name !== 'string' || !teamByKey.has(normalize(s.team)) ||
          ![s.level,s.xp,s.mana,s.hp,s.gold].every(safeNumber)) throw Error('Aluno/equipe inválido');
    }
    if (data.teams.length !== 18 || !Number.isFinite(Date.parse(data.exportedAt))) throw Error('Equipes ou data inválidas');
    if (data.indices !== undefined) {
      if (!Array.isArray(data.indices) || data.indices.length !== 3) throw Error('Índices incompletos');
      const found = new Set(data.indices.map(x => x.code));
      if (found.size !== 3 || !['A','B','C'].every(k => found.has(k))) throw Error('Casas inválidas no Índice');
      for (const item of data.indices) {
        if (!item.axes || !safeNumber(item.score) || item.score > 10) throw Error('Índice inválido');
        for (const key of Object.keys(weights)) {
          if (!safeNumber(item.axes[key]) || item.axes[key] > 10) throw Error('Eixo inválido: '+key);
        }
        const expected = Object.keys(weights).reduce((sum,k) => sum+item.axes[k]*weights[k],0);
        if (Math.abs(expected-item.score) > 0.021) throw Error('Índice inconsistente com os cinco eixos');
      }
    }
  }

  function applyData(data) {
    validate(data);
    for (const incoming of data.houses) {
      const h = H[incoming.code];
      h.students = incoming.students; h.totalXp = incoming.totalXp;
      h.xp = Math.round(incoming.xp); h.level = +incoming.level.toFixed(2);
      h.mana = +incoming.mana.toFixed(2); h.hp = +incoming.hp.toFixed(2);
      h.gold = Math.round(incoming.gold);
    }
    STUDENTS.splice(0,STUDENTS.length,...data.students.map(s => ({
      house:s.house, name:s.name, team:teamByKey.get(normalize(s.team)),
      level:s.level, xp:s.xp, mana:s.mana, hp:s.hp, gold:s.gold
    })));
    if (Array.isArray(data.indices)) {
      for (const i of data.indices) { H[i.code].axes = {...i.axes}; H[i.code].score = i.score; }
      indexUpdated = true;
    }
    updatedDate = new Intl.DateTimeFormat('pt-BR',{
      timeZone:'America/Sao_Paulo', dateStyle:'short', timeStyle:'medium'
    }).format(new Date(data.exportedAt));
  }

  function refreshDates() {
    if (!updatedDate) return;
    const top = document.querySelector('.lastUpdate');
    if (top) top.innerHTML = '📅 Última atualização dos dados: <strong>'+updatedDate+'</strong> (Brasília)';
    const warn = document.querySelector('.demoWarn');
    if (warn) warn.textContent = '📊 Dados acumulados atualizados em '+updatedDate+'. '+
      (indexUpdated ? 'Índice ClassMana recalculado com os cinco eixos da sincronização.' :
      '⚠️ Índice ClassMana ainda na referência histórica; cinco eixos não recebidos.')+
      ' Equipes por XP médio; heróis por XP individual.';
    const detail = document.querySelector('#detail');
    if (detail && detail.textContent.includes('18/10/2026')) {
      detail.querySelectorAll('.snapshotNote').forEach(el => {el.textContent=el.textContent.replace(/18\/10\/2026/g,updatedDate)});
      detail.querySelectorAll('#teamInfo').forEach(el => {
        if (el.textContent.includes('18/10/2026')) el.textContent=el.textContent.replace(/18\/10\/2026/g,updatedDate);
      });
    }
  }

  function startApp() {
    const script = document.createElement('script');
    script.src = 'js/app.js';
    script.onload = function () {
      refreshDates();
      const detail = document.querySelector('#detail');
      if (detail) new MutationObserver(refreshDates).observe(detail,{childList:true,subtree:true});
    };
    script.onerror = () => console.error('ClassMana: falha ao carregar a interface');
    document.body.appendChild(script);
  }

  fetch(source,{cache:'no-store'})
    .then(r => {if (!r.ok) throw Error('HTTP '+r.status); return r.json()})
    .then(applyData)
    .catch(e => console.warn('ClassMana: dados novos indisponíveis; usando referência local.',e))
    .finally(startApp);
})();
