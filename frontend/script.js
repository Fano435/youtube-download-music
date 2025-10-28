const bar = document.getElementById("bar");
const form = document.getElementById("convert-form");
const url = form.querySelector("#video-url");
const page = document.querySelector(".global");

function getFileNameFrom(header) {
  if (!header) return "audio.mp3";

  // Tentative filename*
  const utf8Match = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/);
  if (utf8Match) return decodeURIComponent(utf8Match[1]);

  // Tentative filename="..."
  const asciiMatch = header.match(/filename="(.+?)"/);
  if (asciiMatch) return asciiMatch[1];

  return "audio.mp3";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    url.blur();
    page.classList.add("non-clickable");
    bar.textContent = "Conversion en cours...";
    
    try {
        const response = await(fetch(`http://localhost:3000/convert?url=${encodeURI(url.value)}`))
        if (!response.ok){
            throw new Error("Server error")
        }
        
        const contentDisposition = response.headers.get("Content-Disposition");
        const contentLength = response.headers.get("Content-Length");
        console.log(contentDisposition, contentLength)
        
        let receivedLength = 0;
        const chunks = [];
        const reader = response.body.getReader();
        
        reader.read().then(processAudio = ({done, value}) => {
            if (done) {
                const blobUrl = window.URL.createObjectURL(new Blob(chunks));
                const filename = getFileNameFrom(contentDisposition);
                const a = document.createElement("a");
                a.download = filename;
                a.href = blobUrl;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(blobUrl);
                bar.textContent = "Téléchargement terminé !";
                return ;
            }
            
            chunks.push(value);
            receivedLength += value.length;
            console.log("Bits received", receivedLength)
            return reader.read().then(processAudio);
        })
        
    }
    catch (err) {
        console.log(err)
        bar.textContent = "Erreur: Conversion failed"
    }
    page.classList.remove("non-clickable");
    url.value = "";
})