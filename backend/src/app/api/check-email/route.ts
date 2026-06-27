import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "backend", "data", "registrations.json");

function ensureDataFile() {
  const dir = join(process.cwd(), "backend", "data");
  if (!existsSync(dir)) {
    const { mkdirSync } = require("fs");
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    ensureDataFile();
    const data = readFileSync(DATA_FILE, "utf-8");
    const registrations = JSON.parse(data);

    const exists = registrations.some(
      (r: { email: string }) => r.email.toLowerCase() === email.toLowerCase()
    );

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { exists: false },
      { status: 200 }
    );
  }
}