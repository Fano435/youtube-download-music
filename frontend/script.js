const msg = document.getElementById("status");
const form = document.getElementById("convert-form");
const url = form.querySelector("#video-url");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Conversion en cours...";

    try {
        const response = await(fetch(`http://localhost:3000/convert?url=${encodeURI(url.value)}`))
        if (!response.ok){
            throw new Error("Server error")
        }

        console.log(response);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "audio.mp3";
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        msg.textContent = "Téléchargement terminé !";
    }
    catch (err) {
        console.log(err)
        msg.textContent = "Erreur: Conversion failed"
    }

    url.value = "";
})