/**
 * ClassMana Arena — Google Apps Script backend V1.
 * Dedicated spreadsheet, never writes pedagogical XP/HP/Ouro.
 * Deployment: execute as ME, access ANYONE, XFrameOptions ALLOWALL.
 * Authentication: teacher-issued per-student secret, expiring sessions.
 */
const CM_SPREADSHEET_ID = '18UoJDmBL_xS67tzSpoYZv9VrQarTB_bwXXI8WQtAc2Q';
const CM_ALLOWED_ORIGIN = 'https://drjcs2020.github.io';
const CM_VERSION = 1;
const CM_H = {A:'Águia Dourada',B:'Leão de Fogo',C:'Dragão de Esmeralda'};
const CM_FIELDS = {
 Alunos:['ID','Apelido','Casa','Equipe','PIN do professor','Ativo'],
 Desafios:['ID','Tipo','Criador','Alvo','Status','Criado em','Atualizado em','Limite por lado','JSON da partida'],
 Disparos:['ID','Desafio ID','Aluno ID','Casa','Equipe','Pontuação','Flechas JSON','Criado em'],
 Sessoes:['Token','Aluno ID','Expira em','Criado em'],
 Eventos:['ID','Desafio ID','Aluno ID','Ação','Detalhes','Criado em']
};
const CM_TTL = 7*24*60*60*1000;
function cmBook_(){return SpreadsheetApp.openById(CM_SPREADSHEET_ID)}
function cmTab_(name){const t=cmBook_().getSheetByName(name);if(!t)throw Error('Aba ausente: '+name);return t}
function cmRows_(name){const t=cmTab_(name),values=t.getDataRange().getValues(),header=values.shift();return values.filter(r=>r[0]!==''&&r[0]!==null).map((r,i)=>Object.fromEntries(header.map((h,j)=>[h,r[j]]).concat([['_row',i+2]])))}
function cmAppend_(name,data){const keys=CM_FIELDS[name],t=cmTab_(name);t.appendRow(keys.map(k=>data[k]===undefined?'':data[k]));return t.getLastRow()}
function cmSet_(name,row,field,value){const i=CM_FIELDS[name].indexOf(field);if(i<0)throw Error('Campo inválido');cmTab_(name).getRange(row,i+1).setValue(value)}
function cmIso_(){return new Date().toISOString()}
function cmId_(){return Utilities.getUuid()}
function cmJson_(s){try{return JSON.parse(String(s||'{}'))}catch{return {}}}
function cmStudent_(id){return cmRows_('Alunos').find(x=>x.ID===id&&x.Ativo!==false)}
function cmPublicStudent_(s){return {id:s.ID,name:s.Apelido,house:s.Casa,team:s.Equipe}}
function cmLogged_(token){if(typeof token!=='string'||token.length<30)throw Error('Faça login no ClassMana.');const ses=cmRows_('Sessoes').find(x=>x.Token===token&&new Date(x['Expira em']).getTime()>Date.now());if(!ses)throw Error('Sessão expirada. Entre novamente.');const stu=cmStudent_(ses['Aluno ID']);if(!stu)throw Error('Perfil do aluno não encontrado.');return stu}
function cmEvent_(challenge,id,action,details){cmAppend_('Eventos',{'ID':cmId_(),'Desafio ID':challenge||'','Aluno ID':id||'','Ação':action,'Detalhes':JSON.stringify(details||{}),'Criado em':cmIso_()})}
function cmPinSetup(){
 // Execute only once from the Apps Script editor as the spreadsheet owner.
 // PINs are visible only to the teacher in the private Alunos sheet.
 const t=cmTab_('Alunos'),students=cmRows_('Alunos');let count=0;
 for(const s of students){if(!s['PIN do professor']){const pin=Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase();t.getRange(s._row,5).setValue(pin);count++}}
 cmTab_('Config').getRange('B8').setValue('PINs gerados: '+count);
 return 'PINs gerados para '+count+' alunos.';
}
function cmAttempt_(id){const c=CacheService.getScriptCache(),k='cm_pin_'+id,n=Number(c.get(k)||0);if(n>=6)throw Error('Muitas tentativas. Tente novamente mais tarde.');return {cache:c,key:k,count:n}}
function cmLogin_(request){const id=String(request.id||'').trim().toUpperCase(),pin=String(request.pin||'').trim().toUpperCase();if(!/^[ABC]\d{2}$/.test(id)||pin.length<6)throw Error('Código e PIN inválidos.');const at=cmAttempt_(id),stu=cmStudent_(id);if(!stu||!stu['PIN do professor']||String(stu['PIN do professor']).trim().toUpperCase()!==pin){at.cache.put(at.key,String(at.count+1),900);throw Error('Código ou PIN incorretos.')}at.cache.remove(at.key);const token=cmId_()+cmId_();cmAppend_('Sessoes',{'Token':token,'Aluno ID':id,'Expira em':new Date(Date.now()+CM_TTL).toISOString(),'Criado em':cmIso_()});return {token,me:cmPublicStudent_(stu),expires:Date.now()+CM_TTL}}
function cmScope_(scope,target,creator){
 if(scope==='individual'){const opp=cmStudent_(target);if(!opp||target===creator.ID)throw Error('Escolha um aluno diferente de você.');return {scope,target,description:opp.Apelido}}
 if(scope==='team'){
  const m=/^([ABC])\|(.{2,80})$/.exec(String(target||''));if(!m)throw Error('Equipe inválida.');
  const exists=cmRows_('Alunos').some(s=>s.Casa===m[1]&&s.Equipe===m[2]);if(!exists||creator.Casa+'|'+creator.Equipe===target)throw Error('Escolha outra equipe.');
  return {scope,target,description:m[2]+' · 4º '+m[1]}
 }
 if(scope==='class'){
  if(!CM_H[target]||target===creator.Casa)throw Error('Escolha outra turma.');return {scope,target,description:'4º '+target+' — '+CM_H[target]}
 }
 throw Error('Modo de desafio inválido.');
}
function cmCanRespond_(d,stu){
 if(d.scope==='individual')return stu.ID===d.target;
 if(d.scope==='team')return stu.Casa+'|'+stu.Equipe===d.target;
 if(d.scope==='class')return stu.Casa===d.target;
 return false;
}
function cmShots_(shots){
 if(!Array.isArray(shots)||shots.length!==5)throw Error('A rodada precisa conter exatamente cinco flechas.');
 const checked=shots.map((v,i)=>{
  const x=Number(v?.x),y=Number(v?.y),power=Number(v?.power),seconds=Number(v?.seconds??0);
  if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>6||Math.abs(y)>6||!Number.isFinite(power)||power<.2||power>1||!Number.isFinite(seconds)||seconds<0)throw Error('Flecha inválida '+(i+1));
  // Recalculate score from 2D impact on the target, do not trust client score fields.
  const radius=Math.hypot(x,y),score=radius>1?0:Math.max(1,10-Math.floor(radius*10));
  return {x:+x.toFixed(4),y:+y.toFixed(4),power:+power.toFixed(3),score};
 });
 return {shots:checked,total:checked.reduce((s,v)=>s+v.score,0)};
}
function cmFind_(id){const row=cmRows_('Desafios').find(x=>x.ID===id);if(!row)throw Error('Desafio não encontrado.');row.meta=cmJson_(row['JSON da partida']);return row}
function cmPublicChallenge_(d,me){const meta=d.meta||cmJson_(d['JSON da partida']);const a=cmStudent_(d.Criador),b=meta.acceptedBy?cmStudent_(meta.acceptedBy):null;
 return {id:d.ID,scope:d.Tipo,status:d.Status,from:cmPublicStudent_(a),target:d.Alvo,createdAt:d['Criado em'],acceptedBy:b?cmPublicStudent_(b):null,scoreA:meta.scoreA,scoreB:meta.scoreB??null,shotsA:meta.shotsA||[],shotsB:meta.shotsB||[],winner:meta.winner||null,declinedByMe:(meta.declined||[]).includes(me.ID)};
}
function cmCreate_(stu,r){const scope=String(r.scope||''),target=String(r.target||'');cmScope_(scope,target,stu);const played=cmShots_(r.shots);const id=cmId_(),now=cmIso_();const meta={scope,target,scoreA:played.total,shotsA:played.shots,acceptedBy:null,scoreB:null,shotsB:[],declined:[],winner:null};cmAppend_('Desafios',{'ID':id,'Tipo':scope,'Criador':stu.ID,'Alvo':target,'Status':'PENDENTE','Criado em':now,'Atualizado em':now,'Limite por lado':1,'JSON da partida':JSON.stringify(meta)});cmAppend_('Disparos',{'ID':cmId_(),'Desafio ID':id,'Aluno ID':stu.ID,'Casa':stu.Casa,'Equipe':stu.Equipe,'Pontuação':played.total,'Flechas JSON':JSON.stringify(played.shots),'Criado em':now});cmEvent_(id,stu.ID,'DESAFIO_CRIADO',{scope,target,score:played.total});return {challengeId:id,score:played.total,status:'PENDENTE'}}
function cmAccept_(stu,r){const d=cmFind_(String(r.id||'')),m=d.meta;if(d.Status!=='PENDENTE')throw Error('Este desafio já foi aceito ou encerrado.');if(!cmCanRespond_(m,stu)||stu.ID===d.Criador)throw Error('Esse convite não pertence à sua Casa, equipe ou perfil.');if(m.declined?.includes(stu.ID))throw Error('Você já recusou este desafio.');m.acceptedBy=stu.ID;cmSet_('Desafios',d._row,'Status','ACEITO');cmSet_('Desafios',d._row,'JSON da partida',JSON.stringify(m));cmSet_('Desafios',d._row,'Atualizado em',cmIso_());cmEvent_(d.ID,stu.ID,'DESAFIO_ACEITO',{});return cmPublicChallenge_({...d,Status:'ACEITO',meta:m},stu)}
function cmDecline_(stu,r){const d=cmFind_(String(r.id||'')),m=d.meta;if(d.Status!=='PENDENTE'||!cmCanRespond_(m,stu))throw Error('Desafio indisponível.');m.declined=(m.declined||[]).concat(stu.ID);if(m.scope==='individual')cmSet_('Desafios',d._row,'Status','RECUSADO');cmSet_('Desafios',d._row,'JSON da partida',JSON.stringify(m));cmSet_('Desafios',d._row,'Atualizado em',cmIso_());cmEvent_(d.ID,stu.ID,'DESAFIO_RECUSADO',{});return {ok:true}}
function cmSubmit_(stu,r){const d=cmFind_(String(r.id||'')),m=d.meta;if(d.Status!=='ACEITO'||m.acceptedBy!==stu.ID)throw Error('Desafio não está aceito para seu perfil.');if(m.shotsB?.length)throw Error('Resultado já registrado.');const played=cmShots_(r.shots),now=cmIso_();m.scoreB=played.total;m.shotsB=played.shots;m.winner=m.scoreA>m.scoreB?d.Criador:m.scoreB>m.scoreA?stu.ID:'EMPATE';cmSet_('Desafios',d._row,'Status','CONCLUIDO');cmSet_('Desafios',d._row,'JSON da partida',JSON.stringify(m));cmSet_('Desafios',d._row,'Atualizado em',now);cmAppend_('Disparos',{'ID':cmId_(),'Desafio ID':d.ID,'Aluno ID':stu.ID,'Casa':stu.Casa,'Equipe':stu.Equipe,'Pontuação':played.total,'Flechas JSON':JSON.stringify(played.shots),'Criado em':now});cmEvent_(d.ID,stu.ID,'DESAFIO_CONCLUIDO',{scoreA:m.scoreA,scoreB:m.scoreB,winner:m.winner});return cmPublicChallenge_({...d,Status:'CONCLUIDO',meta:m},stu)}
function cmInbox_(stu){return cmRows_('Desafios').map(d=>({...d,meta:cmJson_(d['JSON da partida'])})).filter(d=>{
 if(d.Criador===stu.ID)return true;
 if(d.Status==='PENDENTE'&&cmCanRespond_(d.meta,stu)&&!(d.meta.declined||[]).includes(stu.ID))return true;
 if(['ACEITO','CONCLUIDO'].includes(d.Status)&&d.meta.acceptedBy===stu.ID)return true;
 return false;
}).sort((a,b)=>String(b['Criado em']).localeCompare(String(a['Criado em']))).slice(0,80).map(d=>cmPublicChallenge_(d,stu))}
function cmRankings_(){const players={},teams={},houses={},shots=cmRows_('Disparos');
 for(const s of shots){const pts=Number(s['Pontuação']);if(!Number.isInteger(pts)||pts<0||pts>50)continue;const id=s['Aluno ID'],stu=cmStudent_(id);if(!stu)continue;
  for(const [obj,k,title] of [[players,id,stu.Apelido],[teams,stu.Casa+'|'+stu.Equipe,stu.Equipe+' · 4º '+stu.Casa],[houses,stu.Casa,'4º '+stu.Casa+' — '+CM_H[stu.Casa]]]){const p=obj[k]||(obj[k]={id:k,name:title,house:stu.Casa,plays:0,total:0,best:0});p.plays++;p.total+=pts;p.best=Math.max(p.best,pts)}
 }
 const sorted=o=>Object.values(o).map(x=>({...x,average:Math.round(x.total/x.plays*100)/100})).sort((a,b)=>b.average-a.average||b.total-a.total).slice(0,80);
 return {players:sorted(players),teams:sorted(teams),houses:sorted(houses),updatedAt:cmIso_()}}
function cmAPI(request){const action=String(request?.action||'');const lock=LockService.getScriptLock();
 if(action==='health')return {ok:true,version:CM_VERSION,online:true};
 if(action==='roster')return {students:cmRows_('Alunos').filter(x=>x.Ativo!==false).map(cmPublicStudent_),version:CM_VERSION};
 if(action==='rankings')return cmRankings_();
 if(action==='login'){lock.waitLock(20000);try{return cmLogin_(request)}finally{lock.releaseLock()}}
 const stu=cmLogged_(request?.token);
 if(action==='me')return {me:cmPublicStudent_(stu)};
 if(action==='inbox')return {challenges:cmInbox_(stu),me:cmPublicStudent_(stu)};
 if(action==='logout'){const session=cmRows_('Sessoes').find(s=>s.Token===request.token);if(session)cmSet_('Sessoes',session._row,'Expira em',cmIso_());return {ok:true}}
 if(['create','accept','decline','submit'].includes(action)){
  lock.waitLock(20000);try{
   if(action==='create')return cmCreate_(stu,request);
   if(action==='accept')return cmAccept_(stu,request);
   if(action==='decline')return cmDecline_(stu,request);
   if(action==='submit')return cmSubmit_(stu,request);
  }finally{lock.releaseLock()}
 }
 throw Error('Operação inválida.');
}
function doGet(e){const page=HtmlService.createTemplateFromFile('Bridge');page.allowedOrigin=CM_ALLOWED_ORIGIN;return page.evaluate().setTitle('ClassMana Arena — conexão segura').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)}