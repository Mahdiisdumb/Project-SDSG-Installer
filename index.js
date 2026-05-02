const parts = Array.from({ length: 19 }, (_, i) =>
    `Project-SDSG.part.zip.${String(i + 1).padStart(3, '0')}`
);

const folder = './archive/';

const status = document.getElementById('status');
const progressBar = document.getElementById('progressBar');
const installBtn = document.getElementById('install');

installBtn.onclick = async () => {
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: 'Project SDSG.zip',
            types: [{ accept: { 'application/zip': ['.zip'] } }]
        });

        const writable = await handle.createWritable();

        let downloaded = 0;

        progressBar.max = parts.length;
        progressBar.value = 0;

        for (let i = 0; i < parts.length; i++) {
            const res = await fetch(folder + parts[i]);

            if (!res.body) throw new Error("Stream not supported");

            const reader = res.body.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                await writable.write(value);

                downloaded += value.byteLength;

                // safe progress (NO division, NO Infinity)
                progressBar.value = i + (value ? 0.5 : 0);

                status.textContent =
                    `${(downloaded / 1e6).toFixed(2)}MB downloaded`;
            }

            progressBar.value = i + 1;
        }

        await writable.close();

        progressBar.value = parts.length;
        status.textContent = "Done";

    } catch (e) {
        status.textContent = e.message;
    }
};

// ---------- GAME SYSTEM ----------

let games = [];

fetch('./games.json')
    .then(r => r.json())
    .then(data => games = data);

const viewer = document.getElementById('viewer');
const frame = document.getElementById('frame');
const title = document.getElementById('gameTitle');

let current = 0;

function loadGame(i) {
    if (!games.length) return;

    current = (i + games.length) % games.length;

    frame.src = games[current].path;
    title.textContent = games[current].name;
}

document.getElementById('originals').onclick = () => {
    viewer.style.display = 'flex';
    loadGame(0);
};

document.getElementById('prev').onclick = () => loadGame(current - 1);
document.getElementById('next').onclick = () => loadGame(current + 1);

document.getElementById('close').onclick = () => {
    viewer.style.display = 'none';
    frame.src = '';
};

// ---------- LORE PANEL ----------

const loreHTML = `
<p>A local game collection packaged and maintained by Mahdiisdumb.</p>

<h2>Overview</h2>
<p>Project SDSG was created and is maintained by <strong>Mahdiisdumb</strong>. 
It started as a local offline HTML collection.</p>

<h2>Maintainer & Contributors</h2>
<p><strong>Maintainer:</strong> Mahdi</p>
<p><strong>Contributors:</strong> Mahdi, Jameson, Luke, Andrew, Christopher, Blake, Ibraheem, Jacob, Sean</p>
`;

const lorePanel = document.getElementById('lorePanel');
const loreContent = document.getElementById('loreContent');

document.getElementById('gallery').onclick = () => {
    lorePanel.style.display = 'block';
    loreContent.innerHTML = loreHTML;
};

document.getElementById('closeLore').onclick = () => {
    lorePanel.style.display = 'none';
};