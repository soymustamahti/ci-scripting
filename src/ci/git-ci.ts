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
import logger from "../logger/winstron";

export default class GitCi {
  private readonly _exec = util.promisify(child.exec);
  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  _logger = logger;
  cont = 0;

  constructor() {
    this.checkGitCommit();
  }

  async checkGitCommit() {
    schedule(CRON, async () => {
      this.cont++;
      this._logger.log({
        level: "info",
        message: "Checking commit in remote repository",
      });

      const lastCommitRemote: string = await this.getLastCommit();
      await this.checkAndCreateFileToStoreLastCommit(
        lastCommitRemote,
        FILE_PATH
      );
    });
  }

  async checkAndCreateFileToStoreLastCommit(stdout: string, route: string) {
    this._logger.log({
      level: "info",
      message: "Start creating file to store last commit",
    });
    try {
      const exist: boolean = fs.existsSync(route);
      this._logger.log({
        level: "info",
        message: `File exist`,
      });
      if (!exist) {
        this._logger.log({
          level: "info",
          message: "File not exist, creating file",
        });
        await fs.writeFileSync(route, stdout);
      }
      const lastCommit = this.readFile(route);
      this._logger.log({
        level: "info",
        message: `Read file and get last commit stored: ${lastCommit}`,
      });
      if (lastCommit !== stdout) {
      await  this.commitNotSame(route)
      }
      this._logger.log({
        level: "info",
        message: "Same commit, nothing to do",
      });
      // newline between each execution
      console.log(
        `-----------------------------------${this.cont} Times————————————————————--------------------\n`
      );
    } catch (err: any) {  
     if(err.stdout)
        this._logger.error({
          level: "error",
          message: `Error, somthing went wrong: ${err.stdout}`,
        });
      this._logger.error({
        level: "error",
        message: `Error, somthing went wrong: ${err}`,
      });
    }
  }

 async commitNotSame(route: string) {
    this._logger.log({
      level: "info",
      message: "Last commit is different, running test",
    });
    const result = await this.runTest();
    this._logger.log({
      level: "info",
      message: `Test result:\n ${result}`,
    });
    this._logger.log({
      level: "info",
      message: "Test PASSED, starting rebase",
    });
    const currentBranchName = await this.getCurrentBranchName();
    await this.sleep(1000);
    const { stdout } = await this._exec(
      COMMAND_REBASE_FAST_FORWARD + " " + currentBranchName
    );
    this._logger.log({
      level: "info",
      message: `Rebase result:\n ${stdout}`,
    });
    await fs.writeFileSync(route, await this.getLastCommit());
    this._logger.log({
      level: "info",
      message: "Rebase done, rewriting file with last commit",
    });
  }

  async runTest() {
      const { stdout } = await this._exec(COMMAND_TEST);
      return stdout;  
  }

  readFile(route: string) {
    return fs.readFileSync(route, {
      encoding: ENCODING,
    });
  }

  async getLastCommit(): Promise<string> {
    const { stdout } = await this._exec(COMMAND_GET_LAST_COMMIT);
    this._logger.log({
      level: "info",
      message: `Last commit form remote branch: ${stdout.split(" ")[0]}`,
    });
    return stdout.split(" ")[0];
  }

  async getCurrentBranchName(): Promise<string> {
    const { stdout } = await this._exec(COMMAND_CURRENT_BRANCH_NAME);
    this._logger.log({
      level: "info",
      message: `Geting current branch name: ${stdout}`,
    });
    return stdout;
  }
}
