// Keep board geometry and viewing controls independent from game state.
const boardViewport = document.createElement('div');
boardViewport.className = 'board-viewport';
boardViewport.tabIndex = 0;
boardViewport.setAttribute('aria-label', 'Game board. Scroll to explore; use Fit board to see all spaces.');
$('board').before(boardViewport);
boardViewport.append($('board'));
const boardTools = document.createElement('div');
boardTools.className = 'board-tools';
boardTools.innerHTML = '<div class="zoom-controls"><button aria-label="Zoom out">−</button><output aria-live="polite">100%</output><button aria-label="Zoom in">+</button><button data-view="fit">Fit board</button><button data-view="read">Readable</button></div><button data-view="player">Find my pawn</button>';
boardViewport.before(boardTools);
const boardHint = document.createElement('p');
boardHint.className = 'board-hint';
boardHint.textContent = 'Scroll to explore · tap a city for its deed · every label reads upright';
boardViewport.after(boardHint);
const turnDock = document.createElement('div');
turnDock.className = 'turn-dock';
turnDock.innerHTML = '<div class="turn-summary"></div><div class="actions"></div>';
boardTools.after(turnDock);
let boardZoom = 1;
let boardMode = 'read';
let viewMap;
function sizeBoard() {
  if (!data || !boardViewport.clientWidth) return;
  const count = data.board.length;
  const readableSize = count >= 80 ? 1120 : count >= 64 ? 960 : count >= 48 ? 820 : 720;
  const availableWidth = boardViewport.clientWidth - 16;
  const availableHeight = parseFloat(getComputedStyle(boardViewport).maxHeight) - 16;
  const fitSize = Math.min(availableWidth, availableHeight);
  const width = boardMode === 'fit' ? fitSize : Math.max(availableWidth, readableSize) * boardZoom;
  $('board').style.width = Math.round(width)+'px';
  $('board').style.setProperty('--board-px', width+'px');
  boardViewport.classList.toggle('overview', boardMode === 'fit' && width < 600);
  boardHint.textContent=boardViewport.classList.contains('overview')?'Overview · tap a flag for its city · choose Readable for full labels':'Scroll to explore · tap a city for its deed · every label reads upright';
  boardTools.querySelector('output').textContent = boardMode === 'fit' ? 'Fit' : Math.round(boardZoom*100)+'%';
  boardTools.querySelector('[aria-label="Zoom out"]').disabled = boardMode !== 'fit' && boardZoom <= .75;
  boardTools.querySelector('[aria-label="Zoom in"]').disabled = boardMode !== 'fit' && boardZoom >= 1.75;
  for (const button of boardTools.querySelectorAll('[data-view="fit"],[data-view="read"]')) button.setAttribute('aria-pressed', button.dataset.view === boardMode);
}
function zoomBoard(delta) {
  const oldWidth=$('board').offsetWidth;
  const centerX=boardViewport.scrollLeft+boardViewport.clientWidth/2;
  const centerY=boardViewport.scrollTop+boardViewport.clientHeight/2;
  boardMode='read';
  boardZoom=Math.max(.75,Math.min(1.75,boardZoom+delta));
  sizeBoard();
  const scale=$('board').offsetWidth/oldWidth;
  boardViewport.scrollLeft=centerX*scale-boardViewport.clientWidth/2;
  boardViewport.scrollTop=centerY*scale-boardViewport.clientHeight/2;
}
boardTools.querySelector('[aria-label="Zoom out"]').onclick=()=>zoomBoard(-.25);
boardTools.querySelector('[aria-label="Zoom in"]').onclick=()=>zoomBoard(.25);
boardTools.querySelector('[data-view="fit"]').onclick=()=>{boardMode='fit';sizeBoard();boardViewport.scrollTo(0,0);};
boardTools.querySelector('[data-view="read"]').onclick=()=>{boardMode='read';boardZoom=1;sizeBoard();};
boardTools.querySelector('[data-view="player"]').onclick=()=>{
  const player=data.game.players.find(p=>p.id===data.me);
  const tile=$('board').querySelectorAll('.tile')[player.pos];
  const viewportBox=boardViewport.getBoundingClientRect(),box=tile.getBoundingClientRect();
  boardViewport.scrollBy({left:box.left-viewportBox.left-boardViewport.clientWidth/2+box.width/2,top:box.top-viewportBox.top-boardViewport.clientHeight/2+box.height/2,behavior:'smooth'});
  tile.focus({preventScroll:true});
};
new ResizeObserver(sizeBoard).observe(boardViewport);
const renderBeforeBoardView=render;
render=function renderBoardView(){
  renderBeforeBoardView();
  const {game,board,me}=data;
  const side=board.length/4;
  const tracks='3.2fr repeat('+(side-1)+',minmax(0,1fr)) 3.2fr';
  $('board').style.gridTemplateColumns=tracks;
  $('board').style.gridTemplateRows=tracks;
  $('board').querySelectorAll('.tile').forEach((el,id)=>{
    el.style.setProperty('--district',groupColors[(board[id].group+8)%8]);
    const mine=game.players.find(p=>p.id===me);
    el.classList.toggle('my-position',id===mine.pos);
  });
  // Actions remain available even when a large board is panned to a corner.
  turnDock.querySelector('.actions').replaceChildren(...$('board').querySelector('#center-controls').childNodes);
  const current=game.players[game.turn];
  turnDock.querySelector('.turn-summary').textContent=game.status==='lobby'?'Waiting for friends · '+game.players.length+'/'+game.rules.maxPlayers+' seats':game.status==='finished'?'Game finished':current.name+'’s turn · '+board[current.pos].name;
  const center=$('board').querySelector('.center');
  const title=document.createElement('div');
  title.className='board-center-title';
  title.innerHTML='<strong>'+esc(data.maps[game.map].name)+'</strong><span>'+board.length+' spaces · all maps free</span>';
  center.prepend(title);
  if(viewMap!==game.map){boardViewport.scrollTo(0,0);viewMap=game.map;}
  sizeBoard();
};
if(data)render();
