import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";

// ⚠️ শুধু এই দুটো role allow
const ALLOWED_ROLES = ["user", "lawyer"];

export async function POST(request) {
  try {
    // ১. লগইন আছে কিনা চেক
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // ২. Role অলরেডি সেট করা থাকলে reject
    if (session.user.role) {
      return Response.json(
        { error: "Role already set" },
        { status: 400 }
      );
    }

    // ৩. Request থেকে role নাও
    const { role } = await request.json();

    // ৪. Allowlist check — admin এখানে নেই
    if (!ALLOWED_ROLES.includes(role)) {
      return Response.json(
        { error: "Invalid role. Only 'user' or 'lawyer' allowed." },
        { status: 400 }
      );
    }

    // ৫. সরাসরি MongoDB আপডেট (input: false ignore করে)
    await db.collection("user").updateOne(
      { id: session.user.id },
      { $set: { role } }
    );

    return Response.json({ success: true, role });
  } catch (err) {
    console.error("set-role error:", err);
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}