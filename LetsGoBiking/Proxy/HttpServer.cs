using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Proxy
{
    public class HttpServer
    {
        private readonly string _prefix;
        private readonly HttpListener _listener;
        private readonly CancellationTokenSource _cts = new CancellationTokenSource();

        public HttpServer(string prefix)
        {
            _prefix = prefix ?? throw new ArgumentNullException(nameof(prefix));
            _listener = new HttpListener();
            _listener.Prefixes.Add(_prefix);
        }

        public void StartBlocking()
        {
            try
            {
                _listener.Start();
            }
            catch (HttpListenerException hlex)
            {
                Console.WriteLine("Failed to start HttpListener: " + hlex.Message);
                Console.WriteLine("If you see an AddressAccessDeniedException, run an elevated command prompt and reserve the URL:");
                Console.WriteLine($"  netsh http add urlacl url={_prefix} user=\"%USERDOMAIN%\\%USERNAME%\"");
                return;
            }

            Console.WriteLine("Proxy listening. Ctrl+C to stop.");

            Console.CancelKeyPress += (s, e) =>
            {
                e.Cancel = true;
                _cts.Cancel();
            };

            Task listenTask = ListenLoopAsync(_cts.Token);
            listenTask.Wait();
            _listener.Stop();
        }

        private async Task ListenLoopAsync(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                HttpListenerContext ctx = null;
                try
                {
                    ctx = await _listener.GetContextAsync().ConfigureAwait(false);
                }
                catch (HttpListenerException) { break; }
                catch (OperationCanceledException) { break; }

                _ = Task.Run(() => ProcessRequestAsync(ctx), token);
            }
        }

        private async Task ProcessRequestAsync(HttpListenerContext ctx)
        {
            var req = ctx.Request;
            var res = ctx.Response;
            try
            {
                Console.WriteLine($"{DateTime.Now:O} {req.HttpMethod} {req.RawUrl}");

                if (!string.Equals(req.HttpMethod, "POST", StringComparison.OrdinalIgnoreCase))
                {
                    res.StatusCode = (int)HttpStatusCode.MethodNotAllowed;
                    Utilities.WriteString(res, "Only POST is supported");
                    return;
                }

                var contentType = req.ContentType ?? string.Empty;
                if (contentType.Contains("xml", StringComparison.OrdinalIgnoreCase) ||
                    !string.IsNullOrEmpty(req.Headers["SOAPAction"]))
                {
                    await SoapHandler.HandleSoapForward(req, res).ConfigureAwait(false);
                    return;
                }

                string path = req.Url.AbsolutePath.TrimEnd('/');
                if (path.EndsWith("/proxy/contracts", StringComparison.OrdinalIgnoreCase))
                {
                    await ContractsHandler.HandleContracts(req, res).ConfigureAwait(false);
                }
                else if (path.EndsWith("/proxy/stations", StringComparison.OrdinalIgnoreCase))
                {
                    await StationsHandler.HandleStations(req, res).ConfigureAwait(false);
                }
                else if (path.EndsWith("/proxy/itinerary", StringComparison.OrdinalIgnoreCase))
                {
                    await ItineraryHandler.HandleItinerary(req, res).ConfigureAwait(false);
                }
                else
                {
                    res.StatusCode = (int)HttpStatusCode.NotFound;
                    Utilities.WriteString(res, "Unknown proxy endpoint");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error processing request: " + ex);
                res.StatusCode = (int)HttpStatusCode.InternalServerError;
                Utilities.WriteString(res, ex.Message);
            }
            finally
            {
                res.OutputStream.Close();
            }
        }
    }
}