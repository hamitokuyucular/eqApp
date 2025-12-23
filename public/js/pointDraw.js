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

export function disableDrawPoint(map) {
    if (pointDraw) {
        map.removeInteraction(pointDraw);
        pointDraw = null;
    }
}