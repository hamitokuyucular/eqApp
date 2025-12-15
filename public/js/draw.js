let draw;

export function enableDrawRect(map) {
    if (draw) {
        map.removeInteraction(draw);
    }

    const drawSource = new ol.source.Vector();

    const drawLayer = new ol.layer.Vector({
        source: drawSource,
    });
    map.addLayer(drawLayer);

    draw = new ol.interaction.Draw({
        source: drawSource,
        type: "Circle", // Circle + geometryFunction ile rectangle
        geometryFunction: ol.interaction.Draw.createBox()
    });

    map.addInteraction(draw);

    draw.on("drawend", (event) => {
        const [minX, minY, maxX, maxY] = event.feature.getGeometry().getExtent();
        const [minlon, minlat] = ol.proj.toLonLat([minX, minY]);
        const [maxlon, maxlat] = ol.proj.toLonLat([maxX, maxY]);
        document.getElementById('minlat').value = minlat.toFixed(3);
        document.getElementById('maxlat').value = maxlat.toFixed(3);
        document.getElementById('minlon').value = minlon.toFixed(3);
        document.getElementById('maxlon').value = maxlon.toFixed(3);
        map.removeInteraction(draw);
    });
    document.getElementById("fetchBtn").addEventListener("click", async () => {
        drawSource.clear();
    });
}