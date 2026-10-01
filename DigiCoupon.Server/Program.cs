using DigiCoupon.Application;
using DigiCoupon.Application.DTO;
using DigiCoupon.Infrastructure.Extensions;
using DigiCoupon.Infrastrucure;
using DigiCoupon.Server.Middlewares;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").GetChildren().Select(x => x.Value.Trim().TrimEnd('/')).ToArray();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "DigiCors",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy =
        JsonNamingPolicy.CamelCase;
}); ;

builder.Services.AddOpenApi();

builder.Services.AddCors();

var jwtKey = builder.Configuration["JwtSettings:Key"];
var audience = builder.Configuration["JwtSettings:Audience"];
var issuer = builder.Configuration["JwtSettings:Issuer"];
var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
    {
        ValidateAudience = true,
        ValidateIssuer = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = signinKey
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = async context =>
        {
            Console.WriteLine(
                $"JWT ERROR: {context.Exception.Message}");

            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";

            var response = ApiResponse.OnFailer("Authentication required. Please provide a valid token.", StatusCodes.Status401Unauthorized);

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response,
new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
}
            ));
            //return Task.CompletedTask;
        },
        OnChallenge = async context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";

            var response = new
            {
                success = false,
                statusCode = 401,
                message = "Authentication required. Please provide a valid token."
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(ApiResponse.OnFailer("Authentication required. Please provide a valid token.", StatusCodes.Status401Unauthorized), new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                })
            );
        }
    };
});

builder.Services.AddAuthorization();

builder.Services.AddInfrastructure(builder.Configuration).AddApplication();


var app = builder.Build();

app.Services.ApplyMigrations();



app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();
app.UseCors("DigiCors");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

//app.MapFallbackToFile("/index.html");

app.Run();
