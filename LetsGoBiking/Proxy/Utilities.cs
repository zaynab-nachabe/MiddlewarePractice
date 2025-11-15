using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Proxy
{
    internal static class Utilities
    {
        internal static async Task<string> ReadBodyAsync(HttpListenerRequest req)
        {
            using (var sr = new StreamReader(req.InputStream, req.ContentEncoding ?? Encoding.UTF8))
            {
                return await sr.ReadToEndAsync().ConfigureAwait(false);
            }
        }

        internal static void WriteString(HttpListenerResponse res, string text)
        {
            if (text == null) text = string.Empty;
            byte[] buf = Encoding.UTF8.GetBytes(text);
            res.ContentEncoding = Encoding.UTF8;
            res.ContentLength64 = buf.Length;
            res.OutputStream.Write(buf, 0, buf.Length);
        }

        internal static string GetJsonString(string json, string propName)
        {
            if (string.IsNullOrWhiteSpace(json)) return null;
            try
            {
                using (var doc = JsonDocument.Parse(json))
                {
                    if (doc.RootElement.TryGetProperty(propName, out var prop))
                    {
                        if (prop.ValueKind == JsonValueKind.String)
                            return prop.GetString();
                        else
                            return prop.ToString();
                    }
                }
            }
            catch { /* ignore parse errors */ }
            return null;
        }

        internal static string GetConfiguredApiKey()
        {
            var key = ConfigurationManager.AppSettings["JCDECAUX_APIKEY"];
            if (string.IsNullOrWhiteSpace(key))
                key = Environment.GetEnvironmentVariable("JCDECAUX_APIKEY");
            return key;
        }
    }
}