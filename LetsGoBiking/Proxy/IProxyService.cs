using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Proxy
{
    public interface IProxyService
    {
        /// <summary>
        /// Get the full station list for a contract (JCDecaux /stations endpoint).
        /// If apiKey is null the implementation should read config / env.
        /// </summary>
        Task<IList<StationDto>> GetStationsAsync(string contract, string apiKey = null, CancellationToken ct = default);

        /// <summary>
        /// Get availability/details for a single station (by station number) within a contract.
        /// Returns null when station not found.
        /// </summary>
        Task<StationDto> GetStationAvailabilityAsync(string contract, int stationNumber, string apiKey = null, CancellationToken ct = default);
    }
}