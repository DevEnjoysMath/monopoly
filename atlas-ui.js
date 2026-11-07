const atlasOption = new Option('Adriatic–Indus Express · 80 spaces','atlas');
$('map').append(atlasOption);
$('map').value = 'atlas';

const homeControls = document.querySelector('.home-controls');
const intro = document.querySelector('#home .intro');
intro.querySelector('p').textContent = 'Choose a board and invite your friends.';
document.querySelector('.home-art').remove();
document.querySelector('.home-help').innerHTML = '<h2>How to play</h2><p>Roll to move, buy cities, and collect rent. Own all four cities in an Express district to build houses and hotels.</p>';
const mapLabel = document.createElement('label');
mapLabel.htmlFor = 'home-map';
mapLabel.textContent = 'Board map';
const mapPicker = document.createElement('select');
mapPicker.id = 'home-map';
for (const option of $('map').options) mapPicker.add(new Option(option.text,option.value));
mapPicker.value = 'atlas';
mapPicker.onchange = () => { $('map').value = mapPicker.value; describeMap(); };
const description = document.createElement('p');
description.className = 'map-description';
function describeMap() {
  const summaries = {
    atlas:'80 spaces · 16 districts across India, Pakistan, Albania, and Greece.',
    classic:'40 spaces · Salvador to New York, with airports and utilities.',
    world:'40 spaces · city sets from around the world.',
    europe:'48 spaces · European capitals and coastal cities.',
    mega:'64 spaces · a longer tour across six continents.'
  };
  description.textContent = summaries[mapPicker.value];
}
describeMap();
homeControls.prepend(mapLabel,mapPicker,description);
play.textContent = 'Create private room';
create.textContent = 'Play with bots';
create.onclick = async () => {
  if (busy) return;
  const oldRoom = session?.code;
  await $('create').onclick();
  if (!session || session.code===oldRoom || !data) return;
  await action('bots',{enabled:true});
  if (data.game.players.length>1) await action('start');
};
all.textContent = 'Join with code';

const atlasDialog = document.createElement('dialog');
atlasDialog.className = 'atlas-dialog';
atlasDialog.innerHTML = '<header><h2>City directory</h2><button type="button" aria-label="Close directory">×</button></header><div class="atlas-search"><input type="search" aria-label="Find city, country or district" placeholder="Find city, country or district…"><select aria-label="Filter by ownership"><option value="all">All properties</option><option value="available">Available to buy</option><option value="mine">My properties</option></select></div><div class="atlas-results"></div>';
document.body.append(atlasDialog);
const search = atlasDialog.querySelector('input');
const ownership = atlasDialog.querySelector('select');
const results = atlasDialog.querySelector('.atlas-results');
const fold = text => String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

function displayDirectory() {
  const {board,game,me} = data;
  const query = fold(search.value.trim());
  const rows = board.filter(tile => {
    if (tile.type!=='property') return false;
    const owner = game.properties[tile.id]?.owner;
    if (ownership.value==='mine' && owner!==me) return false;
    if (ownership.value==='available' && owner) return false;
    return fold([tile.name,tile.country,tile.district].join(' ')).includes(query);
  });
  results.replaceChildren();
  let lastGroup;
  for (const tile of rows) {
    if (lastGroup!==tile.group) {
      const heading = document.createElement('h3');
      heading.textContent = [tile.flag,tile.country,tile.district||'Set '+(tile.group+1)].filter(Boolean).join(' · ');
      results.append(heading);
      lastGroup=tile.group;
    }
    const button=document.createElement('button');
    const owner=game.players.find(p=>p.id===game.properties[tile.id]?.owner);
    button.className='atlas-result';
    button.innerHTML='<strong>'+esc(tile.name)+'</strong><small>'+esc(owner?.name||'Bank')+'</small><b>'+money(tile.price)+'</b>';
    button.onclick=()=>{atlasDialog.close();selected=tile.id;showProperty();};
    results.append(button);
  }
  if (!rows.length) results.textContent='No cities match these filters.';
}
search.oninput=ownership.onchange=displayDirectory;
atlasDialog.querySelector('header button').onclick=()=>atlasDialog.close();
function openDirectory() {
  displayDirectory();atlasDialog.showModal();search.focus();
}

const mapBar=document.createElement('div');
mapBar.className='map-toolbar';
mapBar.innerHTML='<div><strong></strong><small></small></div><button type="button">Browse cities</button>';
mapBar.querySelector('button').onclick=openDirectory;
wrap.prepend(mapBar);
const passport=document.createElement('section');
passport.className='panel passport-panel';
side.insertBefore(passport,portfolio);

const previousRender=render;
let lastMap;
render=function renderAtlasView() {
  const {game,me,board}=data;
  if(lastMap!==game.map){propertyOpen=selected=null;document.querySelector('.property-dialog')?.remove();lastMap=game.map;}
  previousRender();
  const large=board.length>=64;
  $('board').classList.toggle('large-board',large);
  mapBar.querySelector('strong').textContent=data.maps[game.map].name;
  mapBar.querySelector('small').textContent=board.length+' spaces · Room '+session.code;
  if(game.status==='lobby') $('phase').textContent='Waiting for friends · '+game.players.length+'/'+(game.rules.maxPlayers||8)+' seats';
  $('board').querySelectorAll('.tile').forEach((el,id)=>{
    const tile=board[id];
    el.setAttribute('role','button');el.tabIndex=0;
    el.setAttribute('aria-label',[tile.name,tile.district,tile.price?money(tile.price):''].filter(Boolean).join(', '));
    el.title=el.getAttribute('aria-label');
    el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}};
    if(tile.type==='tax'&&game.map!=='classic')el.querySelector('.tile-symbol').textContent='$100';
    el.querySelector('.tile-face').dataset.stop=String(id);
  });
  if(large){
    const player=game.players[game.turn];
    const position=player.pos;
    const route=document.createElement('div');
    route.className='route-guide';
    const title=document.createElement('strong');
    title.textContent='Ahead of '+board[position].name;
    route.append(title);
    for(let offset=1;offset<=3;offset++){
      const tile=board[(position+offset)%board.length];
      const row=document.createElement('button');
      row.innerHTML='<small>+'+offset+'</small><span>'+esc([tile.flag,tile.name].filter(Boolean).join(' '))+'</span><b>'+(tile.price?money(tile.price):'')+'</b>';
      row.onclick=()=>{selected=tile.id;showProperty();};
      route.append(row);
    }
    $('board').querySelector('.center').append(route);
  }
  passport.hidden=game.map!=='atlas';
  if(!passport.hidden){
    const player=game.players.find(p=>p.id===me);
    const stamps=['India','Pakistan','Albania'].map(country=>{
      const held=board.some(tile=>tile.country===country&&game.properties[tile.id]?.owner===me);
      return '<span class="'+(held?'held':'')+'">'+(held?'✓ ':'')+country+'</span>';
    });
    passport.innerHTML='<h2>Three-country passport</h2><p>'+ (player.passport?'$200 bonus collected.':'Own a city in each country at the same time to earn $200 once.')+'</p><div>'+stamps.join('')+'</div>';
  }
  if(atlasDialog.open)displayDirectory();
  const player=game.players.find(p=>p.id===me);
  for (const deck of player.pardons||[]) {
    const card=btn(deck+' prison pardon','usePardon',!(game.status==='playing' && game.players[game.turn].id===me && game.phase==='roll' && player.jail>0),{deck});
    card.title='Use before rolling in prison to leave without paying bail.';
    portfolio.querySelector('.portfolio-list').append(card);
  }
};
if(data)render();

const originalPropertyCard = showProperty;
showProperty = function showCityDetails() {
  originalPropertyCard();
  const card=document.querySelector('.property-card');
  const tile=data.board[selected];
  if(!card || !tile) return;
  const details=card.querySelector('#rent-details');
  if(tile.type==='property' && tile.district) {
    const set=data.board.filter(t=>t.type==='property' && t.group===tile.group);
    const owned=set.filter(t=>data.game.properties[t.id]?.owner===data.me).length;
    const summary=document.createElement('p');
    summary.className='set-summary';
    summary.textContent=tile.country+' · '+tile.district+' · You own '+owned+'/'+set.length;
    details.prepend(summary);
  }
  if(['utility','station'].includes(tile.type)) {
    const owner=data.game.players.find(p=>p.id===data.game.properties[tile.id]?.owner);
    const rent=tile.type==='station'?'$25 / $50 / $100 / $200 for one through four airports.':'Four times the dice total for one utility, ten times for both.';
    details.innerHTML='<div class="rent-row"><span>Owner</span><b>'+esc(owner?.name||'Bank')+'</b></div><p>'+rent+'</p><div class="rent-row"><span>Price</span><b>'+money(tile.price)+'</b></div>';
    for(const button of card.querySelectorAll('#asset-actions button')) {
      if(button.textContent==='Build') button.remove();
    }
  }
};
