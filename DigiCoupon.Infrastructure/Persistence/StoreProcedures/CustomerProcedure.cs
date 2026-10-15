using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.StoreProcedures
{
    internal static class CustomerProcedure
    {
        public const string ProcName = "sp_get_customers";
        public const string GetCustomer = """
                                          CREATE or alter PROCEDURE dbo.sp_get_customers  
                                          (  
                                              @Page INT = 1,  
                                              @PageSize INT = 10,  
                                              @OtherData int,  
                                              @Search NVARCHAR(200) = NULL  
                                          )  
                                          AS  
                                          BEGIN  
                                                  SET NOCOUNT ON;  
                                                  IF @Page < 1  
                                                  SET @Page = 1;  
                                                  IF @PageSize <= 0  
                                                  SET @PageSize = 10;  
                                                  DECLARE @Offset INT;  

                                                  SET @Offset = (@Page - 1) * @PageSize;  

                                                  --------------------------------------------------  
                                                  -- Total Records  
                                                  --------------------------------------------------  

                                                  SELECT 
                                                      COUNT(1) AS TotalRecords  
                                                  FROM customers C  
                                                  WHERE C.restaurant_id = @OtherData and isnull(C.is_deleted,0) = 0  
                                                      AND  
                                                      (  
                                                          @Search IS NULL  
                                                          OR @Search = ''  
                                                          OR C.first_name LIKE '%' + @Search + '%'  
                                                          OR C.last_name LIKE '%' + @Search + '%'  
                                                          OR C.Mobile LIKE '%' + @Search + '%'  
                                                          OR C.nick_name LIKE '%' + @Search + '%'  
                                                      );  
                                                  --------------------------------------------------  
                                                  -- Paginated Records  
                                                  --------------------------------------------------  
                                                  with cc_cte as (
                                                      select
                                                          CC.customer_id,
                                                          isnull(CC.id,0) PassId,  
                                                          datediff(day,CC.start_date,CC.end_date) + 1 as Total,  
                                                          isnull(count(CR.id) over(partition by CR.customer_coupon_id),0) as Usage,  
                                                          datediff(day,CC.start_date,CC.end_date) + 1 - isnull(count(CR.id) over(partition by CR.customer_coupon_id),0) as Remaining  
                                                      from customer_coupon CC 
                                                      left join coupon_redemptions CR ON CC.id = CR.customer_coupon_id and isnull(CC.is_deleted,0) = 0 and isnull(CR.is_deleted,0) = 0
                                                  )

                                                  SELECT distinct  
                                                      C.Id Customerid,  
                                                      C.first_name +  ' '+ C.last_name as [Name],  
                                                      C.Mobile,  
                                                      C.is_active as IsActive,  
                                                      C.nick_name NickName,
                                                      isnull(CC.PassId,0) PassId,
                                                      isnull(CC.Total,0) Total,
                                                      isnull(CC.Usage,0) Usage,
                                                      CC.customer_id,
                                                      CC.PassId,
                                                      isnull(CC.Remaining,0) Remaining,
                                                      (select count(*) from customer_coupon where customer_id = C.id) as TotalPass
                                                      --isnull(CC.id,0) PassId,  
                                                      --datediff(day,CC.start_date,CC.end_date) + 1 as Total,  
                                                      --isnull(count(CR.id) over(partition by CR.customer_coupon_id),0) as Usage,  
                                                      --datediff(day,CC.start_date,CC.end_date) + 1 - isnull(count(CR.id) over(partition by CR.customer_coupon_id),0) as Remaining  
                                                  FROM customers C
                                                  left join cc_cte CC ON C.id = CC.customer_id 
                                                  where
                                                      isnull(C.is_deleted,0) = 0 and C.restaurant_id = @OtherData 
                                                      AND  
                                                      (  
                                                          @Search IS NULL  
                                                          OR @Search = ''  
                                                          OR C.first_name LIKE '%' + @Search + '%'  
                                                          OR C.last_name LIKE '%' + @Search + '%'  
                                                          OR C.Mobile LIKE '%' + @Search + '%'  
                                                          OR C.nick_name LIKE '%' + @Search + '%'  
                                                      )  
                                                  ORDER BY C.Id DESC  
                                                  OFFSET @Offset ROWS  
                                                  FETCH NEXT @PageSize ROWS ONLY;
                                          END    
                                          """;

        public const string Counts = @"
                                        SELECT V.Text, V.Value AS Id
                                        FROM
                                        (
                                            SELECT
                                                (
                                                    SELECT COUNT(DISTINCT CU.id)
                                                    FROM customers CU
                                                    WHERE ISNULL(CU.is_deleted, 0) = 0
                                                        AND CU.restaurant_id = 2
                                                ) AS Customers,
                                                (
                                                    SELECT COUNT(DISTINCT CC.id)
                                                    FROM customers CU
                                                    INNER JOIN customer_coupon CC ON CC.customer_id = CU.id
                                                    WHERE ISNULL(CU.is_deleted, 0) = 0
                                                        AND CU.restaurant_id = 2
                                                        AND ISNULL(CC.is_deleted, 0) = 0
                                                ) AS TotalPass,
                                                (
                                                    SELECT COALESCE(SUM(CR.quantity), 0)
                                                    FROM customers CU
                                                    INNER JOIN customer_coupon CC ON CC.customer_id = CU.id
                                                    INNER JOIN coupon_redemptions CR ON CR.customer_coupon_id = CC.id
                                                    WHERE ISNULL(CU.is_deleted, 0) = 0
                                                        AND CU.restaurant_id = 2
                                                        AND ISNULL(CC.is_deleted, 0) = 0
                                                        AND ISNULL(CR.is_deleted, 0) = 0
                                                ) AS TotelRedemption
                                        ) R
                                        CROSS APPLY
                                        (
                                            VALUES
                                                ('Customers', R.Customers),
                                                ('Total Pass', R.TotalPass),
                                                ('Total Redemption', R.TotelRedemption)
                                        ) V(Text, Value);
                                     ";
        public const string CountsProc = "sp_get_count";
        public const string DropCustomer = """
                                            DROP PROCEDURE IF EXISTS dbo.sp_get_customers;
                                            """;
        public const string DropCounts = """
                                            DROP PROCEDURE IF EXISTS dbo.sp_get_count;
                                            """;
    }
}
