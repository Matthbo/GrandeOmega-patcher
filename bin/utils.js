const fsPromises = require("fs").promises

async function TestIfDirExistAndCreateDir(location) {
    try {
        await fsPromises.access(location, fsPromises.constants.F_OK);
    } catch (error) {
        try {
            await fsPromises.mkdir(location, { recursive: true });
        } catch (error) {
            throw error;
        }
    };
};

module.exports = {
    TestIfDirExistAndCreateDir
}
