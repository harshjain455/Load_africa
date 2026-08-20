import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapService } from '../../services/mapProvider/MapService';
import {
  Focus,
  Maximize2,
  Minimize2,
  Navigation,
  Clock,
  MapPin,
  X,
  Compass,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// Map controller to automatically adjust view & bounds
function MapController({
  pickupCoords,
  deliveryCoords,
  centerTrigger,
  autoFit = true,
}) {
  const map = useMap();

  useEffect(() => {
    if (!autoFit) return;

    const hasPickup =
      pickupCoords?.lat !== undefined && pickupCoords?.lng !== undefined;
    const hasDelivery =
      deliveryCoords?.lat !== undefined && deliveryCoords?.lng !== undefined;

    if (hasPickup && hasDelivery) {
      try {
        const bounds = [
          [pickupCoords.lat, pickupCoords.lng],
          [deliveryCoords.lat, deliveryCoords.lng],
        ];
        const leafletBounds = MapService.getBounds(bounds);
        if (leafletBounds) {
          map.fitBounds(leafletBounds, {
            padding: [45, 45],
            maxZoom: 15,
            animate: true,
          });
        }
      } catch (err) {
        console.error('Error fitting bounds:', err);
      }
    } else if (hasPickup) {
      map.setView([pickupCoords.lat, pickupCoords.lng], 13, { animate: true });
    } else if (hasDelivery) {
      map.setView([deliveryCoords.lat, deliveryCoords.lng], 13, { animate: true });
    }
  }, [
    pickupCoords?.lat,
    pickupCoords?.lng,
    deliveryCoords?.lat,
    deliveryCoords?.lng,
    centerTrigger,
    autoFit,
    map,
  ]);

  return null;
}

// Click listener inside Leaflet context
function MapEventsHandler({ onMapClick, selectionMode }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });
  return null;
}

export default function RoutePreviewMap({
  pickupLocation,
  deliveryLocation,
  routeData,
  routeLoading = false,
  selectionMode = null, // 'pickup' | 'delivery' | null
  onMapClick = null,
  onCancelSelection = null,
  height = '280px',
  showRouteStats = true,
}) {
  const [centerTrigger, setCenterTrigger] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasPickup =
    pickupLocation?.lat !== undefined &&
    pickupLocation?.lat !== null &&
    pickupLocation?.lng !== undefined &&
    pickupLocation?.lng !== null;

  const hasDelivery =
    deliveryLocation?.lat !== undefined &&
    deliveryLocation?.lat !== null &&
    deliveryLocation?.lng !== undefined &&
    deliveryLocation?.lng !== null;

  const bothSelected = hasPickup && hasDelivery;

  // Polyline extraction
  let polylineCoords = [];
  if (routeData?.polylineCoordinates && Array.isArray(routeData.polylineCoordinates)) {
    polylineCoords = routeData.polylineCoordinates;
  } else if (routeData?.polyline) {
    try {
      polylineCoords =
        typeof routeData.polyline === 'string'
          ? JSON.parse(routeData.polyline)
          : routeData.polyline;
    } catch {
      polylineCoords = [];
    }
  }

  // Default initial center (Johannesburg / South Africa)
  let initialCenter = [-26.2041, 28.0473];
  if (hasPickup) {
    initialCenter = [pickupLocation.lat, pickupLocation.lng];
  } else if (hasDelivery) {
    initialCenter = [deliveryLocation.lat, deliveryLocation.lng];
  }

  const pickupIcon = MapService.getMarkerIcon('PICKUP');
  const deliveryIcon = MapService.getMarkerIcon('DELIVERY');

  const handleRecenter = () => {
    setCenterTrigger((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`relative rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-slate-100 transition-all ${
        selectionMode ? 'ring-2 ring-amber-500/60 ring-offset-2' : ''
      } ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] h-screen w-screen rounded-none border-0'
          : ''
      }`}
      style={{
        height: isFullscreen ? '100vh' : height,
        cursor: selectionMode ? 'crosshair' : 'grab',
      }}
    >
      <MapContainer
        center={initialCenter}
        zoom={bothSelected ? 8 : hasPickup || hasDelivery ? 12 : 5}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* View bounds Controller */}
        <MapController
          pickupCoords={pickupLocation}
          deliveryCoords={deliveryLocation}
          centerTrigger={centerTrigger}
        />

        {/* Click listener for reverse geocoding */}
        <MapEventsHandler
          onMapClick={onMapClick}
          selectionMode={selectionMode}
        />

        {/* Pickup Marker */}
        {hasPickup && pickupIcon && (
          <Marker
            position={[pickupLocation.lat, pickupLocation.lng]}
            icon={pickupIcon}
          >
            <Popup className="custom-map-popup">
              <div className="p-1 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Pickup Location</span>
                </div>
                <p className="text-slate-700 font-medium leading-tight text-[11px]">
                  {pickupLocation.formattedAddress ||
                    pickupLocation.label ||
                    pickupLocation.address}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {Number(pickupLocation.lat).toFixed(4)}, {Number(pickupLocation.lng).toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Delivery Marker */}
        {hasDelivery && deliveryIcon && (
          <Marker
            position={[deliveryLocation.lat, deliveryLocation.lng]}
            icon={deliveryIcon}
          >
            <Popup className="custom-map-popup">
              <div className="p-1 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-red-700">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Delivery Location</span>
                </div>
                <p className="text-slate-700 font-medium leading-tight text-[11px]">
                  {deliveryLocation.formattedAddress ||
                    deliveryLocation.label ||
                    deliveryLocation.address}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {Number(deliveryLocation.lat).toFixed(4)}, {Number(deliveryLocation.lng).toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {bothSelected && polylineCoords.length > 0 && (
          <>
            {/* Dark casing backdrop for high visibility */}
            <Polyline
              positions={polylineCoords}
              color="#78350f"
              weight={7}
              opacity={0.35}
            />
            {/* Primary road route */}
            <Polyline
              positions={polylineCoords}
              color="#f59e0b"
              weight={4.5}
              opacity={0.95}
            />
          </>
        )}
      </MapContainer>

      {/* Map Interactive Selection Banner */}
      {selectionMode && (
        <div className="absolute top-3 left-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-lg border border-amber-500/40 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-bold text-amber-300">
              {selectionMode === 'pickup'
                ? 'Click on the map to set Pickup Location'
                : 'Click on the map to set Delivery Location'}
            </span>
          </div>
          {onCancelSelection && (
            <button
              onClick={onCancelSelection}
              type="button"
              className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
          )}
        </div>
      )}

      {/* Empty / Incomplete State Prompt Overlay */}
      {!bothSelected && !selectionMode && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-md flex items-center gap-2.5 text-xs text-slate-600 animate-fadeIn">
          <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="font-medium text-[11px]">
            {!hasPickup && !hasDelivery
              ? 'Select pickup and delivery locations to preview your route.'
              : hasPickup && !hasDelivery
              ? 'Pickup set. Select a delivery location to calculate the route.'
              : 'Delivery set. Select a pickup location to calculate the route.'}
          </span>
        </div>
      )}

      {/* Map Control Buttons */}
      <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={handleRecenter}
          type="button"
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl shadow-md transition-all active:scale-95"
          title="Recenter and Fit Bounds"
        >
          <Focus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={toggleFullscreen}
          type="button"
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl shadow-md transition-all active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Route Stats floating badge when both locations exist */}
      {bothSelected && showRouteStats && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-3 text-xs animate-fadeIn">
          {routeLoading ? (
            <div className="flex items-center gap-2 text-slate-500 font-semibold text-[11px]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
              <span>Calculating route...</span>
            </div>
          ) : routeData ? (
            <>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                <Navigation className="h-3.5 w-3.5 text-amber-500" />
                <span>{routeData.distanceText || `${routeData.distanceKm} km`}</span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>~{routeData.durationText || `${routeData.durationMins} min`}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-700 font-medium text-[11px]">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <span>Route road path connected</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
