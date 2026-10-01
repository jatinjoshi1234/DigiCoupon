export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="auth-layout">
      {/* Left Side - Branding */}
      <section className="auth-brand-section">
        <div className="auth-brand-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">🍽</div>

            <span>DigiCoupon</span>
          </div>

          <div className="auth-brand-message">
            <h1>
              Make your restaurant
              <br />
              <span>pass management smarter.</span>
            </h1>

            <p>
              Manage customers, digital meal passes, redemptions and your
              restaurant business from one simple platform.
            </p>
          </div>

          <div className="auth-brand-footer">
            © {new Date().getFullYear()} DigiCoupon
          </div>
        </div>
      </section>

      {/* Right Side - Page */}
      <section className="auth-form-section">
        <div className="auth-form-container">{children}</div>
      </section>
    </main>
  );
}
