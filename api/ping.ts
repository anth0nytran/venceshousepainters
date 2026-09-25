/* Temporary diagnostic: no imports at all. If this fails, the problem is the
   project's function runtime, not our code. Delete once /api/send is fixed. */
export default function handler(_req: unknown, res: { status: (c: number) => { json: (b: unknown) => void } }) {
    res.status(200).json({ ok: true, probe: "bare", node: process.version });
}
