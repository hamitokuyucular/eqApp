export async function renderInfoPanel(data) {
    const container = document.getElementById("pointsContainer");
    container.innerHTML = "";

    data.forEach((p, index) => {
        const card = document.createElement("div");
        card.className = "point-card";

        const header = document.createElement("div");
        header.className = "point-header";
        header.innerText = `${p.name} (${p.il} / ${p.ilce})`;

        const body = document.createElement("div");
        body.className = "point-body";

        body.innerHTML = `
            <div class="point-section">
                <div class="point-section-title">Konum</div>
                <div class="value-row">İl: ${p.il}</div>
                <div class="value-row">İlçe: ${p.ilce}</div>
            </div>

            <div class="point-section">
                <div class="point-section-title">Zemin & Tehlike</div>
                <div class="value-row">Vs30: ${p.vs}</div>
                <div class="value-row">PGA: ${p.pga}</div>
                <div class="value-row">Tehlike İndeksi: ${p.hazard}</div>
            </div>

            <div class="point-section">
                <div class="point-section-title">En Yakın Fay</div>
                ${
                        p.faultline.map(f => `
                        <div class="value-row">
                            ${f.fayadi} – ${f.distance_km} km
                        </div>
                    `).join("")
                }
            </div>

            <div class="point-section">
                <div class="point-section-title">Toplanma Alanları</div>
                ${p.facilities.map((f, i) => `
                    <div class="facility-item">
                        <span><b>${i + 1}. ${f.tesis_adi}</b></span>
                        <span>${f.il} / ${f.ilce} / ${f.mahalle}</span>
                        <span class="facility-distance">${f.distance_km} km</span>
                    </div>
                `).join("")}
            </div>
        `;

        header.addEventListener("click", () => {
            const open = body.style.display === "block";
            document.querySelectorAll(".point-body").forEach(b => b.style.display = "none");
            body.style.display = open ? "none" : "block";
        });

        card.appendChild(header);
        card.appendChild(body);
        container.appendChild(card);
    });
}
