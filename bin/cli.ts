#!/usr/bin/env node

import { cwd } from "process";
import { remoteMain } from "../lib/index";

remoteMain(cwd(), true);
