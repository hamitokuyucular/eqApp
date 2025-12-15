export async function popupFunction(map, eqPointLayer) {
    const popupDOM = document.getElementById('ol-popup');
    const popupContentDOM = document.getElementById('popup-content');
    const popupCloserDOM = document.getElementById('ol-popup-closer');

    const overlay = new ol.Overlay({
        element: popupDOM,
    });

    map.addOverlay(overlay);
    popupCloserDOM.onclick = function () {
        overlay.setPosition(undefined);
        popupDOM.style.display = 'none';
        popupCloserDOM.blur();
        return false;
    };

    map.on('singleclick', function (event) {
        const feature = map.forEachFeatureAtPixel(event.pixel, (f, layer) => {
            if (layer === eqPointLayer) {
                return f;
            }
        });
        if (feature) {
            const coordinates = feature.getGeometry().getCoordinates();
            const props = feature.getProperties();
            const content = `
            <strong style="display:block; text-align:center;">${props.location}</strong>
            <b>Büyüklük:</b> ${props.magnitude}<br>
            <b>Derinlik:</b> ${props.depth} km<br>
            <b>Tarih:</b> ${props.date}<br>
            <b>Ülke:</b> ${props.country || '-'}<br>
            <b>İl:</b> ${props.province || '-'}<br>
            <b>İlçe:</b> ${props.district || '-'}<br>
            <b>ID:</b> ${props.eventID}<br>
        `;
            popupContentDOM.innerHTML = content;
            overlay.setPosition(coordinates);
            popupDOM.style.display = 'block';
            map.getView().animate({
                center: coordinates,
                zoom: 9,
                duration: 500,
            });
        } else {
            overlay.setPosition(undefined)
        }
    });
}