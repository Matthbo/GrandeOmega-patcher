import chalk from "chalk";
import fetch from "node-fetch";
import { promises as fsPromises } from "fs";
import path from "path";
import util from "util";

export class GO {
    baseLocation: string;
    patcherLocation: string;

    constructor(baseLocation: string, patcherLocation: string){
        this.baseLocation = path.normalize(baseLocation)
        this.patcherLocation = path.normalize(patcherLocation)
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

    async patch(){
        console.log(chalk.blueBright("Patching files"));

        const mappings = JSON.parse(await fsPromises.readFile(this.patcherLocation + '/mapping.json', "utf8")),
            patchesLocation = path.normalize(this.patcherLocation + "/patches/");

        for (const patchFileLocation in mappings){
            const sourceFileLocation = mappings[patchFileLocation],
                patchFile = await fsPromises.readFile(patchesLocation + patchFileLocation);

            await fsPromises.writeFile(this.baseLocation + `/${sourceFileLocation}`, patchFile);
        }
    }
}
