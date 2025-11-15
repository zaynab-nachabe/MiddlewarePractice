using System.Collections.Generic;
using System.Runtime.Serialization;

namespace RoutingService
{
    [DataContract]
    public class ItineraryRequest
    {
        [DataMember] public string Origin { get; set; }
        [DataMember] public string Destination { get; set; }
        [DataMember] public System.DateTime? DepartureDate { get; set; }
    }

    [DataContract]
    public class ItineraryResponse
    {
        [DataMember] public bool Success { get; set; }
        [DataMember] public string Message { get; set; }
        [DataMember] public List<ItineraryStep> Steps { get; set; }
        [DataMember] public double TotalDistanceMeters { get; set; }
        [DataMember] public double TotalDurationSeconds { get; set; }
    }

    [DataContract]
    public class ItineraryStep
    {
        [DataMember] public string Mode { get; set; } // "WALK", "BIKE"
        [DataMember] public string Instruction { get; set; }
        [DataMember] public double DistanceMeters { get; set; }
        [DataMember] public double DurationSeconds { get; set; }
        [DataMember] public GeoCoordinate Start { get; set; }
        [DataMember] public GeoCoordinate End { get; set; }
    }

    [DataContract]
    public class GeoCoordinate
    {
        [DataMember] public double Latitude { get; set; }
        [DataMember] public double Longitude { get; set; }
    }

    //
    // JCDecaux related models (from LetsGoBiking\Program.cs) - now as DataContract types
    //
    [DataContract]
    public class Contract
    {
        [DataMember] public string name { get; set; }
        [DataMember] public string city { get; set; }
    }

    [DataContract]
    public class Position
    {
        [DataMember] public double lat { get; set; }
        [DataMember] public double lng { get; set; }
    }

    [DataContract]
    public class Station
    {
        [DataMember] public int number { get; set; }
        [DataMember] public string name { get; set; }
        [DataMember] public string address { get; set; }
        [DataMember] public int bike_stands { get; set; }
        [DataMember] public int available_bikes { get; set; }
        [DataMember] public int available_bike_stands { get; set; }
        [DataMember] public string status { get; set; }
        [DataMember] public Position position { get; set; }
    }

    //
    // Request wrapper types for the new endpoints
    //
    [DataContract]
    public class ApiKeyRequest
    {
        [DataMember] public string ApiKey { get; set; }
    }

    [DataContract]
    public class StationsRequest
    {
        [DataMember] public string Contract { get; set; }
        [DataMember] public string ApiKey { get; set; }
    }

    [DataContract]
    public class ClosestStationRequest
    {
        [DataMember] public Position Position { get; set; }
        [DataMember] public List<Station> Stations { get; set; }
    }
}