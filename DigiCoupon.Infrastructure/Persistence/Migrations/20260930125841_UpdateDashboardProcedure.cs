using DigiCoupon.Infrastructure.Persistence.StoreProcedures;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigiCoupon.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDashboardProcedure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Dashboard procedure updated with quantity in RedemptionQuantity migration
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(DashboardProcedure.DropGetDashboardData);
        }
    }
}
