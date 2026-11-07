import { getAllVillas } from "@/lib/villas";

export const dynamic = "force-dynamic";

export async function GET() {
  const villas = await getAllVillas();

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Canary Villas API",
      description: "Query available holiday villas in Corralejo, Fuerteventura.",
      version: "1.0.0",
      contact: { email: "info@canaryvillas.com" },
    },
    servers: [{ url: "https://www.canaryvillas.com" }],
    paths: {
      "/api/villas": {
        get: {
          operationId: "listVillas",
          summary: "List all available holiday villas",
          description: "Returns all holiday villas available to rent in Corralejo, Fuerteventura with pricing, bedrooms, guest capacity, and booking links.",
          responses: {
            "200": {
              description: "List of villas",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Villa" },
                  },
                  example: villas.map((v) => ({
                    id: v.id,
                    slug: v.slug,
                    name: v.name,
                    shortDesc: v.shortDesc,
                    bedrooms: v.bedrooms,
                    maxGuests: v.maxGuests,
                    pricePerNight: v.pricePerNight,
                    bookingUrl: `https://www.canaryvillas.com/villas/${v.slug}`,
                  })),
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Villa: {
          type: "object",
          properties: {
            id: { type: "string" },
            slug: { type: "string" },
            name: { type: "string" },
            shortDesc: { type: "string" },
            bedrooms: { type: "integer" },
            maxGuests: { type: "integer" },
            pricePerNight: { type: "number", description: "Price in EUR per night" },
            bookingUrl: { type: "string", format: "uri" },
          },
        },
      },
    },
  };

  return Response.json(spec, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
