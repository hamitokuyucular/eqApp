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
    console.log(result)
//     result.data.forEach(p => {
//     console.log("Nokta:", p.name);
//     p.facilities.forEach((f, i) => {
//         console.log(
//             `${i + 1}. ${f.tesis_adi} → ${f.distance_km} km`
//         );
//     });
// });
}