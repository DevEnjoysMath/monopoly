import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('dist/server',{recursive:true});
const engine=readFileSync('engine.mjs','utf8').replaceAll('export ','');
const page=readFileSync('game.html','utf8');
const worker=readFileSync('worker.mjs','utf8').replace(/^import .*;\n/gm,'');
writeFileSync('dist/server/index.js',engine+'\nconst page='+JSON.stringify(page)+';\n'+worker);
