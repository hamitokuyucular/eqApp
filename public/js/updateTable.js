export function updateTable(selectedEq) {
    const tbody = document.querySelector("#eqTable tbody");
    tbody.innerHTML = ""

    selectedEq.forEach((eq) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${eq.eventID}</td>
            <td>${eq.date}</td>
            <td>${eq.district}</td>
            <td>${eq.magnitude}</td>
            <td>${eq.depth}</td>
            <td>${eq.rms}</td>
        `;
        tr.style.cursor = "pointer";
        tbody.appendChild(tr); 
    })
}