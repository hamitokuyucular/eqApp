import { analysisGroup, eqPointLayer } from "./map.js";
import { popupFunction } from "./popup.js";
import { eqPointStyle } from "./eqPointStyle.js";

export let withinResultLayer = {};

export async function showWithinResultLayer(map, data, cityName) {

    if (eqPointLayer) eqPointLayer.setVisible(false)

    let layer = withinResultLayer[cityName]

    if (!layer) {
        
        layer = new ol.layer.Vector({
            title: `${cityName} İçindeki Depremler`,
            source: new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(data, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            }),
            style: eqPointStyle,
            visible: true,
            properties: {
                legendType: 'eq'
            }
        });
        
        withinResultLayer[cityName] = layer;
        analysisGroup.getLayers().push(layer);
    } else {
        layer.setVisible(true)
    }

    await popupFunction(map, layer)
}