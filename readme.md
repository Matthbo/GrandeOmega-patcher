# Grande Omega Patcher

A dependency patcher for Grande Omega.

The objective of this tool is to patch Grande Omega's dependencies, removing unnecessary dependencies, updating dependencies and most importantly: Fix electron for Linux users.

The CLI tool can patch the mac & auto-updater versions of Grande Omega, it can also patch the auto-updater itself.  
**NOTE:** It only works on Windows if you use either the mac version of Grande Omega or the auto-updater.  
You can also use the Node.js application of the patcher as an auto-updater/auto-patcher.

## Install as cli tool
1. Make sure you have [Node.js v10+](https://nodejs.org/)
2. Install using `npm i -g grandeomega-patcher`
3. Open a CMD/Powershell/Terminal window
4. Go to a folder containing Grande Omega
5. Run using `go-patcher` or `gopatcher`

## Install as Node.js application
1. Make sure you have [Node.js v10+](https://nodejs.org/)
2. Download / clone this repo
3. Install dependencies using `npm install` (or `npm i` for short)
4. Run using `npm start`

## Use as a Node.js dependency
1. Install using `npm i grandeomega-patcher`
2. Import using commonjs
    ```js
    goPatcher = require("grandeomega-patcher")
    ```
    Or with ES6 imports
    ```js
    import { patcher, Downloader } from "grandeomega-patcher"
    ```
3.  How to use
    ```js
    // Downloader
    const dl = new Downloader(/* outDir: string, goDir: string */);
    await dl.downloadFile(/* url: string */);
    dl.unzipFile();

    // Static cleanup function
    await Downloader.cleanUp(/* outDir: string, handleError?: (error: Error) => void */);

    // Patcher
    await patcher(/* goDir: string */);
    ```

## What it does
1. Checks Grande Omega version (if available)

    On older version (as Node.js application):  
    1. Downloads the newest Grande Omega zip file
    2. Extracts it to the `GO/` folder
2. Patches Grande Omega files
3. Installs / updates Grande Omega dependencies
