using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Device.Location;

namespace REST
{
    class Program
    {
        static async Task Main(string[] args)
        {
            string apiKey = "e97c91779d126579c73fda8b4c61c1ced4c2b907";
            string contractsUrl = $"https://api.jcdecaux.com/vls/v1/contracts?apiKey={apiKey}";

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    string contractsResponse = await client.GetStringAsync(contractsUrl);
                    var contracts = JsonSerializer.Deserialize<List<Contract>>(contractsResponse, jsonOptions);

                    Console.WriteLine("JCDecaux contracts:");
                    for (int i = 0; i < contracts.Count; i++)
                    {
                        Console.WriteLine($"{i + 1}. {contracts[i].name} ({contracts[i].city})");
                    }

                    Console.Write("Choose a contract by number: ");
                    int contractIndex = int.Parse(Console.ReadLine()) - 1;
                    string chosenContract = contracts[contractIndex].name;

                    //part 2
                    string stationsUrl = $"https://api.jcdecaux.com/vls/v1/stations?contract={chosenContract}&apiKey={apiKey}";
                    string stationsResponse = await client.GetStringAsync(stationsUrl);
                    var stations = JsonSerializer.Deserialize<List<Station>>(stationsResponse, jsonOptions);

                    Console.WriteLine($"\nStations for contract '{chosenContract}':");
                    for (int i = 0; i < stations.Count; i++)
                    {
                        Console.WriteLine($"{i + 1}. {stations[i].name}");
                    }

                    Console.Write("Choose a station by number: ");
                    int stationIndex = int.Parse(Console.ReadLine()) - 1;
                    var chosenStation = stations[stationIndex];

                    //part 3
                    var chosenCoord = new GeoCoordinate(
                        chosenStation.position.lat,
                        chosenStation.position.lng
                     );
                    double minDistance = double.MaxValue;
                    Station closestStation = null;

                    foreach (var station in stations)
                    {
                        if (station.number == chosenStation.number)
                            continue;
                        var stationCoord = new GeoCoordinate(
                            station.position.lat,
                            station.position.lng
                        );
                        double distance = chosenCoord.GetDistanceTo(stationCoord);
                        if (distance < minDistance)
                        {
                            minDistance = distance;
                            closestStation = station;
                        }
                    }
                    if (closestStation != null)
                    {
                        Console.WriteLine($"\nClosest station to '{chosenStation.name}':");
                        Console.WriteLine($"Name: {closestStation.name}");
                        Console.WriteLine($"Address: {closestStation.address}");
                        Console.WriteLine($"Distance: {minDistance:F1} meters");
                        Console.WriteLine(JsonSerializer.Serialize(closestStation, jsonOptions));
                    }
                    else
                    {
                        Console.WriteLine("No other stations found.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }
            }
            Console.ReadLine();
        }

        public class Contract
        {
            public string name { get; set; }
            public string city { get; set; }
        }

        public class Position
        {
            public double lat { get; set; }
            public double lng { get; set; }
        }
        public class Station
        {
            public int number { get; set; }
            public string name { get; set; }
            public string address { get; set; }
            public int bike_stands { get; set; }
            public int available_bikes { get; set; }
            public int available_bike_stands { get; set; }
            public string status { get; set; }
            public Position position { get; set; }

        }
    }
}