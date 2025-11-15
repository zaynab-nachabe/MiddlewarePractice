using System.Runtime.Serialization;

namespace Proxy
{
    // Minimal DTOs matching JCDecaux station JSON (fields used by the proxy/routing server)
    public class PositionDto
    {
        public double lat { get; set; }
        public double lng { get; set; }
    }

    public class StationDto
    {
        public int number { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public int bike_stands { get; set; }
        public int available_bikes { get; set; }
        public int available_bike_stands { get; set; }
        public string status { get; set; }
        public PositionDto position { get; set; }
    }
}