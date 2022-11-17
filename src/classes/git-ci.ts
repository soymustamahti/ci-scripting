import { schedule } from "node-cron";
import * as child from "child_process";
import * as util from "util";
import * as fs from "fs";
import {
  COMMAND_GET_LAST_COMMIT,
  COMMAND_TEST,
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
    schedule(CRON, async () => {
      console.log("---------------------------------");
      const { stdout } = await this._exec(COMMAND_GET_LAST_COMMIT);
      console.log("STDOUT LAST COMMIT", stdout.split(" ")[0]);
      await this.checkAndCreateFileToStoreLastCommit(
        stdout.split(" ")[0],
        FILE_PATH
      );
    });
  }

  async checkAndCreateFileToStoreLastCommit(stdout: string, route: string) {
    const exist = fs.existsSync(route);
    console.log("EXIST", exist);
    if (!exist) {
      console.log("CREATE FILE");
      await fs.writeFileSync(route, stdout);
    }
    const lastCommit = this.readFile(route);
    console.log("LAST COMMIT STORED", lastCommit);

    if (lastCommit !== stdout) {
      const result = await this.runTest();
      if (result) {
        const { stdout } = await this._exec(COMMAND_GET_LAST_COMMIT);
      } else {
        console.log("TEST NO PASSED");
      }
    }
  }

  async runTest() {
    try {
      const { stdout } = await this._exec(COMMAND_TEST);
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
