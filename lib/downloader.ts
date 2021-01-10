import { colours, path, fs } from "./deps.ts";
// import admZip from "adm-zip";

export class Downloader {
    outDir: string;
    goDir: string;
    filePath: string;

    constructor(outDir: string, goDir: string) {
        this.outDir = outDir;
        this.goDir = path.normalize(goDir);
        this.filePath = path.normalize(outDir + "/go.zip");
    }

    async downloadFile(url: string) {
        console.log(colours.brightBlue("Downloading Grande Omega"));
        
        await fs.ensureDir(this.outDir);

        const res = await fetch(url)/* ,
            file = await Deno.create(this.outDir + "/go.zip");

        res.body?.pipeTo(file); */ // Doesn't work because file has no writable stream??????
        const file = await res.blob(),
            buffer = await file.arrayBuffer();

        await Deno.writeFile(this.outDir + "/go.zip", new Uint8Array(buffer));

        console.log(colours.brightGreen("  Done"));
    }

    unzipFile(){
        /* const file = new admZip(this.filePath),
            fileContents = (file.getEntries().filter(
                (content: any) => !(content.entryName.startsWith("go_student_mac/node_modules")
                    || content.entryName.endsWith("/")
                    || content.entryName.endsWith(".map"))
            )); 

        fileContents.forEach((content: any) => {
            let extractDir = path.dirname(`${this.goDir}/${content.entryName.replace("go_student_mac/", "")}`);

            file.extractEntryTo(content.entryName, extractDir, false, false);
        });

        console.log(colours.brightGreen("  Done")); */
    }
}