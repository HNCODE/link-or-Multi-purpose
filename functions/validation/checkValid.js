const config = require("../../config.json")
const chalk = require("chalk")

/**
 * Checks if the proper values have been provided in the config.json file!
 */

async function checkValid() {
    if (!config.owner) {
        console.log(
            chalk.bgYellowBright.black(
                "[WARN] OWNER_ID_WAS_NOT_FOUND"
            )
        )
    }
    if (!config.TOKEN) {
        throw ReferenceError(
            chalk.bgRedBright.black(
                "[CONFIG_ERR] BOT_TOKEN_WAS_NOT_FOUND"
            )
        )
    }
    if (!config.PREFIX) {
        throw ReferenceError(
            chalk.bgRedBright.black(
                "[CONFIG_ERR] DEFAULT_PREFIX_WAS_NOT_FOUND"
            )
        )
    }
}

module.exports = {
    checkValid
}
