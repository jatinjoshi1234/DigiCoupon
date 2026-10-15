using DigiCoupon.Infrastructure.Persistence.StoreProcedures;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigiCoupon.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RedemptionQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "quantity",
                table: "coupon_redemptions",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.Sql(DashboardProcedure.GetDashboardData);
            migrationBuilder.Sql(DashboardProcedure.RecentRedemption);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "quantity",
                table: "coupon_redemptions");
        }
    }
}
