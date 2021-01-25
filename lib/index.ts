import chalk from "chalk";
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
            await Downloader.cleanUp(__dirname + "/../GO", error => { console.error(`Couldn't delete GO:\n${error.stack}`) });
            dl.unzipFile();
        }

        await go.patch(false);
        await go.installDependencies();

        console.log(chalk.blueBright("Cleaning up"));
        await Downloader.cleanUp(__dirname + "/../tmp");

        console.log(chalk.blueBright("Finished"));
    } catch(error){
        console.error(chalk.redBright(`Failed to patch Grande Omega!\n${error.stack}`));
        await Downloader.cleanUp(__dirname + "/../tmp");
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
