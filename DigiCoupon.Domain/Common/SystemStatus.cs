public struct VendorStatus
{
    public const string Pending = "Pending";
    public const string Approved = "Approved";
    public const string Rejected = "Rejected";
    public const string Suspended = "Suspended";
}

public struct OrderStatus
{
    public const string Pending = "Pending";
    public const string Confirmed = "Confirmed";
    public const string Packed = "Packed";
    public const string Shipped = "Shipped";
    public const string Delivered = "Delivered";
    public const string Cancelled = "Cancelled";
    public const string Returned = "Returned";
}

public enum CouponType
{
    Fixed = 1,
    Unlimited = 2,
}

public enum PaymentMode
{
    Cash = 1,
    UPI = 2,
    BankTransfer = 3,
    Cheque = 4,
    Card = 5,
    Other = 6
}

public static class Props
{
    public static List<string> AddressType = [
    "Home",
    "Office",
    "Billing",
    "Shipping",
    "Warehouse"
    ];


    public static List<string> VenderStatus = [
        "Pending",
        "Approved",
        "Rejected",
        "Suspended"
    ];

}