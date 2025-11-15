using System.Collections.Generic;
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

        // JCDecaux contracts listing
        [OperationContract]
        [WebInvoke(Method = "POST",
                   UriTemplate = "/contracts",
                   RequestFormat = WebMessageFormat.Json,
                   ResponseFormat = WebMessageFormat.Json,
                   BodyStyle = WebMessageBodyStyle.Bare)]
        List<Contract> GetContracts(ApiKeyRequest request);

        // Stations for a contract
        [OperationContract]
        [WebInvoke(Method = "POST",
                   UriTemplate = "/stations",
                   RequestFormat = WebMessageFormat.Json,
                   ResponseFormat = WebMessageFormat.Json,
                   BodyStyle = WebMessageBodyStyle.Bare)]
        List<Station> GetStations(StationsRequest request);

        // Find the closest station to a given position from a provided station list
        [OperationContract]
        [WebInvoke(Method = "POST",
                   UriTemplate = "/closest",
                   RequestFormat = WebMessageFormat.Json,
                   ResponseFormat = WebMessageFormat.Json,
                   BodyStyle = WebMessageBodyStyle.Bare)]
        Station GetClosestStation(ClosestStationRequest request);
    }
}