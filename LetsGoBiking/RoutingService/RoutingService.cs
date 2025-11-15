using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.ServiceModel;
using System.Configuration;


namespace RoutingService
{
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]
    public class RoutingServiceImpl : IRoutingService
    {
        public ItineraryResponse GetItinerary(ItineraryRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Origin) || string.IsNullOrWhiteSpace(request.Destination))
            {
                return new ItineraryResponse
                {
                    Success = false,
                    Message = "Invalid request: origin and destination are required."
                };
            }

            // TODO: replace with real geocoding, JCDecaux + proxy calls and routing logic.
            return new ItineraryResponse
            {
                Success = true,
                Message = "Placeholder itinerary — implement real logic.",
                Steps = new List<ItineraryStep>
                {
                    new ItineraryStep
                    {
                        Mode = "WALK",
                        Instruction = $"Walk from {request.Origin} to nearest bike station",
                        DistanceMeters = 200,
                        DurationSeconds = 180
                    },
                    new ItineraryStep
                    {
                        Mode = "BIKE",
                        Instruction = $"Ride to close to {request.Destination}",
                        DistanceMeters = 2500,
                        DurationSeconds = 600
                    }
                },
                TotalDistanceMeters = 2700,
                TotalDurationSeconds = 780
            };
        }

        // Calls JCDecaux contracts endpoint and returns the list (API key supplied in request)
        public List<Contract> GetContracts(ApiKeyRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.ApiKey))
                return new List<Contract>();

            try
            {
                using (var client = new HttpClient())
                {
                    var url = $"https://api.jcdecaux.com/vls/v1/contracts?apiKey={Uri.EscapeDataString(request.ApiKey)}";
                    var json = client.GetStringAsync(url).GetAwaiter().GetResult();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var contracts = JsonSerializer.Deserialize<List<Contract>>(json, options);
                    return contracts ?? new List<Contract>();
                }
            }
            catch (Exception)
            {
                return new List<Contract>();
            }
        }

        public List<Station> GetStations(StationsRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.ApiKey) || string.IsNullOrWhiteSpace(request.Contract))
                return new List<Station>();

            try
            {
                using (var client = new HttpClient())
                {
                    var url = $"https://api.jcdecaux.com/vls/v1/stations?contract={Uri.EscapeDataString(request.Contract)}&apiKey={Uri.EscapeDataString(request.ApiKey)}";
                    var json = client.GetStringAsync(url).GetAwaiter().GetResult();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var stations = JsonSerializer.Deserialize<List<Station>>(json, options);
                    return stations ?? new List<Station>();
                }
            }
            catch (Exception)
            {
                return new List<Station>();
            }
        }

        // Finds the closest station in the provided list to the given position (Haversine)
        public Station GetClosestStation(ClosestStationRequest request)
        {
            if (request == null || request.Position == null || request.Stations == null || request.Stations.Count == 0)
                return null;

            Station closest = null;
            double minDistance = double.MaxValue;

            foreach (var s in request.Stations)
            {
                if (s?.position == null) continue;
                var d = HaversineDistanceMeters(request.Position.lat, request.Position.lng, s.position.lat, s.position.lng);
                if (d < minDistance)
                {
                    minDistance = d;
                    closest = s;
                }
            }

            return closest;
        }

        private static string GetConfiguredApiKey()
        {
            var key = ConfigurationManager.AppSettings["JCDECAUX_APIKEY"];
            if (string.IsNullOrWhiteSpace(key))
                key = Environment.GetEnvironmentVariable("JCDECAUX_APIKEY");
            return key;
        }

        //Compute distance in meters between two lat/lng points
        private static double HaversineDistanceMeters(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371000;
            double toRad = Math.PI / 180.0;
            double dLat = (lat2 - lat1) * toRad;
            double dLon = (lon2 - lon1) * toRad;
            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(lat1 * toRad) * Math.Cos(lat2 * toRad) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }
    }
}