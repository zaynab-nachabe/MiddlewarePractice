using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Proxy
{
    internal static class SoapHandler
    {
        private static readonly HttpClient Http = new HttpClient();

        internal static async Task HandleSoapForward(HttpListenerRequest req, HttpListenerResponse res)
        {
            var body = await Utilities.ReadBodyAsync(req).ConfigureAwait(false);
            var routingSoapUrl = "http://localhost:8000/RoutingService";
            var httpReq = new HttpRequestMessage(HttpMethod.Post, routingSoapUrl)
            {
                Content = new StringContent(body ?? string.Empty, Encoding.UTF8, req.ContentType ?? "text/xml")
            };

            var soapAction = req.Headers["SOAPAction"];
            if (!string.IsNullOrEmpty(soapAction))
                httpReq.Headers.TryAddWithoutValidation("SOAPAction", soapAction);

            try
            {
                var forwardResp = await Http.SendAsync(httpReq).ConfigureAwait(false);
                var respBody = await forwardResp.Content.ReadAsStringAsync().ConfigureAwait(false);
                res.StatusCode = (int)forwardResp.StatusCode;
                res.ContentType = forwardResp.Content.Headers.ContentType?.ToString() ?? "text/xml";
                Utilities.WriteString(res, respBody);
            }
            catch (Exception ex)
            {
                Console.WriteLine("SOAP forward error: " + ex);
                res.StatusCode = (int)HttpStatusCode.BadGateway;
                Utilities.WriteString(res, "Failed to forward SOAP request: " + ex.Message);
            }
        }
    }
}