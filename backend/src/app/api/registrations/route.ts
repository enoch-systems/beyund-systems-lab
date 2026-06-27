import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_FILE = join(process.cwd(), "backend", "data", "registrations.json");

interface Registration {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

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

function readRegistrations(): Registration[] {
  ensureDataFile();
  const data = readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function writeRegistrations(registrations: Registration[]) {
  ensureDataFile();
  writeFileSync(DATA_FILE, JSON.stringify(registrations, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email } = body;

    // Validate input
    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const registrations = readRegistrations();
    const exists = registrations.some((r) => r.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      return NextResponse.json(
        { error: "This email has already been registered" },
        { status: 409 }
      );
    }

    // Create new registration
    const newRegistration: Registration = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    // Save to file
    registrations.push(newRegistration);
    writeRegistrations(registrations);

    return NextResponse.json(
      { success: true, data: newRegistration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving registration:", error);
    return NextResponse.json(
      { error: "Failed to save registration" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const registrations = readRegistrations();
    return NextResponse.json({ success: true, data: registrations });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}