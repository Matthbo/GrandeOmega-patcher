import chalk from "chalk";
import fetch from "node-fetch";
import { promises as fsPromises } from "fs";
import path from "path";
import util from "util";

export class GO {
    baseLocation: string;
    patcherLocation: string;

    constructor(baseLocation: string, patchesLocation: string){
        this.baseLocation = path.normalize(baseLocation);
        this.patcherLocation = path.normalize(patchesLocation);
    }

    async checkVersion(url: string){
        console.log(chalk.blueBright("Checking for newer Grande Omega version"));

        const res = await fetch(url),
            onlineVersion = await res.text(),
            offlineVersion = await fsPromises.readFile(this.baseLocation + "/version.txt", { encoding: 'utf8' }).catch(error => {
                if (error.code !== "ENOENT")
                    throw error;
                else
                    return "0";
            });

        return offlineVersion !== onlineVersion;
    }

    async installDependencies(){
        console.log(chalk.blueBright("Installing dependencies via npm"));

        const exec = util.promisify(require('child_process').exec);
        
        await exec("npm i -s", { cwd: this.baseLocation }).then(() => 
            console.log(chalk.greenBright("  Done"))
        ).catch((error: Error) => 
            console.error(chalk.redBright(`Failed to install dependencies:\n${error.stack}`))
        );
    }

    async patch(online: boolean){
        console.log(chalk.blueBright("Patching files"));

        let mappings: { [index: string]: string };

        if(online){
            const basePatcherUrl = "https://raw.githubusercontent.com/Matthbo/GrandeOmega-patcher/master/patcher";
            mappings = await (await fetch(basePatcherUrl + "/mapping.json")).json();

            for(const [fileName, sourceFileLocation] of Object.entries(mappings)){
                const patchFile = await (await fetch(`${basePatcherUrl}/patches/${fileName}`)).buffer();
                await fsPromises.writeFile(this.baseLocation + `/${sourceFileLocation}`, patchFile);
            }
        } else {
            const patchesLocation = path.normalize(this.patcherLocation + "/patches/");
            mappings = JSON.parse(await fsPromises.readFile(this.patcherLocation + '/mapping.json', "utf8"));

            for(const [fileName, sourceFileLocation] of Object.entries(mappings)){
                const patchFile = await fsPromises.readFile(patchesLocation + fileName);
                await fsPromises.writeFile(this.baseLocation + `/${sourceFileLocation}`, patchFile);
            }
        }
    }
}
