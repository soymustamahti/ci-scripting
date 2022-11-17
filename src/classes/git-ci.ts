import { schedule } from "node-cron";
import * as child from "child_process";
import * as util from "util";
import * as fs from "fs";
import {
  COMMAND_GET_LAST_COMMIT,
  COMMAND_PULL,
  CRON,
  ENCODING,
  FILE_PATH,
} from "../constants";

export default class GitCi {
  private readonly _exec = util.promisify(child.exec);

  constructor() {
    this.checkGitCommit();
  }

  async checkGitCommit() {
    try {
      const { stdout } = await this._exec(COMMAND_PULL);
      console.log("GIT PULL", stdout);
      schedule(CRON, async () => {
        console.log("---------------------------------");
        const { stdout } = await this._exec(COMMAND_GET_LAST_COMMIT);
        console.log("STDOUT LAST COMMIT", stdout);
        await this.checkAndCreateFileToStoreLastCommit(stdout, FILE_PATH);
      });
    } catch (err) {
      console.log("ERROR PULL", err);
    }
  }

  async checkAndCreateFileToStoreLastCommit(stdout: string, route: string) {
    const exist = fs.existsSync(route);
    console.log("EXIST", exist);
    if (!exist) {
      await fs.writeFileSync(route, stdout);
    }
    const lastCommit = this.readFile(route);
    console.log("LAST COMMIT STORED", lastCommit);

    if (lastCommit !== stdout) {
      const result = await this.runTest();
      if (result) {
        console.log("TEST PASSED");
      } else {
        console.log("TEST NO PASSED");
      }
    }
  }

  async runTest() {
    try {
      const { stdout } = await this._exec(`npm run test`);
      return stdout;
    } catch (err) {
      return undefined;
    }
  }

  readFile(route: string) {
    return fs.readFileSync(route, {
      encoding: ENCODING,
    });
  }
}
