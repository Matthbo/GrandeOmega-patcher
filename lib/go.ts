import { colours, path } from "./deps.ts";

export class GO {
    baseLocation: string;
    patcherLocation: string;

    constructor(baseLocation: string, patcherLocation: string){
        this.baseLocation = path.normalize(baseLocation)
        this.patcherLocation = path.normalize(patcherLocation)
    }

    async checkVersion(url: string){
        console.log(colours.brightBlue("Checking for newer Grande Omega version"));

        const res = await fetch(url),
            onlineVersion = await res.text(),
            offlineVersion = await Deno.readTextFile(this.baseLocation + "/version.txt").catch(error => {
                console.log(Object.keys(error), error.name)
                if (error.name !== "NotFound")
                    throw error;
                else
                    "0";
            });

        return offlineVersion !== onlineVersion;
    }

    async installDependencies(){
        console.log(colours.brightBlue("Installing dependencies via npm"));

        const subProcess = Deno.run({
            cmd: ["npm", "i -s"],
            cwd: this.baseLocation
        });
        
        await subProcess.status().then(() =>
            console.log(colours.brightGreen("  Done"))
        ).catch((error: Error) => 
            console.error(colours.brightRed(`Failed to install dependencies:\n${error.stack}`))
        );
    }

    async patch(){
        console.log(colours.brightBlue("Patching files"));

        const mappings = JSON.parse(await Deno.readTextFile(this.patcherLocation + '/mapping.json')),
            patchesLocation = path.normalize(this.patcherLocation + "/patches/");

        for (const patchFileLocation in mappings){
            const sourceFileLocation = mappings[patchFileLocation],
                patchFile = await Deno.readFile(patchesLocation + patchFileLocation);

            await Deno.writeFile(this.baseLocation + `/${sourceFileLocation}`, patchFile);
        }
    }
}
