using DigiCoupon.Infrastructure.Persistence.StoreProcedures;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigiCoupon.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ProcedureCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
CREATE OR ALTER PROC sp_get_dashboard_data  
    @Date DATE = NULL,  
    @RestaurantId INT  
AS   
BEGIN  
  WITH CustomerData AS  
(  
    SELECT  
        RST.id AS RestaurantId,  
        USR.name AS OwnerName,  
        RST.name AS RestaurantName,  
        CUS.id AS CustomerId,  
        COUNT(*) OVER (PARTITION BY RST.id) AS TotalCustomers  
    FROM restaurants RST  
    INNER JOIN users USR ON USR.id = RST.user_id  
    INNER JOIN customers CUS ON CUS.restaurant_id = RST.id AND ISNULL(CUS.is_deleted, 0) = 0  
    WHERE RST.id = @RestaurantId AND ISNULL(RST.is_deleted, 0) = 0  
),  
PassData AS  
(  
    SELECT  
        RST.id AS RestaurantId,  
        CC.id AS CouponId,  
        CC.is_active,  
        COUNT(CASE WHEN CC.is_active = 1 THEN CC.id END) OVER (PARTITION BY RST.id) AS ActivePasses  
    FROM restaurants RST  
    INNER JOIN customers CUS ON CUS.restaurant_id = RST.id AND ISNULL(CUS.is_deleted, 0) = 0  
    INNER JOIN customer_coupon CC ON CC.customer_id = CUS.id AND ISNULL(CC.is_deleted, 0) = 0  
    WHERE RST.id = @RestaurantId AND ISNULL(RST.is_deleted, 0) = 0  
),  
RedemptionData AS  
(  
    SELECT  
        RST.id AS RestaurantId,  
        CR.id AS RedemptionId,  
        CR.redemption_date,  
        COUNT(CASE WHEN CR.redemption_date >= ISNULL(@Date, GETDATE()) AND CR.redemption_date < DATEADD(DAY, 1, ISNULL(@Date, GETDATE())) THEN CR.id END) OVER (PARTITION BY RST.id) AS TodayRedemptions,  
        COUNT(CASE WHEN CR.redemption_date >= DATEADD(DAY, -7, ISNULL(@Date, GETDATE())) AND CR.redemption_date < DATEADD(DAY, 1, ISNULL(@Date, GETDATE())) THEN CR.id END) OVER (PARTITION BY RST.id) AS RecentRedemptions  
    FROM restaurants RST  
    INNER JOIN customers CUS ON CUS.restaurant_id = RST.id AND ISNULL(CUS.is_deleted, 0) = 0  
    INNER JOIN customer_coupon CC ON CC.customer_id = CUS.id AND ISNULL(CC.is_deleted, 0) = 0  
    INNER JOIN coupon_redemptions CR ON CR.customer_coupon_id = CC.id AND ISNULL(CR.is_deleted, 0) = 0  
    WHERE RST.id = @RestaurantId AND ISNULL(RST.is_deleted, 0) = 0  
),  
CustomerSummary AS  
(  
    SELECT TOP 1 RestaurantId, OwnerName, RestaurantName, TotalCustomers FROM CustomerData  
),  
PassSummary AS  
(  
    SELECT TOP 1 RestaurantId, ActivePasses FROM PassData  
),  
RedemptionSummary AS  
(  
    SELECT TOP 1 RestaurantId, TodayRedemptions, RecentRedemptions FROM RedemptionData  
)  
SELECT  
    CS.RestaurantId,  
    CS.OwnerName,  
    CS.RestaurantName,  
    CS.TotalCustomers,  
    ISNULL(PS.ActivePasses, 0) AS ActivePasses,  
    ISNULL(RS.TodayRedemptions, 0) AS TodayRedemptions,  
    0 AS ExpiringPasses,  
    ISNULL(RS.RecentRedemptions, 0) AS RecentRedemptions,  
    0 AS TotalRedemptions  
FROM CustomerSummary CS  
LEFT JOIN PassSummary PS ON PS.RestaurantId = CS.RestaurantId  
LEFT JOIN RedemptionSummary RS ON RS.RestaurantId = CS.RestaurantId;  
END
""");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(DashboardProcedure.DropGetDashboardData);
        }
    }
}
