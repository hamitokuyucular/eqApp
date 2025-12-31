import { renderInfoPanel } from "./renderInfoPanel.js";

export async function fetchPointAnalysisResult(points) {
    if (points.length === 0) {
        alert("Analiz için en az 1 nokta eklemelisiniz.");
        return;
    }
    const res = await fetch("/api/point-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({points})
    });
    const result = await res.json();
    
    renderInfoPanel(result.data);
    document.getElementById("infoPanel").style.display = "block";

    return result.data

}