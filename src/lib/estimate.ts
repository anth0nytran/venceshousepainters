/* ============================================================
   Estimate form choices.

   Shared by the form (src) and the API (api/send.ts) so the two
   can never drift. Each `ghl` value must match an option on the
   matching GHL dropdown field EXACTLY, or GHL silently drops it:
     service   -> contact.service_needed
     situation -> contact.project_type
     timeline  -> contact.timeline
   ============================================================ */

export interface Choice {
    value: string;
    label: string;
    hint?: string;
    ghl: string;
}

export const SERVICES: Choice[] = [
    { value: "interior", label: "Interior painting", hint: "Walls, ceilings, trim", ghl: "Interior Painting" },
    { value: "exterior", label: "Exterior painting", hint: "Siding, trim, doors, fascia", ghl: "Exterior Painting" },
    { value: "interior-exterior", label: "Inside and outside", hint: "The whole house", ghl: "Interior + Exterior" },
    { value: "cabinets", label: "Cabinets", hint: "Kitchen or bathroom cabinet refinishing", ghl: "Cabinet Refinishing" },
    { value: "trim-doors", label: "Trim, doors and baseboards", ghl: "Trim, Doors & Baseboards" },
    { value: "drywall", label: "Drywall and repair work", ghl: "Drywall & Repair Work" },
    { value: "commercial", label: "Commercial property", ghl: "Commercial Painting" },
    { value: "other", label: "Something else", ghl: "Other" },
];

export const SITUATIONS: Choice[] = [
    { value: "moving-in", label: "I just bought the home or I'm moving in", ghl: "Just bought or moving in" },
    { value: "selling", label: "I'm getting the home ready to sell", ghl: "Getting the home ready to sell" },
    { value: "update", label: "I want to update the look", ghl: "Want to update the look" },
    { value: "worn", label: "The paint is old or worn", ghl: "Paint is old or worn" },
    { value: "repairs", label: "There are repairs to fix first", ghl: "Repairs needed before painting" },
    { value: "not-sure", label: "Not sure yet", ghl: "Not sure yet" },
];

export const TIMELINES: Choice[] = [
    { value: "asap", label: "As soon as possible", ghl: "ASAP" },
    { value: "7-days", label: "Within the next week", ghl: "Within 7 days" },
    { value: "30-days", label: "Within the next month", ghl: "Within 30 days" },
    { value: "researching", label: "Just planning for now", ghl: "Just researching" },
];

export const byValue = (list: Choice[], value: string) => list.find((c) => c.value === value);
