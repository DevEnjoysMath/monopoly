import {test} from 'node:test';import assert from 'node:assert/strict';import {createGame,act,boardFor} from './engine.mjs';
function game(){const g=createGame('world',{startCash:2000,randomOrder:false,mortgage:true});g.players=[{id:'a',name:'A',pos:0,cash:2000,jail:0},{id:'b',name:'B',pos:0,cash:2000,jail:0}];act(g,'a',{type:'start'});return g;}
test('maps have distinct lengths and valid perimeter sizes',()=>{for(const [m,n]of [['world',40],['europe',48],['mega',64]])assert.equal(boardFor(m).length,n);});
test('turn enforcement and purchasing persists ownership',()=>{const g=game();assert.throws(()=>act(g,'b',{type:'roll'}),/Wait/);act(g,'a',{type:'roll'},()=>0);assert.equal(g.phase,'buy');const price=boardFor('world')[2].price;act(g,'a',{type:'buy'});assert.equal(g.properties[2].owner,'a');assert.equal(g.players[0].cash,2000-price);act(g,'a',{type:'end'});assert.equal(g.phase,'roll');});
test('rent transfers cash between players',()=>{const g=game();g.properties[2]={owner:'b',level:0};act(g,'a',{type:'roll'},()=>0);assert.equal(g.players[0].cash,2000-boardFor('world')[2].rent);assert.equal(g.players[1].cash,2000+boardFor('world')[2].rent);});
test('trades validate ownership and move money',()=>{const g=game();g.properties[1]={owner:'a',level:0};act(g,'a',{type:'trade',target:'b',giveCash:0,takeCash:100,giveProperty:1,takeProperty:-1});act(g,'b',{type:'acceptTrade'});assert.equal(g.properties[1].owner,'b');assert.equal(g.players[0].cash,2100);assert.equal(g.trade,null);});
test('three doubles sends player to jail',()=>{const g=game();for(let i=0;i<3;i++){act(g,'a',{type:'roll'},()=>0);if(g.phase==='buy')act(g,'a',{type:'skip'});if(i<2)act(g,'a',{type:'end'});}assert.equal(g.players[0].jail,3);assert.equal(g.players[0].pos,10);});
test('full sets required for building and mortgages block construction',()=>{const g=game();g.properties[1]={owner:'a',level:0};assert.throws(()=>act(g,'a',{type:'build',tile:1}),/set/);g.properties[2]={owner:'a',level:0};act(g,'a',{type:'build',tile:1});assert.equal(g.properties[1].level,1);assert.throws(()=>act(g,'a',{type:'mortgage',tile:2}),/buildings/);});
test('classic city order and observed price/rent schedule',()=>{const b=boardFor('classic');assert.equal(b.length,40);assert.equal(b[1].name,'Salvador');assert.equal(b[7].price,110);assert.equal(b[12].type,'utility');assert.equal(b[39].name,'New York');assert.deepEqual(b[39].rents,[50,200,600,1400,1700,2000]);});
test('auctions finish with one winner and debit the winning bid',()=>{const g=game();g.rules.auction=true;act(g,'a',{type:'roll'},()=>0);act(g,'a',{type:'skip'});assert.equal(g.phase,'auction');act(g,'a',{type:'bid',amount:50});assert.throws(()=>act(g,'a',{type:'bid',amount:60}),/Wait/);act(g,'b',{type:'passAuction'});assert.equal(g.properties[2].owner,'a');assert.equal(g.players[0].cash,1950);assert.equal(g.phase,'end');});
test('host settings cannot be changed by guests or during a game',()=>{const g=createGame('classic');g.players=[{id:'a',name:'A'},{id:'b',name:'B'}];assert.throws(()=>act(g,'b',{type:'settings',rules:{startCash:3000}}),/host/);act(g,'a',{type:'settings',rules:{startCash:3000,randomOrder:false}});assert.equal(g.rules.startCash,3000);act(g,'a',{type:'start'});assert.throws(()=>act(g,'a',{type:'settings',map:'mega'}),/lobby/);});
test('chat is shared and bounded, appearance persists, bots fill seats',()=>{const g=createGame('classic');g.players=[{id:'a',name:'A'}];act(g,'a',{type:'chat',text:'hello'});assert.equal(g.chat[0].text,'hello');act(g,'a',{type:'appearance',color:7});assert.equal(g.players[0].color,7);act(g,'a',{type:'bots',enabled:true});assert.equal(g.players.length,4);assert(g.players[1].bot);act(g,'a',{type:'bots',enabled:false});assert.equal(g.players.length,1);});
test('Express map contains 16 complete city sets and keeps all four corners playable',()=>{
  const board=boardFor('atlas');
  const cities=board.filter(t=>t.type==='property');
  assert.equal(board.length,80);
  assert.equal(new Set(cities.map(t=>t.name)).size,64);
  assert.deepEqual([0,20,40,60].map(i=>board[i].type),['go','jail','park','gojail']);
  for(const group of new Set(cities.map(t=>t.group))) assert.equal(cities.filter(t=>t.group===group).length,4);
  for(const name of ['Mumbai','Karachi','Tirana','Shkodër']) assert(cities.some(t=>t.name===name));
});
test('Express passport is awarded once on acquisition and survives resale',()=>{
  const g=game();g.map='atlas';const board=boardFor(g.map);
  const [india,pakistan,albania]=['India','Pakistan','Albania'].map(c=>board.find(t=>t.country===c));
  for(const t of [india,pakistan])g.properties[t.id]={owner:'a',level:0};
  g.players[0].pos=albania.id;g.phase='buy';
  act(g,'a',{type:'buy'});assert.equal(g.players[0].cash,2200-albania.price);
  delete g.properties[albania.id];g.phase='buy';act(g,'a',{type:'buy'});
  assert.equal(g.players[0].cash,2200-albania.price*2);
});
