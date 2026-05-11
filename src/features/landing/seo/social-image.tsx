import { ImageResponse } from "next/og";
import { siteConfig } from "./site-config";

export const socialImageAlt =
  "WEM Italia, agenzia AI, SEO e web design premium in Italia";

export const socialImageSize = {
  width: 1200,
  height: 630,
} as const;

export const socialImageContentType = "image/png";

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at top right, rgba(26, 119, 254, 0.28), transparent 30%), #050505",
          color: "#ffffff",
          padding: "56px 64px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24,
            padding: "44px 48px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 26,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                {siteConfig.name}
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 66,
                  lineHeight: 1.02,
                  fontWeight: 700,
                  maxWidth: 760,
                }}
              >
                Agenzia AI, SEO e Web Design in Italia
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 12,
                  borderRadius: 999,
                  background: "#69d34f",
                }}
              />
              <div
                style={{
                  width: 110,
                  height: 12,
                  borderRadius: 999,
                  background: "#ffffff",
                }}
              />
              <div
                style={{
                  width: 110,
                  height: 12,
                  borderRadius: 999,
                  background: "#ef4444",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.28,
                color: "rgba(255,255,255,0.84)",
                maxWidth: 930,
              }}
            >
              SEO Google, automazione AI, sviluppo web e digital experiences
              premium per aziende italiane che vogliono crescere con metodo.
            </div>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {[
                "AI per aziende",
                "Consulenza SEO",
                "Web design premium",
                "Automazione marketing",
                "Milano, Firenze, Roma, Bologna",
              ].map((label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.04)",
                    fontSize: 22,
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}
