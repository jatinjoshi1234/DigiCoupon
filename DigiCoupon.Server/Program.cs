using DigiCoupon.Application;
using DigiCoupon.Infrastructure.Extensions;
using DigiCoupon.Server.Middlewares;

using DigiCoupon.Infrastrucure;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

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
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine(
                $"JWT ERROR: {context.Exception.Message}");

            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

builder.Services.AddInfrastructure(builder.Configuration).AddApplication();


var app = builder.Build();

app.Services.ApplyMigrations();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").GetChildren().Select(x => x.Value.Trim().TrimEnd('/')).ToArray();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AMS");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

//app.MapFallbackToFile("/index.html");

app.Run();
