export function eqPointStyle(feature) {
    const mag = feature.get('magnitude');

    const color = mag >= 8 ? '#7B1FA2' :
        mag >= 7 ? 'rgba(211, 47, 47, 1)' :
            mag >= 6 ? 'rgba(255, 87, 36, 1)' :
                mag >= 5 ? 'rgba(255, 152, 0, 1)' :
                    mag >= 4 ? 'rgba(255, 235, 59, 1)' :
                        mag >= 3 ? 'rgba(139, 195, 74, 1)' :
                                        'rgba(76, 175, 80, 1)';
                                        'rgba(255, 250, 100, 1)';

    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: mag * 2,
            fill: new ol.style.Fill({ color }),
            stroke: new ol.style.Stroke({ color: '#333', width: 1 }),
        }),
    });
}