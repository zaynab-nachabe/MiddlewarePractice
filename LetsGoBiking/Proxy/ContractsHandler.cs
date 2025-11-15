using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace Proxy
{
    internal static class ContractsHandler
    {
        private static readonly HttpClient Http = new HttpClient();
        private static readonly ResponseCache Cache = new ResponseCache();

        internal static async Task HandleContracts(HttpListenerRequest req, HttpListenerResponse res)
        {
            var body = await Utilities.ReadBodyAsync(req).ConfigureAwait(false);
            string apiKey = Utilities.GetJsonString(body, "ApiKey") ?? Utilities.GetConfiguredApiKey();
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                res.StatusCode = (int)HttpStatusCode.BadRequest;
                Utilities.WriteString(res, "ApiKey is required either in body (ApiKey) or in proxy AppSettings 'JCDECAUX_APIKEY'.");
                return;
            }

            string cacheKey = $"contracts:{apiKey}";
            string result = Cache.GetOrAdd(cacheKey, () =>
            {
                Console.WriteLine("Cache miss: " + cacheKey);
                var url = $"https://api.jcdecaux.com/vls/v1/contracts?apiKey={WebUtility.UrlEncode(apiKey)}";
                return Http.GetStringAsync(url).GetAwaiter().GetResult();
            }, TimeSpan.FromMinutes(30));

            res.StatusCode = (int)HttpStatusCode.OK;
            res.ContentType = "application/json";
            Utilities.WriteString(res, result);
        }
    }
}