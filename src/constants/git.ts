export const COMMAND_GET_LAST_COMMIT = `bash src/script/last-commit.sh`;
export const COMMAND_REBASE_FAST_FORWARD = `bash src/script/rebase.sh`;
export const COMMAND_CURRENT_BRANCH_NAME = "git rev-parse --abbrev-ref HEAD";
export const COMMAND_REVERT_LAST_COMMIT = "bash src/script/revert.sh";
export const COMMAND_SWITCH_BRANCH_AND_INSTALL = "bash src/script/install.sh";
export const COMMAND_RUN_TEST = "npm run test";
export const COMMAND_SWITCH_BACK_AND_INSTALL = "bash src/script/switch-back.sh";