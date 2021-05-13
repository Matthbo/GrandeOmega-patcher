import path from "path";
import { cwd } from "process";
import { remoteMain } from "./lib/index";
import { TestIfDirExistAndCreateDir } from "./lib/utils";

const goLocation = path.join(cwd() + "/GO");

TestIfDirExistAndCreateDir(goLocation);
remoteMain(goLocation, true);
