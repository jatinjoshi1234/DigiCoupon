using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.StoreProcedures
{
    public static class DashboardProcedure
    {
        public const string RecentRecepmtionPcoc = "sp_get_recent_redemption";
        public const string DashboardProc = "sp_get_dashboard_data";
        public const string RecentRedemption = """
                                                    CREATE OR ALTER PROC sp_get_recent_redemption
                                                        @RestuarantId INT
                                                    AS
                                                    BEGIN
                                                        SELECT 
                                                            CC2.coupon_number as CouponNumber,    
                                                            CUS2.first_name + ' ' + CUS2.last_name AS Customer,    
                                                            CC2.start_date as FromDate,
                                                            CC2.end_date as ToDate,
                                                            CR2.redemption_date AS RedemptionOn    
                                                    
                                                        FROM coupon_redemptions CR2    
                                                    
                                                        INNER JOIN customer_coupon CC2    
                                                            ON CC2.id = CR2.customer_coupon_id    
                                                    
                                                        INNER JOIN customers CUS2    
                                                            ON CUS2.id = CC2.customer_id    
                                                    
                                                        WHERE CUS2.restaurant_id = @RestuarantId
                                                    
                                                          AND ISNULL(CUS2.is_deleted, 0) = 0    
                                                          AND ISNULL(CC2.is_deleted, 0) = 0    
                                                          AND ISNULL(CR2.is_deleted, 0) = 0    
                                                    
                                                          AND CR2.redemption_date >= DATEADD(DAY, -3, GETDATE())    
                                                          AND CR2.redemption_date < DATEADD(DAY, 1, GETDATE())    
                                                    
                                                        ORDER BY CR2.redemption_date DESC    
                                                    END
                                                """;
        public const string GetDashboardData = """
                                                   create or alter proc sp_get_dashboard_data      
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
                                                    count(  
                                                        CASE      
                                                            WHEN isnull(CC.is_active,0) = 1 and try_cast(CC.end_date as date) >= try_cast(getdate() as date) and try_cast(CC.end_date as date) <= try_cast(dateadd(day,3,getdate()) as date) 
                                                            THEN CC.id      
                                                        END      
                                                    ) over(PARTITION BY RST.id) as ExpiringPasses,   
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
                                                    sum  
                                                    (   
                                                        CR.quantity  
                                                    ) OVER      
                                                    (      
                                                        PARTITION BY RST.id      
                                                    ) AS TotalRedemptions,      

                                                    sum  
                                                    (      
                                                        case 
                                                            when TRY_CAST(CR.redemption_date as date) = TRY_CAST(getdate() as date)       
                                                            then CR.quantity  
                                                        end
                                                    ) OVER      
                                                    (      
                                                        PARTITION BY RST.id      
                                                    ) AS TodayRedemptions,      

                                                    sum
                                                    (      
                                                        CASE      
                                                            WHEN CR.redemption_date >= DATEADD(DAY, -3, getdate())      
                                                             AND CR.redemption_date < DATEADD(DAY, 1, getdate())      
                                                            THEN CR.quantity
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
                                                    TotalRedemptions,
                                                    RecentRedemptions      
                                                FROM RedemptionData      
                                            )      

                                            SELECT      
                                                CS.RestaurantId,      
                                                CS.OwnerName,      
                                                CS.RestaurantName,      
                                                CS.TotalCustomers,      
                                                ISNULL(PS.ActivePasses, 0) AS ActivePasses,      
                                                PD.ExpiringPasses,
                                                ISNULL(RS.TodayRedemptions, 0) AS TodayRedemptions,      
                                                ISNULL(RS.RecentRedemptions, 0) AS RecentRedemptions,
                                                isnull(RS.TotalRedemptions,0) TotalRedemptions
                                            FROM CustomerSummary CS      

                                            LEFT JOIN PassSummary PS      
                                                ON PS.RestaurantId = CS.RestaurantId  

                                            LEFT JOIN PassData PD      
                                                ON PS.RestaurantId = CS.RestaurantId      

                                            LEFT JOIN RedemptionSummary RS      
                                                ON RS.RestaurantId = CS.RestaurantId;      
                                            end
                                            """;
        public const string DropGetDashboardData = """DROP PROCEDURE IF EXISTS dbo.sp_get_dashboard_data;""";
    }
}
