import GitCi from "./classes/git-ci";
import { schedule } from "node-cron";
import * as child from "child_process";
import * as util from "util";
import * as fs from "fs";
import { COMMAND_GET_LAST_COMMIT, CRON } from "./constants";

function main() {
  new GitCi();
}

main();
