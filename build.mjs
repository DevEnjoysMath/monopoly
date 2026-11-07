import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('dist/server',{recursive:true});
const engine = ['atlas.mjs','engine.mjs'].map(file =>
  readFileSync(file,'utf8').replace(/^import .*;\n/gm,'').replaceAll('export ','')
).join('\n');
const fonts=['Nunito','Yanone'].map(name=>'@font-face{font-family:'+name+';src:url(data:font/ttf;base64,'+readFileSync('assets/'+name+'.ttf').toString('base64')+') format("truetype");font-display:swap}').join('');
const page=readFileSync('game.html','utf8').replace('</head>','<style>'+fonts+['rich-theme.css','atlas.css','board-view.css'].map(file=>readFileSync(file,'utf8')).join('\n')+'</style></head>').replace('</body>','<script>'+['rich-theme.js','atlas-ui.js','board-view.js'].map(file=>readFileSync(file,'utf8')).join('\n')+'</script></body>');
const worker=readFileSync('worker.mjs','utf8').replace(/^import .*;\n/gm,'');
writeFileSync('dist/server/index.js',engine+'\nconst page='+JSON.stringify(page)+';\n'+worker);
