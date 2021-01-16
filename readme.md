# Grande Omega Packager

A dependency patcher for Grande Omega.

The objective of this tool is to patch Grande Omega's dependencies, removing unnecessary dependencies, updating dependencies and most importantly: Fix electron for Linux users.

Planned abilities:
- [x] Runnable as a cli tool on an existing GO location
- [ ] Call as a dependency (to be test)

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

## What it does
1. Checks Grande Omega version (if available)

    On older version (as Node.js application):  
    1. Downloads the newest Grande Omega zip file
    2. Extracts it to the `GO/` folder
2. Patches Grande Omega files
3. Installs / updates Grande Omega dependencies
