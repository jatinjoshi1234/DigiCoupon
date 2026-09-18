using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigiCoupon.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangeAutoFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_restaurants_users_created_by_user_id",
                table: "restaurants");

            migrationBuilder.RenameColumn(
                name: "created_by_user_id",
                table: "restaurants",
                newName: "user_id");

            migrationBuilder.RenameIndex(
                name: "ix_restaurants_created_by_user_id",
                table: "restaurants",
                newName: "ix_restaurants_user_id");

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

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "restaurants",
                newName: "created_by_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_restaurants_user_id",
                table: "restaurants",
                newName: "ix_restaurants_created_by_user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_restaurants_users_created_by_user_id",
                table: "restaurants",
                column: "created_by_user_id",
                principalTable: "users",
                principalColumn: "id");
        }
    }
}
