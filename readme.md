# Grande Omega Packager

A dependency patcher for Grande Omega.

The objective of this tool is to patch Grande Omega's dependencies, removing unnecessary dependencies, updating dependencies and most importantly: Fix electron for Linux users.

Planned abilities:
- [ ] Runnable by a cli
- [ ] Run patcher on an existing GO location

## How to use
1. Make sure you have [Node.js v10+](https://nodejs.org/)
2. Download / clone this repo
3. Install dependencies using `npm install` (or `npm i` for short)
4. Run using `npm start`

## What it does
1. Checks Grande Omega version (if available)

    On older version:  
    1. Downloads the newest Grande Omega zip file
    2. Extracts it to the `GO/` folder
2. Patches Grande Omega files
3. Installs / updates Grande Omega dependencies
