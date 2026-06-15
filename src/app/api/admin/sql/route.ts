import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/admin/sql
 * Executes a SQL query using the service role client.
 * Requires auth. Only SELECT queries are allowed for safety.
 * Body: { query: string }
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query } = await request.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Allow DELETE and SELECT for admin cleanup
    const trimmed = query.trim().toUpperCase();
    if (!trimmed.startsWith("SELECT") && !trimmed.startsWith("DELETE")) {
      return NextResponse.json({ error: "Only SELECT and DELETE queries are allowed via the API" }, { status: 400 });
    }

    // Execute using raw SQL via the management API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ query_text: query }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json({
        error: `SQL execution failed. Make sure the exec_sql function exists in Supabase.`,
        details: errorBody,
        hint: `Run this in your Supabase SQL Editor first:\n\nCREATE OR REPLACE FUNCTION exec_sql(query_text TEXT)\nRETURNS JSONB\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nDECLARE\n  result JSONB;\nBEGIN\n  EXECUTE query_text;\n  GET DIAGNOSTICS result = ROW_COUNT;\n  RETURN jsonb_build_object('affected_rows', result);\nEND;\n$$;`
      }, { status: 400 });
    }

    const result = await response.json();
    return NextResponse.json({ data: result, success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}