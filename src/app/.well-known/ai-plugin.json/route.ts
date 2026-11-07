export async function GET() {
  const plugin = {
    schema_version: "v1",
    name_for_human: "Canary Villas",
    name_for_model: "canary_villas",
    description_for_human: "Find and book luxury holiday villas in Corralejo, Fuerteventura, Canary Islands.",
    description_for_model:
      "Canary Villas is an independent villa rental agency in Corralejo, Fuerteventura. Use this to look up available holiday villas, their prices, number of bedrooms, amenities, and booking links. All villas are beachfront or near-beach self-catering properties. Direct booking at www.canaryvillas.com — no OTA fees.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: "https://www.canaryvillas.com/.well-known/openapi.json",
      is_user_authenticated: false,
    },
    logo_url: "https://www.canaryvillas.com/favicon.ico",
    contact_email: "info@canaryvillas.com",
    legal_info_url: "https://www.canaryvillas.com/terms",
  };

  return Response.json(plugin, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
