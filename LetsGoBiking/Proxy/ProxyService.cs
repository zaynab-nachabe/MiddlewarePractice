using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Proxy
{
    public class ProxyService : IProxyService, IDisposable
    {
        private static readonly HttpClient _http = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(10) // reasonable default timeout
        };

        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        public void Dispose()
        {
            // HttpClient is static/long-lived; don't dispose here in case other instances use it.
        }

        public async Task<IList<StationDto>> GetStationsAsync(string contract, string apiKey = null, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(contract))
                throw new ArgumentException("contract is required", nameof(contract));

            apiKey = apiKey ?? Utilities.GetConfiguredApiKey();
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new ProxyException("JCDECAUX API key is missing (pass apiKey or configure JCDECAUX_APIKEY).");

            string url = $"https://api.jcdecaux.com/vls/v1/stations?contract={WebUtility.UrlEncode(contract)}&apiKey={WebUtility.UrlEncode(apiKey)}";

            try
            {
                using (var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(ct))
                {
                    // Respect caller cancellation; _http.Timeout will still apply.
                    var resp = await _http.GetAsync(url, linkedCts.Token).ConfigureAwait(false);

                    if (!resp.IsSuccessStatusCode)
                        throw new ProxyException($"JCDecaux returned {(int)resp.StatusCode} {resp.ReasonPhrase}");

                    var json = await resp.Content.ReadAsStringAsync().ConfigureAwait(false);
                    var stations = JsonSerializer.Deserialize<List<StationDto>>(json, _jsonOptions);
                    return stations ?? new List<StationDto>(0);
                }
            }
            catch (TaskCanceledException ex) when (!ct.IsCancellationRequested)
            {
                // HttpClient timeout
                throw new ProxyException("Request to JCDecaux timed out.", ex);
            }
            catch (JsonException ex)
            {
                throw new ProxyException("Failed to parse JSON from JCDecaux.", ex);
            }
            catch (HttpRequestException ex)
            {
                throw new ProxyException("HTTP error while calling JCDecaux.", ex);
            }
        }

        public async Task<StationDto> GetStationAvailabilityAsync(string contract, int stationNumber, string apiKey = null, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(contract))
                throw new ArgumentException("contract is required", nameof(contract));

            // Fetch station list and pick station by number
            var stations = await GetStationsAsync(contract, apiKey, ct).ConfigureAwait(false);
            if (stations == null || stations.Count == 0)
                return null;

            foreach (var s in stations)
            {
                if (s != null && s.number == stationNumber)
                    return s;
            }

            return null; // not found
        }
    }
}