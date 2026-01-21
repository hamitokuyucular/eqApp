import { getFilters } from "./filters.js";
import { fetchEqData } from "./eqApi.js";
import { map, eqPointLayer, initMap,  updateMap } from "./map.js";
import { maxEqFunction, toggleStats } from "./mainStats.js";
import { enableDrawRect } from "./draw.js";
import { popupFunction } from "./popup.js";
import { addCityName } from "./cityNameApi.js";
import { fetchWithinAnalysisResult } from "./withinAnalysisApi.js";
import { showWithinResultLayer } from "./withinResults.js";
import { showStatsPanel } from "./showStatsPanel.js";
import { enableDrawPoint, disableDrawPoint, getDrawnPoints } from "./pointDraw.js";
import { fetchPointAnalysisResult } from "./pointAnalysisApi.js";
import { renderInfoPanel } from "./renderInfoPanel.js";
import { pointAnalysisCarts } from "./pointAnalysisCarts.js";

await initMap();
await addCityName();
await popupFunction(map, eqPointLayer);

document.getElementById("fetchBtn").addEventListener("click", async () => {
    const filters = getFilters();
    const data = await fetchEqData(filters);
    updateMap(data);
    eqPointLayer.setVisible(true);
    maxEqFunction(data);
    toggleStats();

    const toastDOM = document.getElementById('eqToats');
    const toast = new bootstrap.Toast(toastDOM);
    toast.show();

});

document.getElementById("drawBoxBtn").addEventListener("click", () => {
    enableDrawRect(map);
});


document.getElementById("togglePanel").addEventListener("click", () => {
    document.getElementById("statsPanel").classList.toggle("visible");
});

document.getElementById("addPointBtn").addEventListener("click", function () {
    enableDrawPoint(map);
});

document.getElementById("closePointBtn").addEventListener("click", function () {
    disableDrawPoint(map);
});

document.getElementById("pointAnalysisBtn").addEventListener("click", async () => {
    const points  = getDrawnPoints();
    const pointAnalysisResult = await fetchPointAnalysisResult(points);
    await renderInfoPanel(pointAnalysisResult, map);
    await pointAnalysisCarts(pointAnalysisResult);
    const toastDOM = document.getElementById('pointAnalysisToast');
        const toast = new bootstrap.Toast(toastDOM);
        toast.show();
})

document.getElementById("cityFilterAnalysisBtn").addEventListener("click", async() => {
    const city = document.getElementById("citySelect").value;
    if(!city) {
        const toastDOM = document.getElementById('cityFilterErrToast');
        const toast = new bootstrap.Toast(toastDOM);
        toast.show();
        return;
    };

    const withinData = await fetchWithinAnalysisResult(city);
    
    await showWithinResultLayer(map, withinData, city);
    showStatsPanel(withinData);

    const toastDOM = document.getElementById('cityFilterToast');
    toastDOM.querySelector(".toast-body").innerHTML=
        `${city} içindeki depremler filtrelendi. Analiz sonuçlarını görüntüleyebilirsiniz!`
    const toast = new bootstrap.Toast(toastDOM);
    toast.show();
});

document.getElementById("statsCardBtn").addEventListener("click", async() => {
    toggleStats();
});

document.getElementById("statsCard-close").addEventListener("click", async() => {
    toggleStats();
});


    document.getElementById("infoPanel").style.display = isVisible ? "none" : "block";
});

document.getElementById("closePanel").onclick = () => {
    infoPanel.style.display = "none";
};