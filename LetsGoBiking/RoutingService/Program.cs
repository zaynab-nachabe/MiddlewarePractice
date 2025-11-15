using System;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.ServiceModel.Web;

namespace RoutingService
{
    class Program
    {
        static void Main(string[] args)
        {
            var baseAddress = new Uri("http://localhost:8000/RoutingService");

            using (var host = new ServiceHost(typeof(RoutingServiceImpl), baseAddress))
            {
                // SOAP endpoint (BasicHttpBinding)
                host.AddServiceEndpoint(typeof(IRoutingService), new BasicHttpBinding(), "");

                // REST endpoint (WebHttpBinding) at /rest
                var restEndpoint = host.AddServiceEndpoint(typeof(IRoutingService), new WebHttpBinding(), "rest");
                restEndpoint.EndpointBehaviors.Add(new WebHttpBehavior());

                // MEX for SOAP clients
                var smb = new ServiceMetadataBehavior { HttpGetEnabled = true };
                host.Description.Behaviors.Add(smb);
                host.AddServiceEndpoint(ServiceMetadataBehavior.MexContractName,
                    MetadataExchangeBindings.CreateMexHttpBinding(), "mex");

                try
                {
                    host.Open();
                    Console.WriteLine("RoutingService running at {0}", baseAddress);
                    Console.WriteLine("SOAP endpoint: {0}", baseAddress);
                    Console.WriteLine("REST endpoint (POST JSON): {0}/rest/itinerary", baseAddress);
                    Console.WriteLine("MEX at {0}/mex", baseAddress);
                    Console.WriteLine("Press Enter to stop.");
                    Console.ReadLine();
                    host.Close();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Failed to open host: " + ex);
                    host.Abort();
                }
            }
        }
    }
}