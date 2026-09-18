using DigiCoupon.Application.Interfaces.Repositories;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

using System;
using System.Collections.Generic;
using System.Text;
namespace DigiCoupon.Infrastructure.Persistence.Contexts
{
    public class FileStorageContext : IFileStorage
    {
        private readonly string _contentRootPath;
        private readonly string Folder = "Uploads";
        public FileStorageContext(IHostEnvironment environment)
        {
            _contentRootPath = environment.ContentRootPath;
        }

        public async Task<string> UploadAsync(Stream stream, string fileName, string folder, CancellationToken token = default)
        {
            try
            {
                string folderPath = Path.Combine(_contentRootPath,"wwwroot", Folder, folder);
                string file = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
                string location = Path.Combine(folderPath, fileName);
                Console.WriteLine($"FolderPath : {folderPath}");
                Console.WriteLine($"Exists     : {Directory.Exists(folderPath)}");
                Console.WriteLine($"Location   : {location}");
                await using var fileStrame = new FileStream(location, FileMode.Create);
                await stream.CopyToAsync(fileStrame, token);
                return file;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

        public Task CreateDirectory(string path)
        {
            string fullPath = Path.Combine(_contentRootPath, "wwwroot", Folder, path);
            if (!Directory.Exists(fullPath))
                Directory.CreateDirectory(fullPath);

            return Task.CompletedTask;
        }

        public Task<bool> ExistsDirectory(string path)
        {
            return Task.FromResult(Directory.Exists(Path.Combine(_contentRootPath, path)));
        }

        public Task RemoveAsync(string path)
        {
            string filePath = Path.Combine(_contentRootPath, Folder, path);
            if (File.Exists(filePath))
                File.Delete(filePath);
            return Task.CompletedTask;
        }

        public Task<Stream> DownloadAsync(string path)
        {
            string filePath = Path.Combine(_contentRootPath, Folder, path);
            Stream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return Task.FromResult(stream);
        }

        public bool Exists(string path)
        {
            return File.Exists(Path.Combine(Folder, path));
        }
    }
}
