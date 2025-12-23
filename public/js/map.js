export let map;

export let baseGroup;
export let dataGroup;
export let analysisGroup;
export let source;


export let baseLayer;
export let cityLayer;
export let fayLayer;
export let vs30Layer;
export let pga2023Layer;
export let dangerZoneLayer;
export let eqPointLayer;
export let heatmapLayer;

import { eqPointStyle } from "./eqPointStyle.js";

export async function initMap() {

    baseGroup = new ol.layer.Group({
        title: "Altlık Haritalar",
        layers: []
    });

    dataGroup = new ol.layer.Group({
        title: "Veri Katmanları",
        layers: []
    });

    analysisGroup = new ol.layer.Group({
        title: "Analiz Katmanları",
        layers: []
    });

    baseLayer = new ol.layer.Tile({
        title: 'Altlık Harita',
        type: 'base',
        visible: true,
        source: new ol.source.XYZ({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles © Esri, HERE, Garmin, OpenStreetMap'
        })
    });

    eqPointLayer = new ol.layer.Vector({
        title: 'Deprem Merkez Noktaları',
        visible: true,
        source: new ol.source.Vector(),
        style: eqPointStyle,
    });

    heatmapLayer = new ol.layer.Heatmap({
        title: 'Deprem Isı Haritası',
        visible: false,
        source: new ol.source.Vector(),
        blur: 15,
        radius: 15,
        weight: f => {
            const mag = f.get('magnitude');
            return mag / 10;
        }
    });

    cityLayer = new ol.layer.Image({
        title: 'İl Sınırları',
        visible: true,
        source: new ol.source.ImageWMS({
            url: "http://localhost:5000/api/il",
            params: {
                layers: 'mygisdb:il',
                format: 'image/png',
                transparent: true,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        }),
    });

    fayLayer = new ol.layer.Image({
        title: 'Diri Faylar',
        visible: true,
        source: new ol.source.ImageWMS({
            url: "http://localhost:5000/api/diri-fay",
            params: {
                layers: 'mygisdb:diri_faylar',
                format: 'image/png',
                transparent: true,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        })
    });

    vs30Layer = new ol.layer.Image({
        title: 'VS30',
        visible: false,
        opacity: 0.5,
        source: new ol.source.ImageWMS({
            url: "http://localhost:5000/api/vs30",
            params: {
                layers: 'mygisdb:tc_vs30',
                format: 'image/png',
                transparent: true,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        })
    });

    pga2023Layer = new ol.layer.Image({
        title: 'Sismik Tehlike PGA(g)475 v2023.1',
        visible: false,
        opacity: 0.5,
        source: new ol.source.ImageWMS({
            url: "http://localhost:5000/api/pga2023",
            params: {
                layers: 'mygisdb:pga_final_2',
                format: 'image/png',
                transparent: true,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        })
    });

    dangerZoneLayer = new ol.layer.Image({
        title: 'Tehlike (PGA × VS30 × Fay Yakınlık)',
        visible: false,
        opacity: 0.5,
        source: new ol.source.ImageWMS({
            url: "http://localhost:5000/api/danger",
            params: {
                layers: 'mygisdb:tehlike_final3',
                format: 'image/png',
                transparent: true,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
        })
    });

    baseGroup.getLayers().push(baseLayer);
    dataGroup.getLayers().push(cityLayer);
    dataGroup.getLayers().push(fayLayer);
    dataGroup.getLayers().push(vs30Layer);
    dataGroup.getLayers().push(pga2023Layer);
    dataGroup.getLayers().push(dangerZoneLayer);
    dataGroup.getLayers().push(eqPointLayer);
    dataGroup.getLayers().push(heatmapLayer);

    map = new ol.Map({
        target: 'map',
        layers: [
            baseGroup,
            dataGroup,
            analysisGroup
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([32.7, 38.4]),
            zoom: 6.2,
            constrainResolution: false
        })
    });

    const layerSwitcher = new ol.control.LayerSwitcher({
        reverse: false,
    });
    layerSwitcher.setTarget(document.getElementById('layerSwitcherContainer'));
    map.addControl(layerSwitcher);

    baseGroup.setZIndex(0);
    dataGroup.setZIndex(5);
    analysisGroup.setZIndex(10);

    eqPointLayer.setZIndex(11);
    heatmapLayer.setZIndex(9);
    vs30Layer.setZIndex(1);
    pga2023Layer.setZIndex(2);
    dangerZoneLayer.setZIndex(3);
}

export function updateMap(geojson) {
    const features = new ol.format.GeoJSON().readFeatures(geojson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
    });

    if (!source) {
        source = new ol.source.Vector({
            features: features
        });
        eqPointLayer.setSource(source);
        heatmapLayer.setSource(source);

    } else {
        source.clear();
        source.addFeatures(features);
    }

    map.getView().fit(source.getExtent(), { padding: [50, 50, 50, 50] });
}


