import {
  sectionStyle,
  headerStyle,
  apiLabelStyle,
  descriptionStyle,
  infoBoxStyle,
} from "./sharedStyles";

const InAppPurchase = () => {
  return (
    <section style={sectionStyle}>
      <h3 style={headerStyle}>💳 In-App Purchase (macOS)</h3>

      <div style={apiLabelStyle}>
        <strong>APIs:</strong> inAppPurchase.purchaseProduct(), getProducts(),
        canMakePayments(), getReceiptURL()
      </div>

      <p style={descriptionStyle}>
        Enables monetization through Apple's In-App Purchase system for Mac App
        Store distribution. Sell digital products, subscriptions, or features
        with secure payment processing, localized pricing, receipt validation,
        and support for consumables, non-consumables, and subscription models.
        Requires proper App Store Connect configuration.
      </p>

      <div
        style={{
          ...infoBoxStyle,
          background: "rgba(237, 137, 54, 0.1)",
          border: "1px solid rgba(237, 137, 54, 0.3)",
        }}
      >
        <div
          style={{ fontSize: "13px", color: "#ed8936", marginBottom: "8px" }}
        >
          <strong>⚠️ Setup Required</strong>
        </div>
        <div style={{ fontSize: "12px", color: "#a0aec0", lineHeight: "1.6" }}>
          This API is only available on macOS and requires App Store
          configuration. In-App Purchase requires proper App Store setup and
          cannot be tested in development mode.
        </div>
      </div>
    </section>
  );
};

export default InAppPurchase;
