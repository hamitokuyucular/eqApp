export async function renderInfoPanel(data, map) {

    const container = document.getElementById("pointsContainer");
    container.innerHTML = "";

    data.forEach((p, index) => {

        const itemId = `point-${index}`;
        const collapseId = `collapse-${index}`;

        const item = document.createElement("div");
        item.className = "accordion-item";

        item.innerHTML = `
            <h2 class="accordion-header">
                <button class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#${collapseId}">
                    ${p.name} (${p.il} / ${p.ilce})
                </button>
            </h2>

            <div id="${collapseId}"
                 class="accordion-collapse collapse"
                 data-bs-parent="#pointsContainer">

                <div class="accordion-body">

                    <div class="mb-2">
                        <strong>Konum</strong><br>
                        İl: ${p.il}<br>
                        İlçe: ${p.ilce}
                    </div>

                    <div class="mb-2">
                        <strong>Zemin & Tehlike</strong><br>
                        Vs30: ${p.vs}<br>
                        PGA: ${p.pga}<br>
                        Tehlike İndeksi: ${p.hazard}
                    </div>

                    <div class="mb-2">
                        <strong>En Yakın Fay</strong>
                        ${p.faultline.map(f => `
                            <div>${f.fayadi} – ${f.distance_km} km</div>
                        `).join("")}
                    </div>

                    <div class="mb-2">
                        <strong>Toplanma Alanları</strong>
                        ${p.facilities.map((f, i) => `
                            <div class="border rounded p-2 mb-2">
                                <div><b>${i + 1}. ${f.tesis_adi}</b></div>
                                <div class="small text-muted">
                                    ${f.il} / ${f.ilce} / ${f.mahalle}
                                </div>
                                <div>${f.distance_km} km</div>

                                <button class="directions-btn btn btn-sm btn-outline-secondary mt-2"
                                    data-origin-lat="${p.lat}"
                                    data-origin-lon="${p.lon}"
                                    data-dest-lat="${f.lat}"
                                    data-dest-lon="${f.lon}">
                                    Yol tarifi al
                                </button>
                            </div>
                        `).join("")}
                    </div>

                </div>
            </div>
        `;

        item.querySelector(".accordion-button").addEventListener("click", () => {
            const coord = ol.proj.fromLonLat([p.lon, p.lat]);
            map.getView().animate({
                center: coord,
                zoom: 14,
                duration: 700
            });
        });

        container.appendChild(item);
    });

    container.addEventListener("click", (e) => {
        if (!e.target.classList.contains("directions-btn")) return;

        const btn = e.target;

        const params = new URLSearchParams({
            api: 1,
            origin: `${btn.dataset.originLat},${btn.dataset.originLon}`,
            destination: `${btn.dataset.destLat},${btn.dataset.destLon}`,
            travelmode: "driving"
        });

        window.open(`https://www.google.com/maps/dir/?${params}`, "_blank");
    });
}
