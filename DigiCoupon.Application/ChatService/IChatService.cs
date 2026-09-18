using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Application.ChatService
{
    public interface IChatService
    {
        Task<string> ChatAsync(
               string message,
               CancellationToken cancellationToken = default);
    }
}
