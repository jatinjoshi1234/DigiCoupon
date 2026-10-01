using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.StoreProcedures
{
    public static class DashboardProcedure
    {
        public const string GetDashboardData = """
alter proc sp_get_dashboard_data  
    @Date DATE ,  
    @RestaurantId INT  
as   
begin  
  WITH CustomerData AS  
(  
    -- One row per customer  
    SELECT  
        RST.id AS RestaurantId,  
        USR.name AS OwnerName,  
        RST.name AS RestaurantName,  
        CUS.id AS CustomerId,  

        COUNT(*) OVER  
        (  
            PARTITION BY RST.id  
        ) AS TotalCustomers  

    FROM restaurants RST  

    INNER JOIN users USR  
        ON USR.id = RST.user_id  

    INNER JOIN customers CUS  
        ON CUS.restaurant_id = RST.id  
        AND ISNULL(CUS.is_deleted, 0) = 0  

    WHERE RST.id = @RestaurantId  
      AND ISNULL(RST.is_deleted, 0) = 0  
),  

PassData AS  
(  
    -- One row per coupon/pass  
    SELECT  
        RST.id AS RestaurantId,  
        CC.id AS CouponId,  
        CC.is_active,  

        COUNT  
        (  
            CASE  
                WHEN CC.is_active = 1  
                THEN CC.id  
            END  
        ) OVER  
        (  
            PARTITION BY RST.id  
        ) AS ActivePasses  

    FROM restaurants RST  

    INNER JOIN customers CUS  
        ON CUS.restaurant_id = RST.id  
        AND ISNULL(CUS.is_deleted, 0) = 0  

    INNER JOIN customer_coupon CC  
        ON CC.customer_id = CUS.id  
        AND ISNULL(CC.is_deleted, 0) = 0  

    WHERE RST.id = @RestaurantId  
      AND ISNULL(RST.is_deleted, 0) = 0  
),  

RedemptionData AS  
(  
    -- One row per redemption  
    SELECT  
        RST.id AS RestaurantId,  
        CR.id AS RedemptionId,  
        CR.redemption_date,  

        COUNT  
        (  
            CASE  
                WHEN CR.redemption_date >= @Date  
                 AND CR.redemption_date < DATEADD(DAY, 1, @Date)  
                THEN CR.id  
            END  
        ) OVER  
        (  
            PARTITION BY RST.id  
        ) AS TodayRedemptions,  

        COUNT  
        (  
            CASE  
                WHEN CR.redemption_date >= DATEADD(DAY, -7, @Date)  
                 AND CR.redemption_date < DATEADD(DAY, 1, @Date)  
                THEN CR.id  
            END  
        ) OVER  
        (  
            PARTITION BY RST.id  
        ) AS RecentRedemptions  

    FROM restaurants RST  

    INNER JOIN customers CUS  
        ON CUS.restaurant_id = RST.id  
        AND ISNULL(CUS.is_deleted, 0) = 0  

    INNER JOIN customer_coupon CC  
        ON CC.customer_id = CUS.id  
        AND ISNULL(CC.is_deleted, 0) = 0  

    INNER JOIN coupon_redemptions CR  
        ON CR.customer_coupon_id = CC.id  
        AND ISNULL(CR.is_deleted, 0) = 0  

    WHERE RST.id = @RestaurantId  
      AND ISNULL(RST.is_deleted, 0) = 0  
),  

CustomerSummary AS  
(  
    SELECT TOP 1  
        RestaurantId,  
        OwnerName,  
        RestaurantName,  
        TotalCustomers  
    FROM CustomerData  
),  

PassSummary AS  
(  
    SELECT TOP 1  
        RestaurantId,  
        ActivePasses  
    FROM PassData  
),  

RedemptionSummary AS  
(  
    SELECT TOP 1  
        RestaurantId,  
        TodayRedemptions,  
        RecentRedemptions  
    FROM RedemptionData  
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

    -- Recent redemption list  
    ISNULL  
    (  
        (  
            SELECT  
                CC2.coupon_number as couponNumber,  
                CUS2.first_name + ' ' + CUS2.last_name AS customer,  
                CR2.redemption_date AS redemptionOn  

            FROM coupon_redemptions CR2  

            INNER JOIN customer_coupon CC2  
                ON CC2.id = CR2.customer_coupon_id  

            INNER JOIN customers CUS2  
                ON CUS2.id = CC2.customer_id  

            WHERE CUS2.restaurant_id = CS.RestaurantId  

              AND ISNULL(CUS2.is_deleted, 0) = 0  
              AND ISNULL(CC2.is_deleted, 0) = 0  
              AND ISNULL(CR2.is_deleted, 0) = 0  

              AND CR2.redemption_date >= DATEADD(DAY, -7, @Date)  
              AND CR2.redemption_date < DATEADD(DAY, 1, @Date)  

            ORDER BY CR2.redemption_date DESC  

            FOR JSON PATH  
        ),  
        '[]'  
    ) AS RecentRedemptionsJson  

FROM CustomerSummary CS  

LEFT JOIN PassSummary PS  
    ON PS.RestaurantId = CS.RestaurantId  

LEFT JOIN RedemptionSummary RS  
    ON RS.RestaurantId = CS.RestaurantId;  
end
""";
        public const string DropGetDashboardData = """DROP PROCEDURE IF EXISTS dbo.sp_get_dashboard_data;""";

    }
}
