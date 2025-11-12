import { getFileNameFrom } from "./utils";

const statusMsg = document.getElementById("status") as HTMLDivElement;
const form = document.getElementById("convert-form") as HTMLFormElement;
const urlInput = form.querySelector("#video-url") as HTMLInputElement;
const formatSelect = form.querySelector("#format") as HTMLSelectElement;
const page = document.querySelector(".global")!;

async function downloadAudio(url: string, format: string) {
    const response = await fetch(
        `http://localhost:3000/convert?url=${encodeURIComponent(
            url
        )}&format=${encodeURIComponent(format)}`
    );

    if (!response.ok) {
        // Try to read the JSON message returned by the server
        let errorMessage = `Server error (${response.status})`;
        try {
            const data = await response.json();
            if (data?.error) errorMessage = data.error;
        } catch {
            // If the response is not JSON, ignore and keep the default message
        }

        throw new Error(errorMessage);
    }

    const contentDisposition = response.headers.get("Content-Disposition");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No readable stream returned by response");

    const chunks = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
            chunks.push(value);
        }
    }
    
    const blob = new Blob(chunks, { type: "application/octet-stream" });
    const blobUrl = window.URL.createObjectURL(blob);
    const filename = getFileNameFrom(contentDisposition);

    const a = document.createElement("a");
    a.download = filename;
    a.href = blobUrl;
    a.click();
    a.remove();

    URL.revokeObjectURL(blobUrl);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const format = formatSelect.value.trim();
    const videoUrl = urlInput.value.trim();
    if (!videoUrl || !format) return;

    urlInput.blur();
    page.classList.add("non-clickable");
    statusMsg.textContent = "Conversion en cours ...";

    try {
        await downloadAudio(videoUrl, format);

        statusMsg.textContent = "Téléchargement terminé !";
    } catch (err) {
        statusMsg.textContent = `${err}`;
    } finally {
        page.classList.remove("non-clickable");
        urlInput.value = "";
    }
});
