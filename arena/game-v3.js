import {initScene} from './scene-v3.js?v=5';
const $=id=>document.getElementById(id);
const H={A:{grade:'4º A',name:'Águia Dourada',color:'#78bdff'},B:{grade:'4º B',name:'Leão de Fogo',color:'#ff9778'},C:{grade:'4º C',name:'Dragão de Esmeralda',color:'#8defac'}};
const R=window.CLASSMANA_ROSTER||{A:[],B:[],C:[]};
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
let house='A',view='inicio',scene=null,match=null,reticle={x:.50,y:.45},pointerStart=0,holding=false,storage=[];
let incoming=null;
const rand=(a,b)=>a+Math.random()*(b-a);
function safeRead(){try{const a=JSON.parse(localStorage.getItem('classmana-archery-v2'));return Array.isArray(a)?a.filter(x=>x&&typeof x==='object').slice(-150):[]}catch{return []}}
storage=safeRead();
function persist(row){storage.push({...row,at:new Date().toISOString()});storage=storage.slice(-150);try{localStorage.setItem('classmana-archery-v2',JSON.stringify(storage))}catch{}renderRanking()}
function toast(s){const t=$('toast');t.textContent=s;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3100)}
function openView(name){if(name!=='arena'&&view==='arena'&&match?.running){match.running=false;match.locked=false;holding=false;$('stage').classList.remove('aiming','firing');scene?.setPower(0);}view=name;document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+name));document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.view===name));window.scrollTo({top:0,behavior:'instant'});if(name==='ranking')renderRanking()}
function choices(h){return (R[h]||[]).map((name,i)=>({id:h+String(i+1).padStart(2,'0'),name}));}
function fillPlayer(wanted){const sel=$('player');sel.innerHTML='<option value="guest">Arqueiro convidado</option>'+choices(house).map(p=>`<option value="${p.id}">${p.id} · ${p.name}</option>`).join('');if(wanted&&choices(house).some(x=>x.id===wanted))sel.value=wanted;fillRivals()}
function fillRivals(){const sel=$('rival');let other=Object.keys(H).filter(h=>h!==house).flatMap(choices);sel.innerHTML=other.map(p=>`<option value="${p.id}">${H[p.id[0]].grade} · ${p.id} · ${p.name}</option>`).join('');if(incoming&&incoming.rivalId===sel.value){} }
function selectHouse(k){
 house=k;
 document.querySelectorAll('.house').forEach(el=>{
  const selected=el.dataset.house===k;
  el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));
  el.querySelector('.house-check').textContent=selected?'✓ SELECIONADA':'ESCOLHER CASA';
 });
 const stage=$('stage');stage.classList.remove('house-a','house-b','house-c');stage.classList.add('house-'+k.toLowerCase());
 const logo={A:'brasao-4a-transparente.png',B:'arte-028.png',C:'arte-029.png'}[k];
 const badge=$('stage-house-badge');if(badge){badge.dataset.house=k;badge.querySelector('img').src='../assets/images/'+logo;badge.querySelector('strong').textContent=H[k].name;}
 scene?.setHouse(k);
 fillPlayer(incoming?.rivalId?.[0]===k?incoming.rivalId:null);
}
function updateMode(){const v=$('mode').value;$('difficulty-label').classList.toggle('hidden',v!=='bot');$('rival-label').classList.toggle('hidden',v!=='challenge')}
function byId(id){return choices(id?.[0]||'A').find(x=>x.id===id)?.name||'Arqueiro '+id}
function nameOf(id){return id==='guest'?'Arqueiro convidado':byId(id)}
function renderWind(wind){
 const widget=$('wind');if(!widget)return;
 const speed=Math.abs(wind),still=speed<0.15,left=wind<0;
 widget.classList.toggle('wind-left',!still&&left);
 widget.classList.toggle('wind-right',!still&&!left);
 widget.classList.toggle('wind-calm',still);
 widget.querySelector('.wind-speed').textContent=speed.toFixed(1).replace('.',',')+' km/h';
 const direction=still?'SEM DESVIO':left?'DESVIA À ESQUERDA':'DESVIA À DIREITA';
 widget.querySelector('.wind-direction-text').textContent=direction;
 widget.setAttribute('aria-label','Vento: '+speed.toFixed(1).replace('.',',')+' quilômetros por hora. '+direction.toLowerCase()+'.');
}
function uiHud(){if(!match)return;$('hud-player').textContent=match.player+' · '+H[match.house].grade;$('hud-bot').textContent=match.mode==='bot'?'🤖 Robô · '+({easy:'Fácil',medium:'Médio',hard:'Difícil'}[match.difficulty]):match.mode==='practice'?'🎯 Treinamento':match.incoming?'⚔️ '+byId(match.incoming.playerId):'⚔️ '+byId(match.rivalId);$('hud-score').textContent=match.scores.reduce((a,b)=>a+b,0);$('hud-rival').textContent=match.incoming?match.incoming.score:match.mode==='bot'?'?':'—';renderWind(match.wind);$('distance').textContent='🎯 '+Math.round(match.distance)+' METROS';$('shots').textContent='🏹 FLECHA '+Math.min(match.scores.length+1,5)+' / 5';$('power').textContent='⚡ FORÇA '+(holding?Math.round(clamp((Date.now()-pointerStart)/950,.2,1)*100):0)+'%';}
function worldSettings(){return {distance:match?.distance||25,shift:match?.shift||0,house:match?.house||house}}
function ensureScene(){if(!scene)scene=initScene($('world'),worldSettings);scene.setHouse(house)}
function changeTarget(){if(!match)return;match.distance=24+match.scores.length*2.3;match.shift=Math.round(rand(-8,8))/100;match.wind=Math.round(rand(-4.0,4.0)*10)/10;scene?.setTargetShift(match.shift);uiHud();}
function startMatch(){
 if(match?.running){match.running=false;match.locked=false;holding=false;$('stage').classList.remove('aiming','firing');scene?.setPower(0);}
 const userId=$('player').value,mode=incoming?'challenge':$('mode').value,rivalId=incoming?.playerId||$('rival').value;
 if(mode==='challenge'&&userId==='guest'){toast('Selecione seu arqueiro para desafiar outra Casa.');return}
 if(incoming&&userId!==incoming.rivalId){toast('Este desafio é destinado a '+incoming.rivalId+'.');return}
 if(mode==='challenge'&&!incoming&&userId[0]===rivalId[0]){toast('O adversário deve ser de outra turma.');return}
 match={house,playerId:userId,player:nameOf(userId),mode,difficulty:$('difficulty').value,rivalId,scores:[],running:true,locked:false,wind:0,distance:25,shift:0,incoming:incoming?{...incoming}:null,seed:Math.floor(rand(100000,999999))};
 reticle={x:.50,y:.45};$('finish').classList.add('hidden');$('instruction').textContent='MOVA OU ARRASTE PARA MIRAR • SEGURE PARA PUXAR • SOLTE PARA ATIRAR';
 openView('arena');ensureScene();changeTarget();updateReticle();
}
function updateReticle(){
  // Mouse/touch drives the bow. There is no second, independent crosshair.
  scene?.setAim(reticle.x,reticle.y);
}
function aim(e){const rect=$('stage').getBoundingClientRect();reticle.x=clamp((e.clientX-rect.left)/rect.width,.08,.95);reticle.y=clamp((e.clientY-rect.top)/rect.height,.11,.91);updateReticle()}
function levelScore(x,y,r){const norm=Math.hypot(x,y)/r;return norm>1?0:Math.max(1,10-Math.floor(norm*10))}
async function fire(power){
 if(!match?.running||match.locked||match.scores.length>=5)return;
 const currentMatch=match;match.locked=true;holding=false;$('stage').classList.remove('aiming');
 const w=$('stage').clientWidth,h=$('stage').clientHeight;
 const t=scene?.getTargetMetrics?.()||{x:w*(.5+match.shift),y:h*.45,r:Math.min(h*.105,w*.082)};
 // Use the exact visible centre of the ring attached to the bow, NOT the mouse.
 const sight=scene?.getAimPoint?.();
 if(!sight||!Number.isFinite(sight.x)||!Number.isFinite(sight.y)){
   match.locked=false;return toast('A mira ainda não está pronta.');
 }
 // Wind and low draw strength change the impact relative to that sight.
 const drift=match.wind*t.r*.040;
 const jitter=(1-power)*t.r*.14;
 const ix=sight.x*w+drift+rand(-.08,.08)*jitter;
 const iy=sight.y*h+(1-power)*t.r*.70+rand(-.06,.06)*jitter;
 const score=levelScore(ix-t.x,iy-t.y,t.r);
 $('stage').classList.add('firing');
 try{await Promise.race([scene?.fire?.({x:ix/w,y:iy/h,power}),new Promise(resolve=>setTimeout(resolve,1100))]);}catch(e){console.warn('Animação da flecha:',e);}
 $('stage').classList.remove('firing');
 if(match!==currentMatch||!currentMatch.running)return;
 scene?.impact?.({x:ix/w,y:iy/h,score});
 match.scores.push(score);
 $('hud-score').textContent=match.scores.reduce((a,b)=>a+b,0);
 showHit(score,ix/w,iy/h);
 if(score===10)toast('🎯 ACERTO PERFEITO! +10 pontos');
 if(match.scores.length>=5){setTimeout(()=>{if(match===currentMatch&&currentMatch.running)finishMatch()},820)}
 else{setTimeout(()=>{if(match===currentMatch&&currentMatch.running){changeTarget();match.locked=false;}},640)}
}
function showHit(score,x,y){const el=$('hit');el.textContent=score?'+'+score+' PONTOS':'FORA DO ALVO';el.style.left=(x*100)+'%';el.style.top=clamp(y*100-12,18,64)+'%';el.classList.remove('show');void el.offsetWidth;el.classList.add('show')}
function chooseRobotScore(difficulty,playerAverage){const base={easy:5.1,medium:6.7,hard:8.15}[difficulty],adjust=clamp((playerAverage-5.5)*.17,-.7,.7);let result=clamp(base+adjust+rand(-3.3,3.3),0,10);return result>=9.25?10:result>=7?8:result>=5?6:result>=3?4:result>=1.5?2:0;}
function finishMatch(){if(!match)return;match.running=false;match.locked=true;const total=match.scores.reduce((a,b)=>a+b,0),bot=match.mode==='bot'?Array.from({length:5},()=>chooseRobotScore(match.difficulty,total/5)):[],rivalScore=match.mode==='bot'?bot.reduce((a,b)=>a+b,0):match.incoming?.score;
 let title='',desc='';if(match.mode==='practice'){title=total>=37?'MIRA LENDÁRIA!':'TREINAMENTO CONCLUÍDO';desc='Você conquistou '+total+' de 50 pontos nesta rodada.'}else if(match.mode==='challenge'&&!match.incoming){title='DESAFIO PREPARADO!';desc='Sua pontuação: '+total+' pontos. Compartilhe o link com o adversário.'}else{title=total>rivalScore?'VITÓRIA DA SUA CASA!':total===rivalScore?'EMPATE HONROSO!':'A PRÓXIMA FLECHA SERÁ SUA!';desc='Você fez '+total+' pontos contra '+rivalScore+' pontos do adversário.'}
 $('finish-title').textContent=title;$('finish-desc').textContent=desc;$('finish-results').textContent=`🏹 ${total} PTS   ${rivalScore===undefined?'🏆 AGUARDANDO RIVAL':'⚔️ '+rivalScore+' PTS'}`;
 $('share-result').classList.toggle('hidden',match.mode!=='challenge');$('share-result').textContent=match.incoming?'🔗 COMPARTILHAR RESULTADO':'🔗 COPIAR DESAFIO';$('share-help').textContent=match.mode==='challenge'?'O link funciona em outro celular/computador, mas ainda não alimenta um ranking online automático.':'Rodada salva neste navegador.';
 if(match.playerId!=='guest')persist({house:match.house,id:match.playerId,score:total,mode:match.mode,win:rivalScore===undefined?null:total>rivalScore});if(match.mode==='challenge'&&match.incoming){persist({house:match.incoming.house,id:match.incoming.playerId,score:match.incoming.score,mode:'rival'});} $('finish').classList.remove('hidden');uiHud();}
function encode(d){const s=JSON.stringify(d),arr=new TextEncoder().encode(s);let bs='';arr.forEach(v=>bs+=String.fromCharCode(v));return btoa(bs).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function decode(s){const b=s.replace(/-/g,'+').replace(/_/g,'/');const raw=atob(b);return JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0))))}
function createLink(){if(!match)return;const total=match.scores.reduce((a,b)=>a+b,0);let d=match.incoming?{v:2,complete:true,a:{house:match.incoming.house,id:match.incoming.playerId,score:match.incoming.score},b:{house:match.house,id:match.playerId,score:total}}:{v:2,playerId:match.playerId,house:match.house,rivalId:match.rivalId,score:total,seed:match.seed};return `${location.href.split('#')[0]}#duel=${encode(d)}`;}
async function share(){const link=createLink();try{await navigator.clipboard.writeText(link);toast('Link copiado! Envie ao outro arqueiro.')}catch{window.prompt('Copie o link do desafio:',link)}}
function processLink(){try{const h=location.hash;if(!h.startsWith('#duel='))return;const d=decode(h.slice(6));if(d.v!==2)return;if(d.complete){toast('Resultado compartilhado: '+d.a.score+' × '+d.b.score+' pontos.');location.hash='';return}if(typeof d.playerId!=='string'||typeof d.rivalId!=='string'||!H[d.house]||!H[d.rivalId[0]]||d.house===d.rivalId[0]||!Number.isInteger(d.score)||d.score<0||d.score>50||!choices(d.house).some(x=>x.id===d.playerId)||!choices(d.rivalId[0]).some(x=>x.id===d.rivalId))return;incoming=d;selectHouse(d.rivalId[0]);$('player').value=d.rivalId;$('mode').value='challenge';updateMode();$('rival-label').classList.add('hidden');$('difficulty-label').classList.add('hidden');toast('⚔️ Desafio recebido de '+byId(d.playerId)+' — '+d.score+' pontos!');$('hero-play').textContent='⚔️ ACEITAR O DESAFIO';}catch(e){console.warn('Desafio inválido',e)}}
function renderRanking(){const points=new Map();for(const e of storage){if(!H[e.house]||!e.id||!Number.isFinite(e.score))continue;const p=points.get(e.id)||{id:e.id,house:e.house,total:0,plays:0,wins:0,best:0};p.total+=e.score;p.plays++;p.best=Math.max(p.best,e.score);if(e.win)p.wins++;points.set(e.id,p)}const ranked=[...points.values()].sort((a,b)=>b.total-a.total);const byH=Object.keys(H).map(k=>{const ps=ranked.filter(p=>p.house===k);return{k,n:ps.length,total:ps.reduce((a,b)=>a+b.total,0),average:ps.length?Math.round(ps.reduce((a,b)=>a+b.total/b.plays,0)/ps.length):0}}).sort((a,b)=>b.average-a.average);
 $('rank-houses').innerHTML=byH.map((a,i)=>`<div class="rankline"><div style="color:${H[a.k].color}"><b>${['🥇','🥈','🥉'][i]} ${H[a.k].name}</b><small>${a.n} arqueiro(s) com partidas neste navegador</small></div><span>${a.average?a.average+' pts médios':'Sem partidas'}</span></div>`).join('');$('rank-players').innerHTML=ranked.length?ranked.slice(0,15).map((p,i)=>`<div class="rankline"><div><b>${i+1}º · ${nameOf(p.id)}</b><small>${H[p.house].grade} · ${p.plays} partidas · melhor ${p.best} pts</small></div><span>${p.total} pts</span></div>`).join(''):'<div class="empty">Nenhuma partida registrada aqui ainda. Entre na arena e inaugure o placar!</div>'}
// Interações do jogo.
document.querySelectorAll('.nav-link').forEach(el=>el.addEventListener('click',()=>openView(el.dataset.view)));
document.querySelectorAll('.house').forEach(el=>el.addEventListener('click',()=>selectHouse(el.dataset.house)));
$('hero-play').addEventListener('click',()=>{if(incoming){startMatch();return}$('setup').scrollIntoView({behavior:'smooth',block:'center'});toast('Escolha seu arqueiro ou jogue como convidado!')});
$('mode').addEventListener('change',updateMode);$('start-game').addEventListener('click',startMatch);$('rank-play').addEventListener('click',()=>openView('inicio'));$('rules-play').addEventListener('click',()=>openView('inicio'));$('leave-arena').addEventListener('click',()=>{if(match?.running&&!confirm('Abandonar a rodada atual e começar uma nova depois?'))return;openView('inicio')});$('play-again').addEventListener('click',()=>{match.running=false;startMatch()});$('share-result').addEventListener('click',share);
const world=$('world');world.addEventListener('pointerdown',e=>{if(!match?.running||match.locked)return;e.preventDefault();world.setPointerCapture(e.pointerId);holding=true;pointerStart=Date.now();aim(e);scene?.setPower(.28);$('stage').classList.add('aiming');$('instruction').textContent='ARRASTE PARA MOVER O ARCO • SOLTE PARA ATIRAR'});world.addEventListener('pointermove',e=>{if(!match?.running||match.locked)return;if(holding||e.pointerType==='mouse')aim(e);if(holding)scene?.setPower(clamp((Date.now()-pointerStart)/950,.28,1))});world.addEventListener('pointerup',e=>{if(!holding)return;e.preventDefault();aim(e);holding=false;$('stage').classList.remove('aiming');$('instruction').textContent='MOVA OU ARRASTE PARA MIRAR • SEGURE PARA PUXAR • SOLTE PARA ATIRAR';const p=clamp((Date.now()-pointerStart)/950,.28,1);scene?.setPower(p);fire(p);uiHud()});world.addEventListener('pointercancel',()=>{holding=false;$('stage').classList.remove('aiming');scene?.setPower(0)});
document.addEventListener('keydown',e=>{if(view!=='arena'||!match?.running||match.locked)return;let action=true;const step=e.shiftKey?.022:.008;switch(e.code){case'ArrowUp':reticle.y=clamp(reticle.y-step,.1,.9);break;case'ArrowDown':reticle.y=clamp(reticle.y+step,.1,.9);break;case'ArrowLeft':reticle.x=clamp(reticle.x-step,.08,.92);break;case'ArrowRight':reticle.x=clamp(reticle.x+step,.08,.92);break;case'Space':fire(1);break;default:action=false}if(action){e.preventDefault();updateReticle()}});
setInterval(()=>{if(holding){scene?.setPower(clamp((Date.now()-pointerStart)/950,.28,1));uiHud()}},90);
selectHouse('A');updateMode();processLink();renderRanking();