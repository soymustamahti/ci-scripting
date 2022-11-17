import {schedule} from 'node-cron'
import * as child from 'child_process';
import * as util from 'util';
import * as fs from 'fs'


const _exec = util.promisify(child.exec);

schedule('*/5 * * * * *',async  () => {
try{
  const { stdout } = await _exec(
    `bash src/script/script.sh`
  );
  await tmp(stdout)
}catch(err){
  console.log(err);
  
}
});

async function tmp(stdout: string){
try{

 const tmp = await fs.writeFileSync('src/store/commit.txt', stdout)
 console.log(tmp);
}catch(err){
  console.log(err)
}
}