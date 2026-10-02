using System;
using System.Collections.Generic;
using System.Text;

namespace DigiCoupon.Infrastructure.Persistence.StoreProcedures
{
    internal static class CustomerProcedure
    {
        public const string ProcName = "sp_get_customers";
        public const string GetCustomer = """
                                          CREATE or alter PROC sp_get_customers
                                          @RestuarantId as int
                                          AS
                                          BEGIN
                                          	SELECT DISTINCT
                                          		CU.id as CustomerId,	
                                          		CU.restaurant_id,
                                          		CU.first_name + ' ' + CU.last_name as Name,
                                          		CU.nick_name as NickName,
                                          		CU.mobile,
                                          		CU.is_active as IsActive,
                                          		ISNULL(CC.id,0) PassId, 
                                          		ISNULL(DATEDIFF(day,Cc.start_date,CC.end_date) + 1,0) Total,
                                          		ISNULL((DATEDIFF(day,Cc.start_date,CC.end_date) + 1 - count(CR.id) OVER(PARTITION BY CR.customer_coupon_id)),0) AS Remaining
                                          		from customers CU 
                                          	left join customer_coupon CC ON CU.id = CC.customer_id and isnull(CC.is_active,0) = 1 and isnull(CC.is_deleted,0) = 0 
                                          	left join coupon_redemptions CR ON CC.id = CR.customer_coupon_id and isnull(CR.is_deleted,0) = 0 
                                          	WHERE CU.restaurant_id = 9 and isnull(CR.is_deleted,0) = 0 
                                          END
                                            
                                          """;

        public const string DropCustomer = """
                                            DROP PROCEDURE IF EXISTS dbo.sp_get_customers;
                                            """;

    }
}
