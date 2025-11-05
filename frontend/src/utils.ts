export const getFileNameFrom = (header: string | null) => {
    if (!header) return "audio.mp3";

    // Tentative filename*
    const utf8Match = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/);
    if (utf8Match) return decodeURIComponent(utf8Match[1]);

    // Tentative filename="..."
    const asciiMatch = header.match(/filename="(.+?)"/);
    if (asciiMatch) return asciiMatch[1];

    return "audio.mp3";
};
