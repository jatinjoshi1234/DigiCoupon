using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigiCoupon.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangeAutoFKCRenameCreatedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_restaurants_users_created_by_user_id",
                table: "restaurants");

            migrationBuilder.DropIndex(
                name: "ix_restaurants_created_by_user_id",
                table: "restaurants");

            migrationBuilder.DropColumn(
                name: "created_by_user_id",
                table: "restaurants");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "payments");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "pass_redemptions");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "users",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "restaurants",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "restaurant_branches",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "customers",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "customer_coupon",
                newName: "user_id");

            migrationBuilder.AlterColumn<int>(
                name: "user_id",
                table: "payments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "user_id",
                table: "pass_redemptions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "ix_restaurants_user_id",
                table: "restaurants",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_restaurants_users_user_id",
                table: "restaurants",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_restaurants_users_user_id",
                table: "restaurants");

            migrationBuilder.DropIndex(
                name: "ix_restaurants_user_id",
                table: "restaurants");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "users",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "restaurants",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "restaurant_branches",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "customers",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "customer_coupon",
                newName: "created_by");

            migrationBuilder.AddColumn<int>(
                name: "created_by_user_id",
                table: "restaurants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "user_id",
                table: "payments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "created_by",
                table: "payments",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "user_id",
                table: "pass_redemptions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "created_by",
                table: "pass_redemptions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_restaurants_created_by_user_id",
                table: "restaurants",
                column: "created_by_user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_restaurants_users_created_by_user_id",
                table: "restaurants",
                column: "created_by_user_id",
                principalTable: "users",
                principalColumn: "id");
        }
    }
}
