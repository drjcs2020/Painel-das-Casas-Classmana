// Interface, carrossel, placares e interações do painel V15.
document.getElementById("gameLogo").src=A.logo;


// Carrossel funcional das três Casas
const castleSlides=[
 {img:"assets/images/arte-034.webp",label:"4º A • Águia Dourada"},
 {img:"assets/images/arte-035.webp",label:"4º B • Leão de Fogo"},
 {img:"assets/images/arte-036.webp",label:"4º C • Dragão de Esmeralda"}
];
let castleIndex=0;
const castleTrack=document.getElementById("castleCarouselTrack"), castleDots=document.getElementById("castleCarouselDots");
castleTrack.innerHTML=castleSlides.map(x=>`<div class="castleSlide"><img src="${x.img}" alt="${x.label}"><span>${x.label}</span></div>`).join("");
castleDots.innerHTML=castleSlides.map((_,i)=>`<button aria-label="Mostrar Casa ${i+1}" onclick="goCastle(${i})"></button>`).join("");
function goCastle(i){castleIndex=i;castleTrack.style.transform=`translateX(-${i*100}%)`;[...castleDots.children].forEach((b,j)=>b.classList.toggle("active",j===i));}
goCastle(0); setInterval(()=>goCastle((castleIndex+1)%3),4200);

// Rodapé permanente da Batalha dos Monstros
const monsterNames=["Fantasma","Golem de Lava","Mega-Aranha","Flor das Presas","Mestre da Colmeia","Duquesa Aranha","Morcego Vampiro","Hidra","Rainha Aranha"];
const monsterDiff=[6,6.5,7,7,7.5,8,8,9,9.5];
document.getElementById("battleFooterGrid").innerHTML=A.monsters.map((m,i)=>`<div class="battleMonster" onclick="showPop('Batalha de Monstros','${monsterNames[i]} • dificuldade ${monsterDiff[i]}.','index')"><img src="${m}" alt="${monsterNames[i]}"><b>${monsterNames[i]}</b><small>Dificuldade ${monsterDiff[i]}</small></div>`).join("");

const RC=document.getElementById("realCards");
const crestMap={A:A.crestsApproved[0],B:A.crestsApproved[1],C:A.crestsApproved[2]};
function resourceModal(key,h){
 const extra={
  hp:`Valor atual: ${h.hp}/10. O HP representa a vida dos heróis e é influenciado pelas atitudes registradas no ClassMana.`,
  level:`Nível médio atual: ${h.level}/40. O nível evolui com XP e representa a progressão dos avatares.`,
  mana:`Mana média atual: ${h.mana}. É o recurso mágico usado em poderes e benefícios pedagógicos.`,
  gold:`Ouro médio atual: ${h.gold}. É a economia virtual que pode ser poupada e trocada por recompensas reais definidas pelo professor.`,
  index:`Índice atual: ${h.score.toFixed(2)}. Resume o desempenho coletivo da Casa a partir dos cinco eixos do painel. Cálculo atual: Convivência 40%, Tecnologia 25%, Aprendizagem 15%, Desafios 10% e Missões 10%.`
 };
 showPop(key==="index"?"Índice ClassMana":key==="hp"?"HP • Vida":key==="level"?"XP • Nível":key==="mana"?"Mana":"Ouro",extra[key],key);
}
function showPop(title,txt,key){
 let icons={hp:"❤️",level:"⭐",mana:"🧪",gold:"🪙",index:"⚔️"};
 let p=document.getElementById("pop"); if(!p){p=document.createElement("div");p.id="pop";p.className="pop";p.innerHTML='<div class="popCard"><button class="popClose" onclick="closePop()">✕</button><div class="popTop"><div class="popIcon" id="popIcon"></div><h3 id="popTitle"></h3></div><p id="popText"></p></div>';document.body.appendChild(p)}
 document.getElementById("popIcon").textContent=icons[key]||"✨";document.getElementById("popTitle").textContent=title;document.getElementById("popText").textContent=txt;p.classList.add("open")
}
function closePop(){document.getElementById("pop")?.classList.remove("open")}
Object.entries(H).forEach(([k,h])=>{
 RC.insertAdjacentHTML("beforeend",`<article class="realm ${k}">
 <div class="crestReal"><img src="${crestMap[k]}" alt="${h.turma} ${h.casa}"></div>
 
 <div class="indexReal" onclick="resourceModal('index',H['${k}'])"><small>⚔️ ÍNDICE CLASSMANA</small><b>${h.score.toFixed(2)}</b></div>
 <div class="liveStats">
  <button class="liveStat" onclick="resourceModal('hp',H['${k}'])"><span class="liveIcon">❤️</span><span class="liveVal">${h.hp}/10</span><span class="liveLabel">HP MÉDIO</span></button>
  <button class="liveStat" onclick="resourceModal('level',H['${k}'])"><span class="liveIcon">⭐</span><span class="liveVal">Nv. ${h.level}</span><span class="liveLabel">NÍVEL / 40</span></button>
  <button class="liveStat" onclick="resourceModal('mana',H['${k}'])"><span class="manaLive"></span><span class="liveVal">${h.mana}</span><span class="liveLabel">MANA MÉDIA</span></button>
  <button class="liveStat" onclick="resourceModal('gold',H['${k}'])"><span class="liveIcon">🪙</span><span class="liveVal">${h.gold}</span><span class="liveLabel">OURO MÉDIO</span></button>
 </div>
 <button class="enterRealm" onclick="openHouse('${k}')">ENTRAR NO ${h.turma} ➜</button>
 </article>`)
});


let rankMode="houses", rankClass="ALL", rankTeam="ALL";

function showMain(which){
 document.getElementById("casasMain").style.display=which==="casas"?"block":"none";
 document.getElementById("rankingMain").classList.toggle("active",which==="ranking");
 document.getElementById("navCasas").classList.toggle("active",which==="casas");
 document.getElementById("navRanking").classList.toggle("active",which==="ranking");
 if(which==="ranking") renderRanking();
}
function setRankMode(mode,btn){
 rankMode=mode; rankClass="ALL"; rankTeam="ALL";
 document.querySelectorAll(".rankTab").forEach(x=>x.classList.remove("active")); btn.classList.add("active");
 renderRanking();
}
function rankFilters(){
 const f=document.getElementById("rankFilters");
 if(rankMode==="houses"){f.innerHTML="";return}
 let s=`<button class="filterBtn ${rankClass==="ALL"?"active":""}" onclick="rankClass='ALL';rankTeam='ALL';renderRanking()">Geral</button>`;
 ["A","B","C"].forEach(k=>s+=`<button class="filterBtn ${rankClass===k?"active":""}" onclick="rankClass='${k}';rankTeam='ALL';renderRanking()">${H[k].turma}</button>`);
 if(rankMode==="students" && rankClass!=="ALL"){
   s+=`<select class="filterBtn" onchange="rankTeam=this.value;renderRanking()"><option value="ALL">Todas as equipes</option>${teamNames.map(n=>`<option ${rankTeam===n?"selected":""}>${n}</option>`).join("")}</select>`;
 }
 f.innerHTML=s;
}
function podium(rows,type){
 const top=rows.slice(0,3); if(!top.length)return "";
 const order=top.length===3?[top[1],top[0],top[2]]:top;
 return `<div class="podium">${order.map(r=>{let actual=rows.indexOf(r)+1;return `<div class="podiumCard ${actual===1?"first":actual===2?"second":"third"}"><div class="podiumPos">${actual===1?"🥇":actual===2?"🥈":"🥉"}</div><img src="${r.img||A.logo}"><div class="podiumName">${r.name}</div><div class="podiumScore">${type==="students"?r.xp.toLocaleString('pt-BR')+" XP":type==="teams"?r.xp.toLocaleString('pt-BR')+" XP médio":r.score.toFixed(2)}</div>${type==="houses"?`<span class="houseXpLabel">XP MÉDIO</span><div class="houseXpHighlight">${r.xp.toLocaleString('pt-BR')} XP</div>`:`<small>${r.sub||""}</small>`}</div>`}).join("")}</div>`;
}
function table(rows,type){
 let metric=type==="students"?"XP / Nível":type==="teams"?"XP médio":"Índice";
 return `<table class="rankTable"><thead><tr><th>#</th><th>${type==="students"?"Herói":"Participante"}</th><th>Casa</th><th>Equipe</th><th>${metric}</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}º</td><td><span class="rankBadge">${r.img?`<img src="${r.img}">`:""}<b>${r.name}</b></span></td><td>${r.house||"—"}</td><td>${r.team||"—"}</td><td><b>${type==="students"?r.xp.toLocaleString('pt-BR')+" XP • Nv. "+r.level:type==="teams"?r.xp.toLocaleString('pt-BR')+" XP":r.score.toFixed(2)+" • "+r.xp.toLocaleString('pt-BR')+" XP médio"}</b></td></tr>`).join("")}</tbody></table>`;
}
function teamRows(){let rows=[];["A","B","C"].forEach(k=>{if(rankClass!=="ALL"&&rankClass!==k)return;teamNames.forEach((team,i)=>{let ss=STUDENTS.filter(x=>x.house===k&&x.team===team);if(ss.length)rows.push({name:team,xp:Math.round(ss.reduce((a,b)=>a+b.xp,0)/ss.length),house:H[k].turma,team:team,img:A.shields[i],sub:ss.length+" integrantes"})})});return rows.sort((a,b)=>b.xp-a.xp)}
function renderRanking(){
 rankFilters(); let rows=[];
 if(rankMode==="houses") rows=Object.entries(H).map(([k,h])=>({name:h.casa,score:h.score,xp:h.xp,house:h.turma,team:"—",img:A.crestsApproved[["A","B","C"].indexOf(k)],sub:"Índice ponderado • XP médio "+h.xp.toLocaleString('pt-BR')})).sort((a,b)=>b.score-a.score);
 else if(rankMode==="teams") rows=teamRows();
 else rows=STUDENTS.filter(x=>(rankClass==="ALL"||x.house===rankClass)&&(rankTeam==="ALL"||x.team===rankTeam)).map(x=>({...x,house:H[x.house].turma,img:A.shields[teamNames.indexOf(x.team)]})).sort((a,b)=>b.xp-a.xp||b.gold-a.gold);
 document.getElementById("rankContent").innerHTML=podium(rows,rankMode)+table(rows,rankMode);
}

const defs={
index:"Índice ClassMana: visão resumida do desempenho coletivo da Casa, formado pelos cinco eixos normalizados e ponderados a partir dos registros do próprio ClassMana.",
hp:"❤️ HP é a vida dos heróis. A média mostra como está a saúde coletiva da turma; atitudes negativas retiram vida e atitudes positivas podem recuperá-la.",
level:"⭐ Nível médio resume a progressão dos avatares por XP. A escala usada no projeto vai até o nível 40.",
mana:"🔮 Mana é o recurso mágico usado para poderes e benefícios pedagógicos. Aqui aparece a média disponível da turma.",
gold:"🪙 Ouro é a economia virtual do ClassMana. Aqui aparece a média por aluno; o saldo pode ser economizado e trocado por recompensas reais definidas pelo professor."
};
const axes={
conv:["🛡️","Convivência e Responsabilidade","Respeito, organização, foco, cuidado com materiais e espaços, atitudes positivas, advertências e evolução do clima da turma.",A.people],
tech:["💻","Tecnologia e Aprendizagem Digital","Participação e desempenho nas atividades digitais e de Informática registradas no ecossistema ClassMana.",A.heroes],
learn:["📚","Aprendizagem e Compromisso","Tarefas, avaliações, participação, desempenho e evolução da aprendizagem.",A.level],
comp:["⚔️","Desafios e Competições","Batalha de Monstros, Baú dos Enigmas, olimpíadas, torneios, jogos e outras conquistas.",A.monsters[7]],
mission:["🧭","Missões e Projetos","Missões ClassMana, robótica, maker, sustentabilidade e projetos especiais.",A.chest]
};
function mana(){return '<span class="manaBottle"></span>'}
function stat(icon,val,key){return `<div class="stat" onclick="event.stopPropagation();alert(defs['${key}'])"><span class="emoji">${icon}</span>${val}<span class="tip">${defs[key]}</span></div>`}

function openHouse(k){
 const h=H[k], d=document.getElementById("detail");
 const bars=Object.entries(axes).map(([a,x])=>`<div class="axis" onclick="axisInfo('${a}','${k}')"><img class="guide" src="${x[3]}"><div><div class="axisline"><span>${x[0]} ${x[1]}</span><span>${h.axes[a].toFixed(1)}/10</span></div><div class="bar"><div class="fill" style="width:${h.axes[a]*10}%"></div></div></div></div>`).join("");
 d.innerHTML=`<div class="detailHead"><h2>${h.turma} • ${h.casa}</h2><button class="close" onclick="closeD()">Fechar ✕</button></div><div class="tabs"><button class="tab active" onclick="showView('house',this)">🏰 Visão da Casa</button><button class="tab" onclick="showView('teams',this)">🛡️ Equipes</button><button class="tab" onclick="showView('heroes',this)">⭐ Heróis</button></div>
 <div id="house" class="view active"><div class="grid"><div class="panel"><h3>✨ Os 5 eixos da Casa</h3>${bars}<div class="info" id="axisInfo"><img src="${A.people}"><div><strong>Explore o painel.</strong><br>Clique em cada eixo para entender o que ele mede. As notas foram recalculadas com os registros consolidados nesta atualização, normalizados por turma.</div></div></div>
 <div class="panel"><h3>🎒 Recursos ClassMana</h3><div class="resources"><div class="resource" onclick="resInfo('hp')">❤️ HP médio<b>${h.hp} / 10</b><small>Vida coletiva dos heróis</small></div><div class="resource" onclick="resInfo('level')">⭐ Nível médio<b>${h.level} / 40</b><small>Progressão por XP</small></div><div class="resource" onclick="resInfo('mana')">${mana()} Mana média<b>${h.mana}</b><small>Poderes pedagógicos</small></div><div class="resource" onclick="resInfo('gold')">🪙 Ouro médio<b>${h.gold}</b><small>Economia e recompensas</small></div></div><div class="info" id="resInfo"><img src="${A.chest}"><div><strong>Clique em um recurso.</strong><br>A explicação aparecerá aqui junto de um elemento visual do próprio universo ClassMana.</div></div></div></div>
 </div>
 <div id="teams" class="view"><div class="panel"><h3>🛡️ Equipes de ${h.turma}</h3><div class="snapshotNote">Dados individuais atualizados: 18/10/2026</div><div class="teamgrid">${teamNames.map((n,i)=>{let ss=STUDENTS.filter(x=>x.house===k&&x.team===n);let av=ss.length?Math.round(ss.reduce((a,b)=>a+b.xp,0)/ss.length):0;return `<div class="team" onclick="teamInfo(${i},'${k}')"><img src="${A.shields[i]}"><div><h4>${i+1}. ${n}</h4><div class="tscore">${av.toLocaleString('pt-BR')} XP</div><small>Média por integrante</small></div></div>`}).join("")}</div><div class="info" id="teamInfo"><img src="${A.teams}"><div><strong>Selecione uma equipe.</strong><br>Cada equipe poderá abrir seus cinco eixos, recursos agregados, evolução e integrantes.</div></div></div></div>
 <div id="heroes" class="view"><div class="panel"><h3>⭐ Heróis da Casa</h3><div class="snapshotNote">Dados individuais atualizados: 18/10/2026</div><div class="herobox"><img src="${A.heroes}"><div><p>Esta camada acompanha a evolução individual dentro do mesmo universo visual do ClassMana.</p><div class="students">${STUDENTS.filter(x=>x.house===k).sort((a,b)=>b.xp-a.xp).map(x=>`<div class="student">${x.name}<br><b>${x.xp.toLocaleString('pt-BR')} XP • Nível ${x.level}</b></div>`).join("")}</div><div class="privacy">No painel público, dados sensíveis de advertências individuais não precisam ser expostos.</div></div></div></div></div>`;
 d.classList.add("open");d.scrollIntoView({behavior:"smooth",block:"start"});
}
function showView(id,b){document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active")}
function axisInfo(a,k){let x=axes[a],h=H[k];document.getElementById("axisInfo").innerHTML=`<img src="${x[3]}"><div><strong>${x[0]} ${x[1]} — ${h.axes[a].toFixed(1)}/10</strong><br>${x[2]}<br><small>Pesos: Convivência 40% • Tecnologia 25% • Aprendizagem 15% • Desafios 10% • Missões 10%.</small></div>`}
function resInfo(key){let img=key==="gold"?A.dragon:key==="level"?A.level:key==="mana"?A.people:A.heroes;document.getElementById("resInfo").innerHTML=`<img src="${img}"><div><strong>${defs[key]}</strong><br><small>O valor exibido corresponde à fotografia consolidada da Casa nesta atualização.</small></div>`}
function teamInfo(i,k){let ss=STUDENTS.filter(x=>x.house===k&&x.team===teamNames[i]);let av=ss.length?Math.round(ss.reduce((a,b)=>a+b.xp,0)/ss.length):0;document.getElementById("teamInfo").innerHTML=`<img src="${A.shields[i]}"><div><strong>${teamNames[i]} • ${av.toLocaleString('pt-BR')} XP médio</strong><br>${ss.length} integrante${ss.length===1?'':'s'} na fotografia individual de 18/10/2026. O ranking de equipes utiliza XP médio por integrante.</div>`}
function closeD(){document.getElementById("detail").classList.remove("open")}
// ============================================================
// PAINEL CLASSMANA - DADOS E RECÁLCULO COMPLETO (18/10/2026)
// ============================================================

// 1. Atualiza a data no cabeçalho do painel
document.addEventListener("DOMContentLoaded", function() {
  const updateElem = document.getElementById("lastUpdate");
  if (updateElem) {
    updateElem.innerHTML = '📅 Última atualização: <strong>18/10/2026</strong>';
  }
});

// 2. Registra os dados atualizados das 3 turmas / casas
const H_UPDATED = H;

// 3. Recalcula médias, pontos e rankings dinamicamente
function recalculateAllHouses() {
  if (typeof H !== 'undefined') {
    Object.keys(H_UPDATED).forEach(k => {
      H[k] = Object.assign(H[k] || {}, H_UPDATED[k]);
    });
  }
  
  if (typeof STUDENTS !== 'undefined' && Array.isArray(STUDENTS)) {
    ["A", "B", "C"].forEach(k => {
      let ss = STUDENTS.filter(x => x.house === k);
      if (!ss.length) return;
      
      let total = ss.length;
      H[k].students = total;
      H[k].totalXp = ss.reduce((a, b) => a + (b.xp || 0), 0);
      H[k].xp = Math.round(H[k].totalXp / total);
      H[k].hp = +(ss.reduce((a, b) => a + (b.hp || 0), 0) / total).toFixed(2);
      H[k].level = +(ss.reduce((a, b) => a + (b.level || 0), 0) / total).toFixed(2);
      H[k].mana = +(ss.reduce((a, b) => a + (b.mana || 0), 0) / total).toFixed(2);
      H[k].gold = Math.round(ss.reduce((a, b) => a + (b.gold || 0), 0) / total);
      
      let ax = H[k].axes;
      if (ax) {
        H[k].score = +(
          ax.conv * 0.40 + 
          ax.tech * 0.25 + 
          ax.learn * 0.15 + 
          ax.comp * 0.10 + 
          ax.mission * 0.10
        ).toFixed(2);
      }
    });
  }
  
  if (typeof renderRanking === 'function') {
    renderRanking();
  }
}

// Executa o recálculo ao carregar a página
recalculateAllHouses();
