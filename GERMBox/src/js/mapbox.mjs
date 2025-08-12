// Assumes mapbox-gl is installed via npm or CDN; import works in module context.
import mapboxgl from 'mapbox-gl';
import { getInstitutionLocations } from './api.mjs';

export async function renderInstitutionsMap(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('Map container not found');
    return;
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoiZGdlZW1lZGlhIiwiYSI6ImNtZThlajFjdDA4eTEyaXF4bHMyZTJ0OXEifQ.pGO3BBBmYdOVjf-eFtbPug';

  const locations = await getInstitutionLocations();

  const map = new mapboxgl.Map({
    container: containerId,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [7.4951, 9.0579], // Abuja center
    zoom: 5
  });

  map.on('load', () => {
    locations.forEach(loc => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(loc.name);
      new mapboxgl.Marker()
        .setLngLat([loc.lng, loc.lat])
        .setPopup(popup)
        .addTo(map);
    });
  });
}