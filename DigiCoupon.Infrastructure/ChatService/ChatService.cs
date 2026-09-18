using DigiCoupon.Application.ChatService;

using Microsoft.Extensions.Configuration;

using OpenAI.Responses;

using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastructure.ChatService
{
    public sealed class ChatService : IChatService
    {

#pragma warning disable OPENAI001
        private readonly ResponsesClient _client;
        private readonly string _model;

        public ChatService(IConfiguration configuration)
        {
            string apiKey = configuration["OpenAI:ApiKey"]
                ?? throw new InvalidOperationException(
                    "OpenAI API key is not configured.");

            _model = configuration["OpenAI:Model"] ?? "gpt-5-mini";

            _client = new ResponsesClient(apiKey);
        }
#pragma warning restore OPENAI001

        public async Task<string> ChatAsync(string message, CancellationToken cancellationToken = default)
        {
#pragma warning disable OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
            CreateResponseOptions options = new CreateResponseOptions
            {
                Model = "gpt-5-mini"
            };
#pragma warning restore OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

#pragma warning disable OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
            options.InputItems.Add(
                item: ResponseItem.CreateUserMessageItem(inputTextContent: message)
            );
#pragma warning restore OPENAI001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

            var response = await _client.CreateResponseAsync(
                options,
                cancellationToken);

            return response.Value.GetOutputText();
        }
#pragma warning restore OPENAI001
    }

}
