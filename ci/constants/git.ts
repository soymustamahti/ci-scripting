export const COMMAND_GET_LAST_COMMIT = `bash ci/script/last-commit.sh`;
export const COMMAND_REBASE_FAST_FORWARD = `bash ci/script/rebase.sh`;
export const COMMAND_CURRENT_BRANCH_NAME = "git rev-parse --abbrev-ref HEAD";
export const COMMAND_REVERT_LAST_COMMIT = "bash ci/script/revert.sh";
export const COMMAND_SWITCH_BRANCH_AND_INSTALL = "bash ci/script/install.sh";
export const COMMAND_RUN_TEST = "npm run test";
export const COMMAND_SWITCH_BACK_AND_INSTALL = "bash ci/script/switch-back.sh";
