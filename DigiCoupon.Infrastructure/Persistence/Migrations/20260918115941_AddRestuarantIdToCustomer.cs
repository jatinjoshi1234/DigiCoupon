using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigiCoupon.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddRestuarantIdToCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "restaurant_branch_id",
                table: "customers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "restaurant_id",
                table: "customers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_customers_restaurant_id",
                table: "customers",
                column: "restaurant_id");

            migrationBuilder.AddForeignKey(
                name: "fk_customers_restaurants_restaurant_id",
                table: "customers",
                column: "restaurant_id",
                principalTable: "restaurants",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_customers_restaurants_restaurant_id",
                table: "customers");

            migrationBuilder.DropIndex(
                name: "ix_customers_restaurant_id",
                table: "customers");

            migrationBuilder.DropColumn(
                name: "restaurant_id",
                table: "customers");

            migrationBuilder.AlterColumn<int>(
                name: "restaurant_branch_id",
                table: "customers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
