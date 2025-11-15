using System;
using System.Runtime.Caching;

namespace Proxy
{
    internal class ResponseCache
    {
        private readonly MemoryCache _cache = MemoryCache.Default;

        public string GetOrAdd(string key, Func<string> valueFactory, TimeSpan ttl)
        {
            if (key == null) throw new ArgumentNullException(nameof(key));
            if (valueFactory == null) throw new ArgumentNullException(nameof(valueFactory));

            var existing = _cache.Get(key) as string;
            if (existing != null) return existing;

            string value = valueFactory();
            if (value == null) value = string.Empty;
            var policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.UtcNow.Add(ttl) };
            _cache.Set(key, value, policy);
            return value;
        }
    }
}