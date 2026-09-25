/* Temporary diagnostic: loads each api/ helper on its own and reports the
   real error instead of crashing the whole function. Delete when fixed. */
export default async function handler(_req: unknown, res: { status: (c: number) => { json: (b: unknown) => void } }) {
    const out: Record<string, string> = { node: process.version };
    const tries: Array<[string, () => Promise<unknown>]> = [
        ["_site", () => import("./_site")],
        ["_estimate", () => import("./_estimate")],
        ["_spam", () => import("./_spam")],
        ["_ghl", () => import("./_ghl")],
        ["_meta", () => import("./_meta")],
    ];
    for (const [name, load] of tries) {
        try {
            await load();
            out[name] = "ok";
        } catch (err) {
            out[name] = err instanceof Error ? `${err.name}: ${err.message}`.slice(0, 300) : String(err).slice(0, 300);
        }
    }
    res.status(200).json(out);
}
