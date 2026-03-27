const parts = Array.from({ length: 20 }, (_, i) =>
    `Project-SDSG.part.zip.${String(i + 1).padStart(3, '0')}`
);

const folder = './archive/';

const status = document.getElementById('status');
const progressBar = document.getElementById('progressBar');
document.getElementById('install').onclick = async () => {
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: 'Project SDSG.zip',
            types: [{ accept: { 'application/zip': ['.zip'] } }]
        });

        const writable = await handle.createWritable();

        let total = 0;
        let sizes = [];

        for (const part of parts) {
            const res = await fetch(folder + part, { method: 'HEAD' });
            const size = Number(res.headers.get('Content-Length')) || 0;
            sizes.push(size);
            total += size;
        }

        let downloaded = 0;

        for (let i = 0; i < parts.length; i++) {
            const res = await fetch(folder + parts[i]);
            const reader = res.body.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                await writable.write(value);
                downloaded += value.length;

                progressBar.value = (downloaded / total) * 100;
                status.textContent =
                    `${(downloaded / 1e6).toFixed(2)}MB / ${(total / 1e6).toFixed(2)}MB`;
            }
        }

        await writable.close();
        status.textContent = "Done";

    } catch (e) {
        status.textContent = e.message;
    }
};

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

const loreHTML = `
<p>A local game collection packaged and maintained by Mahdiisdumb.</p>

<h2>Overview</h2>
<p>Project SDSG was created and is maintained by <strong>Mahdiisdumb</strong>. 
The project began as a portable collection designed to run from local HTML files. 
It was originally distributed on removable media and archived as USB.zip and later renamed to Project SDSG (School Defying Software Games).</p>

<p>Note: SDSG is provided as a community project for offline use and local testing. 
The project does not encourage bypassing security controls; local packaging simply ensures availability when network access is limited.</p>

<h2>Maintainer & Contributors</h2>
<p><strong>Maintainer:</strong> Mahdi</p>
<p><strong>Contributors:</strong> Mahdi, Jameson, Luke, Andrew, Christopher, Blake, Ibraheem, Jacob, Sean</p>

<p>Project SDSG Community project. For full project details, see the repository.</p>
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