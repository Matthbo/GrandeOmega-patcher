import { promises as fsPromises, constants } from "fs";
import { createInterface } from "readline";

export async function TestIfDirExistAndCreateDir(location: string) {
    try {
        await fsPromises.access(location, constants!.F_OK);
    } catch (error) {
        try {
            await fsPromises.mkdir(location, { recursive: true });
        } catch (error) {
            throw error;
        }
    };
};

export async function askQuestion<T>(question: string, handleAnswer: (res: string) => { res: T } | false): Promise<T>{
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    })

    let correctResponse = null;

    /* Ugly but whatever, it works */
    while (correctResponse === null){
        const res = handleAnswer(await new Promise<string>(resolve => rl.question(question + " ", res => { resolve(res.trim())})));

        if(res != false)
            correctResponse = res;
    }

    rl.close();

    return correctResponse.res;
}

export const askApplySkin = async () => await askQuestion<boolean>("Apply a skin? [y/n]", res => {
    res = res.toLowerCase();

    if (res.startsWith("y"))
        return { res: true };

    if (res.startsWith("n"))
        return { res: false };

    return false;
});

export const askWantedSkin = async (skinNames: string[]) => await askQuestion<string>("What skin would you like? (type 'none' to cancel)", res => {
    const resLowerCase = res.toLowerCase();

    if (skinNames.findIndex(name => name.toLowerCase() == resLowerCase) > -1 || resLowerCase == "none")
        return { res };

    return false;
})
