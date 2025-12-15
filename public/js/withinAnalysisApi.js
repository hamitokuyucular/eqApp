export async function fetchWithinAnalysisResult(city) {
    const res = await fetch(`/api/analysis/${city}`);
    const resultData = await res.json();
    return resultData
}