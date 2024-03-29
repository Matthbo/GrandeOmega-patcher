import chalk from "chalk";
import fetch from "node-fetch";
import { promises as fsPromises } from "fs";
import { Downloader } from "./downloader";
import { GO } from "./go";
import { askApplySkin, askDownloadGO, askWantedSkin } from "./utils";

export async function main() {
    try {
        const dl = new Downloader(__dirname + "/../tmp", __dirname + "/../GO"),
            go = new GO(__dirname + "/../GO", __dirname + "/../patcher", false);

        const needsDownload = await go.checkVersion("http://grandeomega.com/api/v1/CustomAssignmentLogic/version");

        if(needsDownload){
            await dl.downloadFile("http://www.grandeomega.com/downloads/go_student_mac.zip");

            await Downloader.cleanUp(__dirname + "/../GO", error => { console.error(`Couldn't delete GO:\n${error.stack}`) });
            dl.unzipFile();
        }

        await go.patch();
        await go.installDependencies();

        if (!await go.hasSkinInstalled() && await askApplySkin()){
            const skins: { [index: string]: string } = JSON.parse(await fsPromises.readFile(__dirname + "/../skins.json", { encoding: 'utf8' })),
                skinNames = Object.keys(skins);

            console.log(`Available skins:\n- ${skinNames.join("\n- ")}`);

            const wantedSkin = await askWantedSkin(skinNames);
            if(wantedSkin != "none") {
                await dl.downloadSkin(`${skins[wantedSkin]}/archive/refs/heads/master.zip`);
                dl.unzipSkin(wantedSkin);
            }
        }

        console.log(chalk.blueBright("Cleaning up"));
        await Downloader.cleanUp(__dirname + "/../tmp");

        console.log(chalk.blueBright("Finished"));
    } catch(error: any){
        console.error(chalk.redBright(`Failed to patch Grande Omega!\n${error.stack}`));
        await Downloader.cleanUp(__dirname + "/../tmp");
    }
}

export async function remoteMain(goDir: string, askUserInput = false){
    try {
        const dl = new Downloader(goDir + "/tmp", goDir),
            go = new GO(goDir, goDir + "/tmp", true),
            needsDownload = await go.checkVersion("http://grandeomega.com/api/v1/CustomAssignmentLogic/version");

        if(needsDownload){
            const isWin = await go.isWindowsVer();

            if(isWin){
                console.log("\nWindows version detected\n");

                dl.setWinPaths();
                go.setWinPaths();

                await handleSkins(go, dl, askUserInput);
                
                console.log(chalk.blueBright("Cleaning up"));
                await Downloader.cleanUp(goDir + "/tmp");

                console.log(chalk.blueBright("Finished"));
                return;
            }

            console.log("\nYour Grande Omega version is outdated or not installed!\nYou'd probably want to update it...\n");
            
            if (askUserInput && await askDownloadGO(goDir)){
                await dl.downloadFile("http://www.grandeomega.com/downloads/go_student_mac.zip");
                dl.unzipFile();
                await Downloader.cleanUp(goDir + "/.skin");
            }
        }

        await go.patch();

        if (await go.hasDepsInstalled()){
            console.log(chalk.blueBright("Removing (pre-)installed dependencies"));
            await Downloader.cleanUp(goDir + "/node_modules");
        }

        await go.installDependencies();
        await handleSkins(go, dl, askUserInput);

        console.log(chalk.blueBright("Cleaning up"));
        await Downloader.cleanUp(goDir + "/tmp");

        console.log(chalk.blueBright("Finished"));
    } catch(error: any) {
        console.error(chalk.redBright(`Failed to patch Grande Omega!\n${error.stack}`));
    }
}

async function handleSkins(go: GO, dl: Downloader, askUserInput: boolean) {
    const hasSkinInstalled = await go.hasSkinInstalled();

    if (!hasSkinInstalled){
        if (askUserInput && await askApplySkin()) {
            const skins: { [index: string]: string } = await (await fetch("https://raw.githubusercontent.com/Matthbo/GrandeOmega-patcher/master/skins.json")).json(),
                skinNames = Object.keys(skins);

            console.log(`Available skins:\n- ${skinNames.join("\n- ")}`);

            const wantedSkin = await askWantedSkin(skinNames);
            if (wantedSkin != "none") {
                await dl.downloadSkin(`${skins[wantedSkin]}/archive/refs/heads/master.zip`);
                dl.unzipSkin(wantedSkin);
            }
        }
    } else {
        console.log("A skin is already installed");
    }
}
