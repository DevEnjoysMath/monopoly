import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('dist/server',{recursive:true});
const engine=readFileSync('engine.mjs','utf8').replaceAll('export ','');
const fonts=['Nunito','Yanone'].map(name=>'@font-face{font-family:'+name+';src:url(data:font/ttf;base64,'+readFileSync('assets/'+name+'.ttf').toString('base64')+') format("truetype");font-display:swap}').join('');
const page=readFileSync('game.html','utf8').replace('</head>','<style>'+fonts+readFileSync('rich-theme.css','utf8')+'</style></head>').replace('</body>','<script>'+readFileSync('rich-theme.js','utf8')+'</script></body>');
const worker=readFileSync('worker.mjs','utf8').replace(/^import .*;\n/gm,'');
writeFileSync('dist/server/index.js',engine+'\nconst page='+JSON.stringify(page)+';\n'+worker);
