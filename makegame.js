const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, 'Games');

function scanGames() {
    const folders = fs.readdirSync(gamesDir);

    const games = [];

    for (const folder of folders) {
        const fullPath = path.join(gamesDir, folder);

        if (fs.statSync(fullPath).isDirectory()) {
            const runFile = path.join(fullPath, 'run.html');

            if (fs.existsSync(runFile)) {
                games.push({
                    name: folder,
                    path: `./Games/${folder}/run.html`
                });
            }
        }
    }

    fs.writeFileSync(
        path.join(__dirname, 'games.json'),
        JSON.stringify(games, null, 2)
    );

    console.log("games.json generated with", games.length, "games");
}

scanGames();