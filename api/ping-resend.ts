/* Temporary diagnostic: imports only the resend package. */
import { Resend } from "resend";

export default function handler(_req: unknown, res: { status: (c: number) => { json: (b: unknown) => void } }) {
    res.status(200).json({ ok: true, probe: "resend", loaded: typeof Resend === "function", node: process.version });
}
