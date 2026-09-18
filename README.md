#DigiCoupon
Command for Create db context
Add-Migration InitialCreate -Project DigiCoupon.Infrastrucure -StartupProject DigiCoupon.Server -Context LexProAmsContext -Outputdir Persistence/Migrations

cli command
dotnet ef migrations add InitialCreate `
--project DigiCoupon.Infrastrucure `
--startup-project DigiCoupon.Server `
--output-dir Persistence/Migrations