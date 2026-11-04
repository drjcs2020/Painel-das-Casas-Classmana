/* ClassMana — campeonato online: autenticação, convites, equipes e interclasses.
   Live integration requires a deployed private Google Apps Script web app configured in backend-config.js.
*/
(function(){
'use strict';
const G=id=>document.getElementById(id);
const URL=String(window.CM_ARENA_BACKEND_URL||'').trim();
const ORIGIN='https://drjcs2020.github.io';
const KEY='CM_ARENA_BRIDGE_V1';
const SECRET='cm_archery_session_v1';
const TEAMS=['Fadas Guerreiras','Chama Congelante','Lobos e Gatunos','Cavaleiros e Guerreiros','Mágicos e Engenheiros','Dragões de Combate'];
const HOUSES={A:'Águia Dourada',B:'Leão de Fogo',C:'Dragão de Esmeralda'};
const $=selector=>document.querySelector(selector);
let iframe=null,ready=false,token=localStorage.getItem(SECRET)||'',me=null,inbox=[],ranking=null,draft=null,ghost=[],busy=false;
let requests=new Map(),selectedScope='individual';
function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));}
function stamp(msg){const box=G('cm-cloud-notice');if(box)box.textContent=msg}
function modal(markup){const outer=document.createElement('div');outer.innerHTML=markup;const content=outer.firstElementChild?.id==='cm-cloud-content'?outer.firstElementChild.innerHTML:markup;G('cm-cloud-content').innerHTML=content;G('cm-cloud-modal').classList.add('visible');}
function close(){G('cm-cloud-modal').classList.remove('visible')}
function api(action,detail={}){
 return new Promise((resolve,reject)=>{
  if(!URL)return reject(Error('O serviço do placar ainda não foi publicado.'));
  if(!ready)return reject(Error('Sem conexão com a planilha. Verifique a publicação do Apps Script.'));
  const id='cm-'+Math.random().toString(36).slice(2)+'-'+Date.now().toString(36);
  const timer=setTimeout(()=>{requests.delete(id);reject(Error('A planilha não respondeu. Verifique sua conexão.'))},22000);
  requests.set(id,{resolve,reject,timer});iframe.contentWindow.postMessage({marker:KEY,id,op:'request',payload:{action,token,...detail}},'*');
 });
}
window.addEventListener('message',e=>{
 if(!iframe||e.source!==iframe.contentWindow||e.data?.marker!==KEY)return;
 if(e.data.op==='ready'){const was=ready;ready=true;if(!was){stamp('● PLACAR ONLINE CONECTADO');if(token){api('me').then(r=>{me=r.me;refresh()}).catch(()=>{token='';localStorage.removeItem(SECRET);stamp('● ENTRE COM O PIN DO ALUNO')})}else stamp('● ENTRE COM O PIN DO ALUNO')}}
 if(e.data.id&&requests.has(e.data.id)){
  const p=requests.get(e.data.id);requests.delete(e.data.id);clearTimeout(p.timer);
  if(e.data.ok)p.resolve(e.data.result);else p.reject(Error(e.data.error||'Erro ao consultar o servidor'));
 }
});
function initial(){
 const holder=document.createElement('div');holder.id='cm-online-root';holder.innerHTML=`
 <div class="cm-online-links"><button id="cm-open-account" type="button">👤 MINHA CONTA</button><button id="cm-open-inbox" type="button">⚔️ DESAFIOS <span id="cm-inbox-count"></span></button></div>
 <div class="cm-cloud-status" id="cm-cloud-notice">${URL?'◌ CONECTANDO AO PLACAR ONLINE':'⚠️ PLACAR ONLINE: CONFIGURAÇÃO PENDENTE'}</div>
 <div class="cm-cloud-modal" id="cm-cloud-modal" role="dialog" aria-label="Campeonato online" aria-modal="true"><div class="cm-cloud-frame"><button type="button" class="cm-close" id="cm-close">✕</button><div id="cm-cloud-content"></div></div></div>
 <div id="cm-ghost" class="cm-ghost" aria-live="polite"></div>`;
 document.body.appendChild(holder);
 const nav=$('.nav-links')||$('.nav-bar');if(nav){nav.appendChild(G('cm-online-root').querySelector('.cm-online-links'));}
 const stat=$('.ready')||$('.nav-bar');if(stat){stat.insertAdjacentElement('afterend',G('cm-cloud-notice'))}
 G('cm-open-account').onclick=showAccount;G('cm-open-inbox').onclick=showInbox;G('cm-close').onclick=close;
 G('cm-cloud-modal').addEventListener('click',e=>{if(e.target===G('cm-cloud-modal'))close()});
 if(URL){iframe=document.createElement('iframe');iframe.setAttribute('title','Conexão segura ClassMana');iframe.setAttribute('aria-hidden','true');iframe.style.cssText='position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;border:0';iframe.src=URL;document.body.appendChild(iframe)}
}
function badgeState(){G('cm-open-account').textContent=me?'👤 '+me.name:'👤 MINHA CONTA';let n=inbox.filter(c=>c.status==='PENDENTE'&&c.from.id!==me?.id).length;G('cm-inbox-count').textContent=n?'🔔 '+n:'';if(n)G('cm-inbox-count').classList.add('has-new');else G('cm-inbox-count').classList.remove('has-new')}
function players(){const r=window.CLASSMANA_ROSTER||{};return ['A','B','C'].flatMap(h=>(r[h]||[]).map((name,i)=>({id:h+String(i+1).padStart(2,'0'),house:h,name}))) }
function showAccount(){
 if(!me){let opts=players().map(p=>`<option value="${p.id}">${p.id} · 4º ${p.house} · ${escapeHTML(p.name)}</option>`).join('');modal(`<div id="cm-cloud-content"><h2>🏹 Entrar no ClassMana</h2><p>Use seu código de arqueiro e o PIN entregue pelo professor.</p><label>Meu arqueiro<select id="cm-login-id">${opts}</select></label><label>PIN de acesso<input type="password" id="cm-login-pin" autocomplete="off" placeholder="Código individual" /></label><button type="button" class="cm-action" id="cm-login">ENTRAR E VER DESAFIOS</button><p class="cm-message" id="cm-login-message"></p><small>Os PINs ficam na planilha privada do professor. Não compartilhe seu código.</small></div>`);G('cm-login').onclick=async()=>{if(busy)return;busy=true;G('cm-login-message').textContent='Conectando à planilha…';try{const r=await api('login',{id:G('cm-login-id').value,pin:G('cm-login-pin').value});token=r.token;localStorage.setItem(SECRET,token);me=r.me;close();await refresh();showInbox()}catch(e){G('cm-login-message').textContent=e.message}finally{busy=false}};return}
 modal(`<div id="cm-cloud-content"><h2>👤 ${escapeHTML(me.name)}</h2><p><b>4º ${me.house} · ${escapeHTML(HOUSES[me.house])}</b></p><p>Equipe: ${escapeHTML(me.team)}</p><div class="cm-actions"><button class="cm-action" id="cm-show-inbox">⚔️ VER MEUS DESAFIOS</button><button class="cm-action" id="cm-new-duel">🏹 CRIAR DESAFIO</button><button class="cm-secondary" id="cm-logout">SAIR DA CONTA</button></div></div>`);
 G('cm-show-inbox').onclick=showInbox;G('cm-new-duel').onclick=showCreate;G('cm-logout').onclick=async()=>{try{await api('logout')}catch{} token='';me=null;inbox=[];draft=null;localStorage.removeItem(SECRET);badgeState();close();stamp('● ENTRE COM O PIN DO ALUNO')};
}
async function refresh(){if(!me)return;try{const r=await api('inbox');inbox=r.challenges||[];badgeState();const n=inbox.filter(x=>x.status==='PENDENTE'&&x.from.id!==me.id).length;stamp(n?'🔔 VOCÊ TEM '+n+' DESAFIO(S) PENDENTE(S)':'✓ CONECTADO · '+me.name)}catch(e){stamp('⚠️ FALHA NO PLACAR: '+e.message)}}
function kindName(s){return {individual:'Duelo individual',team:'Duelo entre equipes',class:'Duelo interclasses'}[s]||s}
function showInbox(){if(!me)return showAccount();const pend=inbox.filter(x=>x.status==='PENDENTE'&&x.from.id!==me.id),others=inbox.filter(x=>!(x.status==='PENDENTE'&&x.from.id!==me.id));let cards=pend.map(x=>`<article class="cm-challenge"><b>🔔 VOCÊ FOI DESAFIADO!</b><h3>${escapeHTML(x.from.name)} · 4º ${x.from.house}</h3><p>${escapeHTML(kindName(x.scope))} · O adversário já fez <b>${x.scoreA} de 50 pontos</b>.</p><div class="cm-actions"><button class="cm-action" data-accept="${x.id}">✅ ACEITAR E JOGAR</button><button class="cm-secondary" data-decline="${x.id}">❌ RECUSAR</button></div></article>`).join('');
 cards+=others.slice(0,24).map(x=>`<article class="cm-challenge cm-completed"><b>${escapeHTML(kindName(x.scope))}</b> · ${escapeHTML(x.status)}<p>${escapeHTML(x.from.name)} — ${x.scoreA} pts${x.scoreB===null?'':' × '+x.scoreB+' pts'}</p></article>`).join('');
 modal(`<div id="cm-cloud-content"><h2>⚔️ Meus desafios</h2><p>${pend.length?'Você recebeu '+pend.length+' convite(s). Aceite ou recuse.':'Nenhum convite aguardando sua resposta.'}</p><div class="cm-actions"><button id="cm-create" class="cm-action">🏹 ENVIAR NOVO DESAFIO</button><button id="cm-refresh" class="cm-secondary">↻ ATUALIZAR</button></div><div class="cm-challenges">${cards||'<p>Você ainda não participou de desafios.</p>'}</div></div>`);
 G('cm-create').onclick=showCreate;G('cm-refresh').onclick=async()=>{await refresh();showInbox()};
 document.querySelectorAll('[data-accept]').forEach(b=>b.onclick=()=>acceptChallenge(b.dataset.accept));document.querySelectorAll('[data-decline]').forEach(b=>b.onclick=()=>declineChallenge(b.dataset.decline));
}
function chooseTargets(scope){
 const list=players();let values=[];
 if(scope==='individual')values=list.filter(x=>x.id!==me.id).map(x=>({id:x.id,label:'4º '+x.house+' · '+x.name}));
 if(scope==='team')values=['A','B','C'].flatMap(h=>TEAMS.filter(t=>!(h===me.house&&t===me.team)).map(t=>({id:h+'|'+t,label:'4º '+h+' · '+t})));
 if(scope==='class')values=Object.keys(HOUSES).filter(h=>h!==me.house).map(h=>({id:h,label:'4º '+h+' · '+HOUSES[h]}));
 return values.map(x=>`<option value="${escapeHTML(x.id)}">${escapeHTML(x.label)}</option>`).join('');
}
function showCreate(){if(!me)return showAccount();modal(`<div id="cm-cloud-content"><h2>🏹 Criar desafio</h2><p>Jogue primeiro suas cinco flechas. A pontuação ficará salva na planilha, esperando o adversário.</p><label>Modalidade<select id="cm-challenge-scope"><option value="individual">👤 Aluno contra aluno (mesma turma ou rival)</option><option value="team">🛡️ Equipe contra equipe</option><option value="class">🏰 4º A × 4º B × 4º C</option></select></label><label>Quem você quer desafiar?<select id="cm-challenge-target"></select></label><p class="cm-explain" id="cm-target-explain"></p><button id="cm-begin" class="cm-action">🎯 JOGAR E ENVIAR CONVITE</button></div>`);
 const scope=G('cm-challenge-scope'),target=G('cm-challenge-target');scope.value=selectedScope;
 const update=()=>{selectedScope=scope.value;target.innerHTML=chooseTargets(scope.value);G('cm-target-explain').textContent=scope.value==='individual'?'O aluno escolhido recebe o convite na própria conta.':scope.value==='team'?'O primeiro integrante da equipe adversária que aceitar representa a equipe nesta disputa.':'O primeiro representante da turma rival que aceitar participa deste confronto interclasses.';};scope.onchange=update;update();
 G('cm-begin').onclick=()=>{if(!target.value)return;draft={role:'create',scope:scope.value,target:target.value};launch()};
}
async function acceptChallenge(id){if(!me)return showAccount();const b=document.querySelector(`[data-accept="${id}"]`);if(b)b.disabled=true;try{const c=await api('accept',{id});ghost=c.shotsA||[];draft={role:'accept',id,scope:c.scope,scoreA:c.scoreA,from:c.from,ghost};launch()}catch(e){alert(e.message);await refresh();showInbox()}finally{if(b)b.disabled=false}}
async function declineChallenge(id){if(!confirm('Deseja recusar este desafio?'))return;try{await api('decline',{id});await refresh();showInbox()}catch(e){alert(e.message)}}
function launch(){close();if(!me||!draft)return;const house=document.querySelector(`.house[data-house="${me.house}"]`);house?.click();G('player').value=me.id;G('mode').value='practice';G('mode').dispatchEvent(new Event('change'));G('start-game').click();}
function onShot({number,match}){
 if(!draft||draft.role!=='accept'||!ghost.length)return;
 const arrow=ghost[number-1];if(!arrow)return;
 const el=G('cm-ghost');const pts=Number(arrow.score)||0;
 el.textContent='🏹 Oponente — flecha '+number+'/5: +'+pts+' pontos';el.classList.remove('show');void el.offsetWidth;el.classList.add('show');
}
async function onRoundFinished({shots}){
 if(!draft||!token)return;
 const context=draft;draft=null;
 const title=G('finish-title'),desc=G('finish-desc'),results=G('finish-results'),help=G('share-help');
 title.textContent='⏳ SALVANDO NO PLACAR ONLINE';desc.textContent='Enviando os cinco disparos para a planilha…';
 try{
  const x=context.role==='create'?await api('create',{scope:context.scope,target:context.target,shots}):await api('submit',{id:context.id,shots});
  if(context.role==='create'){
   title.textContent='⚔️ DESAFIO ENVIADO!';desc.textContent='Você fez '+x.score+' pontos. O convite aparecerá na conta do adversário ou equipe escolhida.';results.textContent='🏹 '+x.score+' PONTOS · AGUARDANDO ADVERSÁRIO';
  }else{
   const my=x.scoreB,other=x.scoreA;
   title.textContent=my>other?'🏆 VITÓRIA!':my===other?'🤝 EMPATE!':'🎯 DESAFIO CONCLUÍDO';
   desc.textContent='Sua pontuação: '+my+' · Adversário: '+other+' pontos.';
   results.textContent='⚔️ '+my+' × '+other+' PONTOS';
  }
  help.textContent='✓ Resultado registrado na planilha online ClassMana.';
  await refresh();await loadRankings();
 }catch(e){
  title.textContent='⚠️ NÃO FOI POSSÍVEL SALVAR';desc.textContent=e.message;help.textContent='Não feche esta página. Use a opção de tentar salvar novamente.';
  const actions=document.querySelector('.finish-actions');if(actions){const btn=document.createElement('button');btn.className='cm-action';btn.textContent='↻ TENTAR SALVAR NO PLACAR';btn.onclick=()=>{btn.remove();draft=context;onRoundFinished({shots})};actions.appendChild(btn)}
 }
}
function onMatchStart(){ghost=[];if(draft?.role==='accept')ghost=draft.ghost||[];}
async function loadRankings(){if(!ready)return;try{ranking=await api('rankings');renderRank()}catch(e){stamp('⚠️ Ranking online indisponível: '+e.message)}}
function rankingRows(rows,limit=20){return (rows||[]).slice(0,limit).map((r,i)=>`<div class="rankline cm-rank"><div><b>${['🥇','🥈','🥉'][i]||String(i+1)+'º'} ${escapeHTML(r.name)}</b><small>${r.plays} partida(s) · melhor ${r.best}/50</small></div><span>${r.average.toFixed(1).replace('.',',')} pts médios</span></div>`).join('')||'<p>Aguardando primeiras partidas oficiais.</p>'}
function renderRank(){if(!ranking)return;const h=G('rank-houses'),p=G('rank-players');if(!h||!p)return;h.innerHTML=rankingRows(ranking.houses,3);p.innerHTML=rankingRows(ranking.players,25);const label=document.querySelector('#view-ranking .notice');if(label)label.innerHTML='✅ <b>PLACAR ONLINE</b> · atualizado em '+new Date(ranking.updatedAt).toLocaleString('pt-BR')+' · registrado no banco exclusivo do torneio.';
 let team=G('cm-teams-ranking');if(!team){team=document.createElement('div');team.id='cm-teams-ranking';team.className='ranking-panel';team.innerHTML='<h2>🛡️ Ranking das equipes</h2><div id="cm-team-rows"></div>';document.querySelector('.ranking-layout')?.appendChild(team)}G('cm-team-rows').innerHTML=rankingRows(ranking.teams,18);}
initial();badgeState();if(URL){setInterval(()=>{if(me)refresh();if(ready)loadRankings()},60000)}
window.cmOnline={get draft(){return draft},get me(){return me},get ready(){return ready},onShot,onMatchStart,onRoundFinished,renderRank,showInbox,showAccount,showCreate,refresh,loadRankings};
})();