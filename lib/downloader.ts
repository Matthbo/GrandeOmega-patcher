import fetch from "node-fetch";
import admZip from "adm-zip";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import rimraf from "rimraf";
import { TestIfDirExistAndCreateDir } from "./utils";

export class Downloader {
    outDir: string;
    goDir: string;
    filePath: string;
    skinPath: string;

    constructor(outDir: string, goDir: string) {
        this.outDir = outDir;
        this.goDir = path.normalize(goDir);
        this.filePath = path.normalize(outDir + "/go.zip");
        this.skinPath = path.normalize(outDir + "/skin.zip");
    }

    async downloadFile(url: string) {
        console.log(chalk.blueBright("Downloading Grande Omega"));
        
        await TestIfDirExistAndCreateDir(this.outDir);

        const res = await fetch(url),
            file = fs.createWriteStream(this.outDir + "/go.zip"),
            stream = res.body.pipe(file);

        await new Promise(resolve => stream.on("finish", resolve));
        console.log(chalk.greenBright("  Done"));
    }

    unzipFile(){
        console.log(chalk.blueBright("Unzipping Grande Omega"));

        const file = new admZip(this.filePath),
            fileContents = (file.getEntries().filter(
                content => !content.isDirectory && !(content.entryName.startsWith("go_student_mac/node_modules")
                    || content.entryName.endsWith("/")
                    || content.entryName.endsWith(".map"))
            )
        );

        fileContents.forEach(content => {
            const extractPath = path.dirname(`${this.goDir}/${content.entryName.replace("go_student_mac/", "")}`);

            file.extractEntryTo(content.entryName, extractPath, false, true);
        });

        console.log(chalk.greenBright("  Done"));
    }

    async downloadSkin(url: string){
        console.log(chalk.blueBright("Downloading skin"));
        
        await TestIfDirExistAndCreateDir(this.outDir);

        const res = await fetch(url),
            file = fs.createWriteStream(this.outDir + "/skin.zip"),
            stream = res.body.pipe(file);

        await new Promise(resolve => stream.on("finish", resolve));
        console.log(chalk.greenBright("  Done"));
    }

    unzipSkin(name: string){
        console.log(chalk.blueBright("Unzipping skin"));

        const file = new admZip(this.skinPath),
            repoFolder = file.getEntries()[0].entryName,
            pathPrefix = `${repoFolder}dist`,
            fileContents = (file.getEntries().filter(
                content => !content.isDirectory && 
                (content.entryName.includes("/wwwroot/") || content.entryName.endsWith("dist/index.html"))
            ));

        fileContents.forEach(content => {
            const extractPath = path.dirname(`${this.goDir}/${content.entryName.replace(`${pathPrefix}/`, "")}`)

            file.extractEntryTo(content.entryName, extractPath, false, true);
        });

        fs.promises.writeFile(this.goDir + "/.skin", name);

        console.log(chalk.greenBright("  Done"));
    }

    static async cleanUp(outDir: string, handleError?: (error: Error) => void){
        outDir = path.normalize(outDir);
        
        try{
            await promisify(rimraf)(outDir).catch(error => { if(error.code !== "ENOENT") throw error });
        } catch(error){
            if(handleError !== undefined) handleError(error);
            else console.error(chalk.redBright(`Failed to clean up!\n${error.stack}`));
        }
    }
}