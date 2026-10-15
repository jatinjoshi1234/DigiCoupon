using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigiCoupon.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCustomerProcedure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "total_usage",
                table: "customer_coupon");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "total_usage",
                table: "customer_coupon",
                type: "int",
                nullable: true);
        }
    }
}
