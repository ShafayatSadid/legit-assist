// lib/api.js
import { authClient } from "@/lib/auth-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
    const { data, error } = await authClient.token();
    if (error) throw new Error("Failed to get token");
    return data?.token;
}

export async function apiFetch(path, options = {}) {
    const token = await getToken();
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Request failed");
    return json;
}