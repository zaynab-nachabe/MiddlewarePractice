using System;
using System.ServiceModel;

namespace Proxy
{
    // Requires a project reference to the RoutingService project (so RoutingService.IRoutingService and DTOs are available).
    internal static class WcfClient
    {
        internal static RoutingService.ItineraryResponse CallRoutingViaWcf(RoutingService.ItineraryRequest req)
        {
            var binding = new BasicHttpBinding();
            var endpoint = new EndpointAddress("http://localhost:8000/RoutingService");
            var factory = new ChannelFactory<RoutingService.IRoutingService>(binding, endpoint);
            var client = factory.CreateChannel();
            try
            {
                var resp = client.GetItinerary(req);
                ((IClientChannel)client).Close();
                factory.Close();
                return resp;
            }
            catch
            {
                try { ((IClientChannel)client).Abort(); } catch { }
                try { factory.Abort(); } catch { }
                throw;
            }
        }
    }
}