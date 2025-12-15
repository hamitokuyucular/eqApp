import { updateBasicStats } from "./updateBasicStats.js";
import { updateCharts } from "./updateCharts.js";
import { updateTable } from "./updateTable.js";
export let selectedEq = [];

const statsPanelCloserDOM = document.getElementById('statsPanel-closer');
statsPanelCloserDOM.onclick = function () {
    document.getElementById("statsPanel").classList.toggle("visible");
    statsPanelCloserDOM.blur();
    return false;
};

export function showStatsPanel(analysisData) {

    selectedEq = analysisData.features.map(f => ({
        eventID: f.properties.eventID,
        provice: f.properties.provice,
        district: f.properties.district,
        date: f.properties.date,
        magnitude: f.properties.magnitude,
        depth: f.properties.depth,
        rms: f.properties.rms
    }));

    updateBasicStats(selectedEq);
    updateCharts(selectedEq);
    updateTable(selectedEq);
}