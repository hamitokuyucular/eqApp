export function updateBasicStats(selectedEq) {
    const city = document.getElementById("citySelect").value
    const count = selectedEq.length;

    const maxEq = selectedEq.reduce((a, b) => a.magnitude > b.magnitude ? a : b);
    const avgMag = (selectedEq.reduce((sum, x) => sum + x.magnitude, 0) / count).toFixed(2);
    const avgDepth = (selectedEq.reduce((sum, x) => sum + x.depth, 0) / count).toFixed(1);

    document.getElementById("basicStats").innerHTML = `
        <p><b>Seçilen sınırlamalara göre ${city} ilinde meydana gelen deprem verileri:</b></p>
        <p>Deprem Sayısı: <b>${count}</b></p>
        <p>En Büyük Deprem: <b>${maxEq.magnitude}</b></p>
        <p>Ortalama Büyüklük: <b>${avgMag}</b></p>
        <p>Ortalama Derinlik: <b>${avgDepth} km</b></p>
    `;
}