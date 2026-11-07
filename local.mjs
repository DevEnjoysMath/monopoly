import http from 'node:http';
import {mkdirSync,readFileSync,writeFileSync,renameSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {networkInterfaces} from 'node:os';
import worker from './dist/server/index.js';

const port=Number(process.env.PORT||4173);
const host=process.env.HOST||'127.0.0.1';
const statePath=process.env.FREEBOARD_DATA_FILE||fileURLToPath(new URL('./.local/rooms.json',import.meta.url));
mkdirSync(dirname(resolve(statePath)),{recursive:true});
let rooms=new Map();
try {rooms=new Map(JSON.parse(readFileSync(statePath,'utf8')));} catch(error) {
  if(error.code!=='ENOENT') throw new Error('Could not read saved rooms. Preserve '+statePath+' and repair it before starting.',{cause:error});
}
function commit(code,row){
  const updated=new Map(rooms);
  updated.set(code,row);
  writeFileSync(statePath+'.tmp',JSON.stringify([...updated]),{mode:0o600});
  renameSync(statePath+'.tmp',statePath);
  rooms=updated;
}
// A single-process adapter for the same revision-checked Worker API.
const DB={prepare(sql){return{bind(...args){return{
  async first(){const row=rooms.get(args[0]);return row?{...row}:null;},
  async run(){
    if(sql.startsWith('INSERT')){
      if(rooms.has(args[0]))throw Error('Room code collision. Please create a room again.');
      commit(args[0],{state:args[1],revision:0,updated:args[2]});
      return {meta:{changes:1}};
    }
    const [state,updated,code,revision]=args;
    if(rooms.get(code)?.revision!==revision)return {meta:{changes:0}};
    commit(code,{state,revision:revision+1,updated});
    return {meta:{changes:1}};
  }
};}};}};
const server=http.createServer(async(req,res)=>{
  try {
    const chunks=[];let bytes=0;
    for await(const chunk of req){
      bytes+=chunk.length;
      if(bytes>65536){res.writeHead(413);res.end('Request too large');return;}
      chunks.push(chunk);
    }
    const body=Buffer.concat(chunks);
    const r=await worker.fetch(new Request('http://localhost:'+port+req.url,{
      method:req.method,headers:req.headers,...(body.length?{body}:{})
    }),{DB});
    res.writeHead(r.status,Object.fromEntries(r.headers));
    res.end(Buffer.from(await r.arrayBuffer()));
  }catch(error){console.error(error.message);res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Local server error'}));}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port '+port+' is already in use. Close the earlier server or choose another PORT.':error.message);process.exitCode=1;});
server.listen(port,host,()=>{
  console.log('Freeboard is ready at http://localhost:'+port);
  console.log('Rooms are saved in '+statePath);
  if(host==='0.0.0.0')for(const entries of Object.values(networkInterfaces()))for(const address of entries||[])if(address.family==='IPv4'&&!address.internal)console.log('Friends on your Wi-Fi can open http://'+address.address+':'+port);
  console.log('Keep this terminal open while playing. Press Control+C to stop.');
});
