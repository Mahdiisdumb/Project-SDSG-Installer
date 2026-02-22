        const parts = Array.from({ length: 20 }, (_, i) => `Project SDSG.part.zip.${String(i + 1).padStart(3, '0')}`);
        const folder = './archive/'; // relative path to parts

        document.getElementById('install').onclick = async () => {
        const status = document.getElementById('status');
        const progressBar = document.getElementById('progressBar');

        try {
        // Ask user where to save the final ZIP
        const handle = await window.showSaveFilePicker({
        suggestedName: 'Project SDSG.zip',
        types: [{ description: 'ZIP File', accept: { 'application/zip': ['.zip'] } }]
        });
        const writable = await handle.createWritable();

        // Calculate total size first
        let totalBytes = 0;
        const sizes = [];
        for (const part of parts) {
        const response = await fetch(folder + part, { method: 'HEAD' });
        const size = Number(response.headers.get('Content-Length')) || 0;
        sizes.push(size);
        totalBytes += size;
        }

        let downloadedBytes = 0;

        // Download each part sequentially and write immediately
        for (let i = 0; i < parts.length; i++) {
        status.textContent = `Downloading ${parts[i]} (${i + 1}/${parts.length})...`;

        const response = await fetch(folder + parts[i]);
        if (!response.ok) throw new Error(`Failed to fetch ${parts[i]}`);

        const reader = response.body.getReader();
        while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await writable.write(value);
        downloadedBytes += value.length;

        // Update progress bar and MB info
        const mbDownloaded = (downloadedBytes / (1024*1024)).toFixed(2);
        const mbTotal = (totalBytes / (1024*1024)).toFixed(2);
        progressBar.value = (downloadedBytes / totalBytes) * 100;
        status.textContent = `Downloaded ${mbDownloaded} MB / ${mbTotal} MB`;
        }
        }

        await writable.close();
        status.textContent = 'Download complete!';
        progressBar.value = 100;

        } catch (err) {
        status.textContent = 'Error: ' + err.message;
        console.error(err);
        }
        };