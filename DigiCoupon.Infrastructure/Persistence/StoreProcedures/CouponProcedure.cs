using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.StoreProcedures
{
    internal static class CouponProcedure
    {
        public const string ProcName = "sp_get_coupons";
        public const string Definition = """
                                         CREATE or alter PROCEDURE dbo.sp_get_coupons
                                         (  
                                             @Page INT = 1,  
                                             @PageSize INT = 10,  
                                             @OtherData int,  
                                             @Search NVARCHAR(200) = NULL  
                                         )  
                                         AS  
                                         BEGIN  
                                             SET NOCOUNT ON;  
                                             -- Safety  
                                             IF @Page < 1  
                                                 SET @Page = 1;  

                                             IF @PageSize <= 0  
                                                 SET @PageSize = 10;  

                                             DECLARE @Offset INT;  

                                             SET @Offset = (@Page - 1) * @PageSize;  

                                             --------------------------------------------------  
                                             -- Total Records  
                                             --------------------------------------------------  

                                             SELECT distinct  
                                                 COUNT(1) AS TotalRecords  
                                             FROM customer_coupon CC
                                             left join customers C ON CC.customer_id = C.id 
                                             WHERE C.restaurant_id = @OtherData and C.is_deleted = 0  
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
                                                 select distinct
                                                     CC.customer_id,
                                                     isnull(CC.id,0) PassId,  
                                                     datediff(day,CC.start_date,CC.end_date) + 1 as Total,  
                                                     isnull(count(CR.id) over(partition by CR.customer_coupon_id),0) as Usage,  
                                                     datediff(day,CC.start_date,CC.end_date) + 1 - isnull(count(CR.id) over(partition by CR.customer_coupon_id),0) as Remaining ,
                                                     CC.start_date,
                                                     CC.end_date,
                                                     CC.coupon_number,
                                                     CC.coupon_type,
                                                     CC.price
                                                 from customer_coupon CC 
                                                 left join coupon_redemptions CR ON isnull(CC.is_active,0)= 1 and CC.id = CR.customer_coupon_id and isnull(CR.is_deleted,0) = 0
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
                                                 isnull(CC.Remaining,0) Remaining,
                                                 format(CC.start_date,'dd MMM yyyy') FromDate,
                                                 format(CC.end_date,'dd MMM yyyy') ToDate,
                                                 CC.coupon_number CouponNo,
                                                 CC.coupon_type PassType,
                                                 CC.price Price
                                                 FROM cc_cte CC
                                             left join customers C ON C.id = CC.customer_id 
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
    }
}
