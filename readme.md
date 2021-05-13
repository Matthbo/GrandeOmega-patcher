# Grande Omega Patcher

A dependency patcher for Grande Omega.

The objective of this tool is to patch Grande Omega's dependencies, removing unnecessary dependencies, updating dependencies and most importantly: Fix electron for Linux users.  
This tool can also apply skins from the [Grande-Omega-skins](https://github.com/Grande-Omega-Skins) organization.

The CLI tool can patch the mac version of Grande Omega (works on Windows, MacOS & Linux).  
**NOTE:** It only works on Windows if you use the mac version of Grande Omega.

## What it does
1. Checks Grande Omega version (if available)

    On older version (_optional_):
    1. Downloads the newest Grande Omega zip file
    2. Extracts it to the folder
2. Patches Grande Omega files
3. Installs / updates Grande Omega dependencies
4. (_optional_) downloads & applies chosen skin

## Install as cli tool
1. Make sure you have [Node.js v12+](https://nodejs.org/)
2. Install using `npm i -g grandeomega-patcher`
3. Open a CMD/Powershell/Terminal window
4. Go to a folder containing Grande Omega or create a new one
5. Run using `go-patcher` or `gopatcher`

## Alternative install methods / uses

### Install as Node.js application
1. Make sure you have [Node.js v12+](https://nodejs.org/)
2. Download / clone this repo
3. Install dependencies using `npm install` (or `npm i` for short)
4. Run using `npm start`

### Use as a Node.js dependency
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
