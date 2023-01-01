import { schedule } from "node-cron";
import * as child from "child_process";
import * as util from "util";
import * as fs from "fs";
import { CRON, ENCODING, FILE_PATH } from "./constants";
import {
  COMMAND_CURRENT_BRANCH_NAME,
  COMMAND_GET_LAST_COMMIT,
  COMMAND_REBASE_FAST_FORWARD,
  COMMAND_REVERT_LAST_COMMIT,
  COMMAND_RUN_TEST,
  COMMAND_SWITCH_BACK_AND_INSTALL,
  COMMAND_SWITCH_BRANCH_AND_INSTALL,
} from "./constants/git";
import logger from "./logger/winstron";

export default class GitCi {
  private readonly _exec = util.promisify(child.exec);
  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  _logger = logger;
  cont = 0;

  constructor() {
    this.checkGitCommit();
  }

  async checkGitCommit() {
    this._logger.log({
      level: "info",
      message: "The process will start soon when it reaches the minute, then it will run every minute",
    });
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

  async checkAndCreateFileToStoreLastCommit(
    lastCommitRemote: string,
    route: string
  ) {
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
        await fs.writeFileSync(route, lastCommitRemote);
      }
      const lastCommitStored = this.readFile(route);
      this._logger.log({
        level: "info",
        message: `Read file and get last commit stored: ${lastCommitStored}`,
      });
      if (lastCommitStored !== lastCommitRemote) {
        await this.commitNotSame(route, lastCommitRemote, lastCommitStored);
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
      if (err.stdout)
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

  async commitNotSame(
    route: string,
    lastCommitRemote: string,
    lastCommitStored: string
  ) {
    this._logger.log({
      level: "info",
      message: "Last commit is different, running test",
    });
    const resultTest = await this.runTest(route, lastCommitStored);
    if (resultTest) {
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
  }

  async runTest(route: string = FILE_PATH, lastCommitStored: string) {
    try {
      const currentBranchName = await this.getCurrentBranchName();
      this._logger.log({
        level: "info",
        message: `Switching to branch dev and installing dependencies`,
      });
      await this._exec(COMMAND_SWITCH_BRANCH_AND_INSTALL);
      this._logger.log({
        level: "info",
        message: `Running test`,
      });
      const { stdout } = await this._exec(COMMAND_RUN_TEST);
      this._logger.log({
        level: "info",
        message: `Test result:\n ${stdout}`,
      });
      this._logger.log({
        level: "info",
        message: `Test passed, switching back to branch ${currentBranchName} and installing dependencies again`,
      });
      await this._exec(`${COMMAND_SWITCH_BACK_AND_INSTALL} ${currentBranchName}`);
      return true;
    } catch (err: any) {
      this._logger.error({
        level: "error",
        message: `Test failed: ${err.stdout}`,
      });
      this._logger.info({
        level: "info",
        message: `Starting revert to commit ${lastCommitStored}`,
      });
      await this.testFail(lastCommitStored, await this.getLastCommit());
      this._logger.info({
        level: "info",
        message: "Git flag to notify the commit didn't pass the test",
      });
      await fs.writeFileSync(route, await this.getLastCommit());
      return false;
    }
  }

  async testFail(oldCommitHash: string, newCommitHash: string) {
    await this._exec(`${COMMAND_SWITCH_BACK_AND_INSTALL} ci-v2`);
    const currentBranchName = await this.getCurrentBranchName();
    const { stdout } = await this._exec(
      `${COMMAND_REVERT_LAST_COMMIT} ${oldCommitHash} ${newCommitHash} ${currentBranchName}`
    );
    this._logger.log({
      level: "info",
      message: `Revert succeed, result:\n -------------------------\n\n${stdout}\n\n-------------------------`,
    });
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
