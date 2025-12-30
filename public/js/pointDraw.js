import { map } from "./map.js";

let pointDraw = null;
let pointSource = null;
let pointLayer = null;

let pendingFeature = null;

const modal = document.getElementById('pointNameModal');
const input = document.getElementById('pointNameInput');
const confirmBtn = document.getElementById('confirmPointName');
const cancelBtn = document.getElementById('cancelPointName');

function openPointNameModal() {
    input.value = '';
    modal.classList.remove('hidden');
    input.focus();
}

function closePointNameModal() {
    modal.classList.add('hidden');
    pendingFeature = null;
}

confirmBtn.addEventListener('click', () => {
    if (!pendingFeature) return;

    const value = input.value.trim();
    if (!value) {
        alert('Nokta ismi boş olamaz!');
        return;
    }

    pendingFeature.set('name', value);

    const geom = pendingFeature.getGeometry();
    const coord = geom.getCoordinates(); // CRS (3857)

    const [lon, lat] = ol.proj.transform(
        coord,
        map.getView().getProjection(),
        'EPSG:4326'
    );

    pendingFeature.setProperties({
        lat,
        lon
    });
    
    closePointNameModal();
});

cancelBtn.addEventListener('click', () => {
    if (pendingFeature && pointSource) {
        pointSource.removeFeature(pendingFeature);
    }
    closePointNameModal();
});

export function enableDrawPoint(map) {

    if (!pointSource) {
        pointSource = new ol.source.Vector();
        pointLayer = new ol.layer.Vector({
            source: pointSource
        });
        map.addLayer(pointLayer);
    }

    pointDraw = new ol.interaction.Draw({
        source: pointSource,
        type: 'Point'
    });

    pointDraw.on('drawend', function (event) {
        pendingFeature = event.feature;
        openPointNameModal();
    });

    map.addInteraction(pointDraw);
}

export function getDrawnPoints() {
    if (!pointSource) return [];

    return pointSource.getFeatures().map(f => ({
        name: f.get('name'),
        lat: f.get('lat'),
        lon: f.get('lon')
    }));
}

export function disableDrawPoint(map) {
    if (pointDraw) {
        map.removeInteraction(pointDraw);
        pointDraw = null;
    }
}