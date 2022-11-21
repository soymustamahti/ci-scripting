import { schedule } from "node-cron";
import * as child from "child_process";
import * as util from "util";
import * as fs from "fs";
import { COMMAND_TEST, CRON, ENCODING, FILE_PATH } from "../constants";
import {
  COMMAND_GET_LAST_COMMIT,
  COMMAND_REBASE_FAST_FORWARD,
  COMMAND_CURRENT_BRANCH_NAME,
} from "../constants/git";

export default class GitCi {
  private readonly _exec = util.promisify(child.exec);
  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  constructor() {
    this.checkGitCommit();
  }

  async checkGitCommit() {
    schedule(CRON, async () => {
      console.log("---------------------------------");
      const stdout: string = await this.getLastCommit();
      await this.checkAndCreateFileToStoreLastCommit(stdout, FILE_PATH);
    });
  }

  async checkAndCreateFileToStoreLastCommit(stdout: string, route: string) {
    try {
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
        console.log("RESULT TEST", result);
        if (result) {
          const currentBranchName = await this.getCurrentBranchName();
          await this.sleep(1000);
          const { stdout } = await this._exec(
            COMMAND_REBASE_FAST_FORWARD + " " + currentBranchName
          );
          console.log("REBASE", stdout);
          console.log("STDOUT REBASE", stdout);
          console.log("REWRITE FILE");
          await fs.writeFileSync(route, await this.getLastCommit());
        } else {
          console.log("TEST NO PASSED");
        }
      }
      console.log("SAME COMMIT");
    } catch (err) {
      console.log("ERROR", err);
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

  async getLastCommit(): Promise<string> {
    const { stdout } = await this._exec(COMMAND_GET_LAST_COMMIT);
    console.log("STDOUT LAST COMMIT", stdout.split(" ")[0]);
    return stdout.split(" ")[0];
  }

  async getCurrentBranchName(): Promise<string> {
    const { stdout } = await this._exec(COMMAND_CURRENT_BRANCH_NAME);
    console.log("STDOUT CURRENT BRANCH NAME", stdout);
    return stdout;
  }
}
