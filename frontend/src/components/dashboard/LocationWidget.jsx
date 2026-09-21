import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Compass, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw,
  Navigation
} from "lucide-react";

export function LocationWidget() {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [coords, setCoords] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastChecked, setLastChecked] = useState(null);

  const handleGetLocation = () => {
    // Check if Geolocation is supported
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Geolocation is not supported by this browser.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
          accuracy: Math.round(position.coords.accuracy),
        });
        setLastChecked(new Date().toLocaleTimeString());
        setStatus("success");
      },
      (error) => {
        setStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage(
              "Location permission was denied. Please allow location access in your browser settings if you want to use this feature."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("Your location is currently unavailable.");
            break;
          case error.TIMEOUT:
            setErrorMessage("Location request timed out. Please try again.");
            break;
          default:
            setErrorMessage("An unexpected error occurred while retrieving location.");
            break;
        }
      },
      options
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Compass className="h-4 w-4 text-blue-600" />
            Campus & Browser Location
          </CardTitle>
          <CardDescription>
            Practical 4: Browser Geolocation API verification
          </CardDescription>
        </div>
        <Badge variant={status === "success" ? "success" : "secondary"} className="text-[10px]">
          {status === "success" ? "Located" : "Browser API"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Display */}
        {status === "idle" && (
          <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-800">Current Browser Location</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Location has not been requested. Click below to verify device GPS / network position.
              </p>
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 text-center space-y-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs font-medium text-blue-900">Getting your location from browser...</p>
            <p className="text-[10px] text-blue-600">Please respond to the browser permission prompt if shown.</p>
          </div>
        )}

        {status === "success" && coords && (
          <div className="space-y-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Location Acquired Successfully</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-100">
                <div className="p-2 bg-white rounded border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Latitude</span>
                  <span className="font-mono font-bold text-slate-900">{coords.latitude}°</span>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block">Longitude</span>
                  <span className="font-mono font-bold text-slate-900">{coords.longitude}°</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>Accuracy: ±{coords.accuracy} meters</span>
                <span>Verified: {lastChecked}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              * Note: Coordinates represent your current browser device location and are processed strictly client-side.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3.5 text-xs text-rose-800 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-rose-900">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>Location Request Failed</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-700">{errorMessage}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-1">
          <Button
            size="sm"
            onClick={handleGetLocation}
            disabled={status === "loading"}
            className="w-full text-xs gap-1.5"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Acquiring GPS...
              </>
            ) : status === "success" ? (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                Update Location
              </>
            ) : (
              <>
                <Navigation className="h-3.5 w-3.5" />
                Get My Location
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
