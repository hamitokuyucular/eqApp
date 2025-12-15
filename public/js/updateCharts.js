let mainCart;
let magChart;
let depthChart;

function magToColor(mag) {
    if (mag >= 7) return "rgba(255, 0, 0, 1.0)";         // kırmızı
    if (mag >= 6) return "rgba(255, 80, 0, 1.0)";        // kırmızı-turuncu
    if (mag >= 5) return "rgba(255, 150, 0, 1.0)";       // turuncu
    if (mag >= 4) return "rgba(255, 200, 0, 1.0)";       // sarı
    if (mag >= 3) return "rgba(150, 255, 0, 1.0)";       // sarı-yeşil
    return "rgba(75, 175, 75, 1.0)";                     // yeşil
}

function normalizeDate(isoString) {
    // "2023-02-06T18:05:09.000Z" → "2023-02-06 18:05:09"
    return isoString.split("T")[0] + " " + isoString.split("T")[1].split(".")[0];
}

function mainChartFunction(selectedEq) {
    // 1) Magnitude aralıklarını tanımlıyoruz
    const ranges = [
        { label: "≥ 7", min: 7, max: 99 },
        { label: "6 – 7", min: 6, max: 6.99 },
        { label: "5 – 6", min: 5, max: 5.99 },
        { label: "4 – 5", min: 4, max: 4.99 },
        { label: "3 – 4", min: 3, max: 3.99 },
        { label: "< 3", min: 0, max: 2.99 },
    ];
    const datasets = ranges.map(range => {
        const filtered = selectedEq
            .filter(eq => eq.magnitude >= range.min && eq.magnitude <= range.max)
            .map(eq => ({
                x: normalizeDate(eq.date),
                y: eq.depth,
                r: eq.magnitude * 2,
            }));

        return {
            label: range.label,
            data: filtered,
            backgroundColor: magToColor(range.min),
            borderColor: "#ffffffff",
            borderWidth: 1,
        };
    });

    Chart.register(ChartZoom);
    const mainCartDOM = document.getElementById('mainChart');

    return new Chart(mainCartDOM, {
        type: "bubble",
        data: { datasets },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "time",
                    title: { 
                        display: true, 
                        text: "Tarih" ,
                        font: { weight: "bold" }
                    },
                    time: {
                        unit: "day",
                        tooltipFormat: "yyyy-MM-dd HH:mm"
                    },
                },
                y: {
                    reverse: true,
                    title: { 
                        display: true, 
                        text: 'Derinlik (km)',
                        font: { weight: "bold" } 
                    }
                }
            },
            plugins: {
                legend: { 
                    display: true,
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: mainCartDOM => {
                            const d = mainCartDOM.raw;
                            return [
                                `Tarih: ${d.x}`,
                                `Derinlik: ${d.y} km`,
                                `Büyüklük: ${(d.r / 2).toFixed(1)}`,
                            ];
                        }
                    }
                },
                zoom: {
                    zoom: {
                        wheel: { enabled: true },   // mouse wheel zoom
                        mode: "xy"
                    },
                    pan: {
                        enabled: true,
                        mode: "xy",
                        threshold: 0
                    }
                }
            }
        }
    });
}

export function updateCharts(selectedEq) {
    const mags = selectedEq.map(q => q.magnitude);

    if (mainCart) mainCart.destroy();
    if (magChart) magChart.destroy();

    mainCart = mainChartFunction(selectedEq);

    magChart = new Chart(document.getElementById("magChart"), {
        type: "line",
        data: {
            labels: mags.map((_, i) => i+1),
            datasets: [{ data: mags, label: "Büyüklük" }]
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: "Büyüklük",
                        font: { weight: "bold" }
                    }
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: { enabled: true },   // mouse wheel zoom
                        mode: "xy"
                    },
                    pan: {
                        enabled: true,
                        mode: "xy",
                        threshold: 0
                    }
                }
            }
        }
    });
}

