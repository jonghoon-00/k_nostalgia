import supabase from "@/utils/supabase/client";

export async function GET() {
  const { data, error } = await supabase
    .from("healthcheck")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 
        "content-type": "application/json", 
        "Cache-Control": "no-store"
      },
    });
  }

  return new Response(JSON.stringify({ ok: true, data }), {
    status: 200,
    headers: { 
      "content-type": "application/json", 
      "Cache-Control": "no-store"
    },
  });
}
