using System;

namespace Proxy
{
    internal class Program
    {
        static void Main(string[] args)
        {
            const string prefix = "http://localhost:8081/proxy/";
            var server = new HttpServer(prefix);

            Console.WriteLine("Starting proxy at " + prefix);
            try
            {
                server.StartBlocking();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to start server: " + ex);
            }
        }
    }
}