csharp RoutingService\IRoutingService.cs
using System.ServiceModel;
using System.ServiceModel.Web;

namespace RoutingService
{
    [ServiceContract]
    public interface IRoutingService
    {
        // SOAP clients use OperationContract.
        // REST clients (JSON) call POST http://host/RoutingService/rest/itinerary
        [OperationContract]
        [WebInvoke(Method = "POST",
                   UriTemplate = "/itinerary",
                   RequestFormat = WebMessageFormat.Json,
                   ResponseFormat = WebMessageFormat.Json,
                   BodyStyle = WebMessageBodyStyle.Bare)]
        ItineraryResponse GetItinerary(ItineraryRequest request);
    }
}