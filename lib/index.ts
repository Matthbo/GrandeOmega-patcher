import chalk from "chalk";
import { promises as fsPromises } from "fs";
import { Downloader } from "./downloader";
import { GO } from "./go";

async function main() {
    try {
        const dl = new Downloader(__dirname + "/../tmp", __dirname + "/../GO"),
            go = new GO(__dirname + "/../GO", __dirname + "/../patcher");

        const needsDownload = await go.checkVersion("http://grandeomega.com/api/v1/CustomAssignmentLogic/version");

        if(needsDownload){    
            await dl.downloadFile("http://www.grandeomega.com/downloads/go_student_mac.zip");

            console.log(chalk.blueBright("Unzipping Grande Omega"));
            await fsPromises.rmdir(__dirname + "/../GO", { recursive: true }).catch(
                error => { if (error.code !== "ENOENT") throw error }
            ).then(() => dl.unzipFile());

            await go.patch();
            await go.installDependencies();
        }

        console.log(chalk.blueBright("Cleaning up"));
        await cleanUp();

        console.log(chalk.blueBright("Finished"));
    } catch(error){
        console.error(chalk.redBright(`Failed to package Grande Omega!\n${error.stack}`));
        await cleanUp();
    }
}

async function cleanUp(){
    try{
        await fsPromises.unlink(__dirname + "/../tmp/go.zip").catch(error => { if(error.code !== "ENOENT") throw error });
    } catch(error){
        console.error(chalk.redBright(`Failed to clean up!\n${error.stack}`));
    }
}

main();