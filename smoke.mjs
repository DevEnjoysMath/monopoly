import assert from 'node:assert/strict';
const origin=process.argv[2]||'https://freeboard-city.blithecivet128.chatgpt.site';
async function call(path,body,token){const r=await fetch(origin+'/api/'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok)throw Error(JSON.stringify(d));return d;}
const host=await call('create',{name:'Verification host',map:'mega',rules:{startCash:2000,randomOrder:false}});
const guest=await call('join',{code:host.code,name:'Verification guest'});
let a=await call('action',{...host,action:{type:'start'}},host.token);
assert.equal(a.board.length,64);assert.equal(a.game.players.length,2);assert.equal(a.game.status,'playing');
assert(!a.game.players.some(p=>'token'in p));
await assert.rejects(()=>call('action',{...guest,action:{type:'roll'}},guest.token),/Wait/);
a=await call('action',{...host,action:{type:'roll'}},host.token);
const b=await call('state?code='+host.code,null,guest.token);
assert.deepEqual(a.game,b.game);assert.notEqual(a.me,b.me);
console.log('PASS: two independent players, 64-space map, server turn enforcement, shared dice/positions/cash, private tokens.');
