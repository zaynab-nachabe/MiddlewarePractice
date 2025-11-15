using System;

namespace Proxy
{
    public class ProxyException : Exception
    {
        public ProxyException() { }
        public ProxyException(string message) : base(message) { }
        public ProxyException(string message, Exception inner) : base(message, inner) { }
    }
}