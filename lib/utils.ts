import { promises as fsPromises, constants } from "fs";

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
