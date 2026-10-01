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
            migrationBuilder.Sql(DashboardProcedure.GetDashboardData);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(DashboardProcedure.DropGetDashboardData);
        }
    }
}
