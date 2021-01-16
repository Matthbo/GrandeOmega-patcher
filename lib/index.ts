import chalk from "chalk";
import { promises as fsPromises } from "fs";
import path from "path";
import { promisify } from "util";
import rimraf from "rimraf";
import { Downloader } from "./downloader";
import { GO } from "./go";

export async function main() {
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
        }

        await go.patch(false);
        await go.installDependencies();

        console.log(chalk.blueBright("Cleaning up"));
        await cleanUp(__dirname + "/../tmp");

        console.log(chalk.blueBright("Finished"));
    } catch(error){
        console.error(chalk.redBright(`Failed to patch Grande Omega!\n${error.stack}`));
        await cleanUp(__dirname + "/../tmp");
    }
}

export async function remoteMain(goDir: string){
    try {
        const go = new GO(goDir, goDir + "/tmp"),
            needsDownload = await go.checkVersion("http://grandeomega.com/api/v1/CustomAssignmentLogic/version");

        if(needsDownload)
            console.log(chalk.yellowBright("Your Grande Omega version is outdated!\nYou'd probably want to update it...\n"));
        
        await go.patch(true);
        await go.installDependencies();

        console.log(chalk.blueBright("Finished"));
    } catch(error) {
        console.error(chalk.redBright(`Failed to patch Grande Omega!\n${error.stack}`));
    }
}

async function cleanUp(outDir: string){
    outDir = path.normalize(outDir);
    
    try{
        await promisify(rimraf)(outDir).catch(error => { if(error.code !== "ENOENT") throw error });
    } catch(error){
        console.error(chalk.redBright(`Failed to clean up!\n${error.stack}`));
    }
}