import { getFilters } from "./filters.js";
import { fetchEqData } from "./eqApi.js";
import { map, eqPointLayer, initMap,  updateMap } from "./map.js";
import { maxEqFunction } from "./mainStats.js";
import { enableDrawRect } from "./draw.js";
import { popupFunction } from "./popup.js";
import { addCityName } from "./cityNameApi.js";
import { fetchWithinAnalysisResult } from "./withinAnalysisApi.js";
import { showWithinResultLayer } from "./withinResults.js";
import { showStatsPanel } from "./showStatsPanel.js";

await initMap();
await addCityName();
await popupFunction(map, eqPointLayer);

document.getElementById("fetchBtn").addEventListener("click", async () => {
    const filters = getFilters();
    const data = await fetchEqData(filters);
    updateMap(data);
    maxEqFunction(data); 
});

document.getElementById("drawBoxBtn").addEventListener("click", () => {
    enableDrawRect(map);
});


document.getElementById("togglePanel").addEventListener("click", () => {
    document.getElementById("statsPanel").classList.toggle("visible");
});

document.getElementById("cityFilterAnalysisBtn").addEventListener("click", async() => {
    const city = document.getElementById("citySelect").value;
    if(!city) return;

    const withinData = await fetchWithinAnalysisResult(city);
    
    await showWithinResultLayer(map, withinData, city);
    showStatsPanel(withinData);
});