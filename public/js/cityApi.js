export async function fetchIlBorders() {
    const res = await fetch("/api/il");
    const ilData = await res.json();
    return ilData
}