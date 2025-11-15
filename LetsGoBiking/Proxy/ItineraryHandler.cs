using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Proxy
{
    internal static class ItineraryHandler
    {
        private static readonly HttpClient Http = new HttpClient();

        internal static async Task HandleItinerary(HttpListenerRequest req, HttpListenerResponse res)
        {
            var body = await Utilities.ReadBodyAsync(req).ConfigureAwait(false);

            // Forward to routing service REST endpoint
            var routingUrl = "http://localhost:8000/RoutingService/rest/itinerary";
            var httpContent = new StringContent(body ?? string.Empty, Encoding.UTF8, "application/json");

            try
            {
                var forwardResp = await Http.PostAsync(routingUrl, httpContent).ConfigureAwait(false);
                var respBody = await forwardResp.Content.ReadAsStringAsync().ConfigureAwait(false);
                res.StatusCode = (int)forwardResp.StatusCode;
                res.ContentType = "application/json";
                Utilities.WriteString(res, respBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error forwarding to routing server: " + ex);
                res.StatusCode = (int)HttpStatusCode.BadGateway;
                Utilities.WriteString(res, "Failed to contact routing server: " + ex.Message);
            }
        }
    }
}