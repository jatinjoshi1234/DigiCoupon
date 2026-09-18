using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.Interfaces.Repositories
{
    public interface IFileStorage
    {
        public Task<string> UploadAsync(Stream stream, string fileName, string folder, CancellationToken token = default);
        public Task RemoveAsync(string path);
        public Task<Stream> DownloadAsync(string path);
        public bool Exists(string path);
        public Task CreateDirectory(string path);
        public Task<bool> ExistsDirectory(string path);
    }
}
