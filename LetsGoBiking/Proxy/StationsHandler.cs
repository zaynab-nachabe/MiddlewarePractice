using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace Proxy
{
    internal static class StationsHandler
    {
        private static readonly ResponseCache Cache = new ResponseCache();
        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        internal static async Task HandleStations(HttpListenerRequest req, HttpListenerResponse res)
        {   
            var body = await Utilities.ReadBodyAsync(req).ConfigureAwait(false);
            string apiKey = Utilities.GetJsonString(body, "ApiKey") ?? Utilities.GetConfiguredApiKey();
            string contract = Utilities.GetJsonString(body, "Contract");
            if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(contract))
            {
                res.StatusCode = (int)HttpStatusCode.BadRequest;
                Utilities.WriteString(res, "Contract and ApiKey are required in the JSON body.");
                return;
            }

            string cacheKey = $"stations:{contract.ToLowerInvariant()}:{apiKey}";

            try
            {
                // Use ProxyService to fetch and deserialize, then cache the serialized JSON
                string result = Cache.GetOrAdd(cacheKey, () =>
                {
                    Console.WriteLine("Cache miss: " + cacheKey);
                    var svc = new ProxyService();
                    var stations = svc.GetStationsAsync(contract, apiKey).GetAwaiter().GetResult();
                    return JsonSerializer.Serialize(stations, JsonOptions);
                }, TimeSpan.FromSeconds(30)); // TTL 30s for station status

                res.StatusCode = (int)HttpStatusCode.OK;
                res.ContentType = "application/json";
                Utilities.WriteString(res, result);
            }
            catch (ProxyException pex)
            {
                // Upstream JCDecaux or proxy error
                Console.WriteLine("Proxy error fetching stations: " + pex.Message);
                res.StatusCode = (int)HttpStatusCode.BadGateway;
                Utilities.WriteString(res, pex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Unexpected error in StationsHandler: " + ex);
                res.StatusCode = (int)HttpStatusCode.InternalServerError;
                Utilities.WriteString(res, "Internal server error");
            }
        }
    }
}