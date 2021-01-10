import { colours, path } from "./deps.ts";
import { Downloader } from "./downloader.ts";
import { GO } from "./go.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

async function main() {
    try {
        console.log(__dirname)
        const dl = new Downloader(__dirname + "/../tmp", __dirname + "/../GO"),
            go = new GO(__dirname + "/../GO", __dirname + "/../patcher");

        const needsDownload = await go.checkVersion("http://grandeomega.com/api/v1/CustomAssignmentLogic/version");

        if(needsDownload){    
            await dl.downloadFile("http://www.grandeomega.com/downloads/go_student_mac.zip");

            console.log(colours.brightBlue("Unzipping Grande Omega"));
            await Deno.remove(__dirname + "/../GO", { recursive: true }).catch(
                error => { if (error.name !== "NotFound") throw error }
            )/* .then(() => dl.unzipFile()); */

            // await go.patch();
            // await go.installDependencies();
        }

        console.log(colours.brightBlue("Cleaning up"));
        await cleanUp();

        console.log(colours.brightBlue("Finished"));
    } catch(error){
        console.error(colours.brightRed(`Failed to patch Grande Omega!\n${error.stack}`));
        await cleanUp();
    }
}

async function cleanUp(){
    try{
        await Deno.remove(__dirname + "/../tmp/go.zip").catch(error => { if(error.name !== "NotFound") throw error });
    } catch(error){
        console.error(colours.brightRed(`Failed to clean up!\n${error.stack}`));
    }
}

main();