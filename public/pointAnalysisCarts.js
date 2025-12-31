let vs30Chart;
let pgaChart;
let hazardChart;

export async function pointAnalysisCarts(analysisResults) {

    const labels = analysisResults.map(p => p.name);

    const vs30Values = analysisResults.map(p => p.vs);
    const pgaValues = analysisResults.map(p => p.pga);
    const hazardValues = analysisResults.map(p => p.hazard);

    if (vs30Chart) vs30Chart.destroy();
    if (pgaChart) pgaChart.destroy();
    if (hazardChart) hazardChart.destroy();

    vs30Chart = new Chart(document.getElementById("vs30Chart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "VS30 (m/s)",
                data: vs30Values
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "VS30 (m/s)"
                    }
                }
            }
        }
    });

    pgaChart = new Chart(document.getElementById("pgaChart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "PGA (g)",
                data: pgaValues
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "PGA (g)"
                    }
                }
            }
        }
    });

    hazardChart = new Chart(document.getElementById("hazardChart"), {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Tehlike İndeksi",
                data: hazardValues,
                tension: 0.3,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Tehlike İndeksi"
                    }
                }
            }
        }
    });


}