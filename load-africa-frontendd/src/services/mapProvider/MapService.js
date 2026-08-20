import L from 'leaflet';
import { MapProviderConfig, MAP_PROVIDERS } from './MapProviderConfig';

export const MapService = {
  /**
   * Returns a standard marker icon configuration for the active map provider
   * @param {'TRUCK' | 'PICKUP' | 'DELIVERY' | 'SELECT'} type 
   * @param {number} heading - vehicle rotation in degrees
   * @returns {any} icon data suitable for active provider (Leaflet icon object or Google maps icon object)
   */
  getMarkerIcon: (type, heading = 0) => {
    const isGoogle = MapProviderConfig.provider === MAP_PROVIDERS.GOOGLE_MAPS;

    if (isGoogle) {
      let iconUrl = '';
      if (type === 'TRUCK') iconUrl = 'https://cdn-icons-png.flaticon.com/512/3208/3208753.png';
      else if (type === 'PICKUP') iconUrl = 'https://cdn-icons-png.flaticon.com/512/1673/1673188.png';
      else iconUrl = 'https://cdn-icons-png.flaticon.com/512/1673/1673221.png';

      return {
        url: iconUrl,
        size: { width: 36, height: 36 },
        scaledSize: { width: 36, height: 36 },
        anchor: { x: 18, y: 18 },
        rotation: heading
      };
    }

    if (type === 'TRUCK') {
      const truckSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" stroke="#78350f" stroke-width="1.5" style="transform: rotate(${heading}deg); transition: transform 0.3s ease-out; width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          <path d="M19 16h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1m15 0a2.5 2.5 0 1 1-5 0m5 0a2.5 2.5 0 1 0-5 0M9 16H5v-2h4v2zm0 0a2.5 2.5 0 1 1-5 0m5 0a2.5 2.5 0 1 0-5 0M2 10V5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v5M6 10h8V7H6v3z"/>
        </svg>
      `;
      return L.divIcon({
        html: `<div class="truck-icon-container" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">${truckSvg}</div>`,
        className: 'custom-truck-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    }

    if (type === 'PICKUP') {
      const pickupSvg = `
        <div style="position: relative; width: 34px; height: 42px; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35)); cursor: pointer;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff;">
            <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4" fill="#ffffff"/>
              </svg>
            </div>
          </div>
          <div style="width: 8px; height: 4px; background: rgba(0,0,0,0.25); border-radius: 50%; margin-top: 4px;"></div>
        </div>
      `;
      return L.divIcon({
        html: pickupSvg,
        className: 'custom-pickup-pin',
        iconSize: [34, 42],
        iconAnchor: [17, 38],
        popupAnchor: [0, -36]
      });
    }

    if (type === 'DELIVERY') {
      const deliverySvg = `
        <div style="position: relative; width: 34px; height: 42px; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35)); cursor: pointer;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff;">
            <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
            </div>
          </div>
          <div style="width: 8px; height: 4px; background: rgba(0,0,0,0.25); border-radius: 50%; margin-top: 4px;"></div>
        </div>
      `;
      return L.divIcon({
        html: deliverySvg,
        className: 'custom-delivery-pin',
        iconSize: [34, 42],
        iconAnchor: [17, 38],
        popupAnchor: [0, -36]
      });
    }

    // Default or selection marker
    return L.divIcon({
      html: `
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #f59e0b; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>
      `,
      className: 'custom-generic-pin',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  },

  /**
   * Helper to compute maps center and zoom level fits for coordinates list
   */
  getBounds: (coordinates) => {
    if (!coordinates || coordinates.length === 0) return null;
    return L.latLngBounds(coordinates);
  }
};
