using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DigiCoupon.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameTblPassRedemption : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_pass_redemptions_customer_coupon_customer_coupon_id",
                table: "pass_redemptions");

            migrationBuilder.DropForeignKey(
                name: "fk_pass_redemptions_restaurant_branches_restaurant_branch_id",
                table: "pass_redemptions");

            migrationBuilder.DropForeignKey(
                name: "fk_pass_redemptions_users_user_id",
                table: "pass_redemptions");

            migrationBuilder.DropPrimaryKey(
                name: "pk_pass_redemptions",
                table: "pass_redemptions");

            migrationBuilder.RenameTable(
                name: "pass_redemptions",
                newName: "coupon_redemptions");

            migrationBuilder.RenameIndex(
                name: "ix_pass_redemptions_user_id",
                table: "coupon_redemptions",
                newName: "ix_coupon_redemptions_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_pass_redemptions_restaurant_branch_id",
                table: "coupon_redemptions",
                newName: "ix_coupon_redemptions_restaurant_branch_id");

            migrationBuilder.RenameIndex(
                name: "ix_pass_redemptions_customer_coupon_id",
                table: "coupon_redemptions",
                newName: "ix_coupon_redemptions_customer_coupon_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_coupon_redemptions",
                table: "coupon_redemptions",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_coupon_redemptions_customer_coupon_customer_coupon_id",
                table: "coupon_redemptions",
                column: "customer_coupon_id",
                principalTable: "customer_coupon",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_coupon_redemptions_restaurant_branches_restaurant_branch_id",
                table: "coupon_redemptions",
                column: "restaurant_branch_id",
                principalTable: "restaurant_branches",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_coupon_redemptions_users_user_id",
                table: "coupon_redemptions",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_coupon_redemptions_customer_coupon_customer_coupon_id",
                table: "coupon_redemptions");

            migrationBuilder.DropForeignKey(
                name: "fk_coupon_redemptions_restaurant_branches_restaurant_branch_id",
                table: "coupon_redemptions");

            migrationBuilder.DropForeignKey(
                name: "fk_coupon_redemptions_users_user_id",
                table: "coupon_redemptions");

            migrationBuilder.DropPrimaryKey(
                name: "pk_coupon_redemptions",
                table: "coupon_redemptions");

            migrationBuilder.RenameTable(
                name: "coupon_redemptions",
                newName: "pass_redemptions");

            migrationBuilder.RenameIndex(
                name: "ix_coupon_redemptions_user_id",
                table: "pass_redemptions",
                newName: "ix_pass_redemptions_user_id");

            migrationBuilder.RenameIndex(
                name: "ix_coupon_redemptions_restaurant_branch_id",
                table: "pass_redemptions",
                newName: "ix_pass_redemptions_restaurant_branch_id");

            migrationBuilder.RenameIndex(
                name: "ix_coupon_redemptions_customer_coupon_id",
                table: "pass_redemptions",
                newName: "ix_pass_redemptions_customer_coupon_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_pass_redemptions",
                table: "pass_redemptions",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_pass_redemptions_customer_coupon_customer_coupon_id",
                table: "pass_redemptions",
                column: "customer_coupon_id",
                principalTable: "customer_coupon",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_pass_redemptions_restaurant_branches_restaurant_branch_id",
                table: "pass_redemptions",
                column: "restaurant_branch_id",
                principalTable: "restaurant_branches",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_pass_redemptions_users_user_id",
                table: "pass_redemptions",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id");
        }
    }
}
