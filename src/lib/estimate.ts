/* ============================================================
   Estimate form choices.

   Shared by the form (src) and the API (api/send.ts) so the two
   can never drift. `label` is what the customer sees (keep it at
   a 3rd-grade reading level). `ghl` must match an option on the
   matching GHL dropdown EXACTLY, or GHL silently drops it:
     service   -> contact.service_needed
     situation -> contact.project_type
     timeline  -> contact.timeline
   ============================================================ */

export interface Choice {
    value: string;
    label: string;
    ghl: string;
}

export const SERVICES: Choice[] = [
    { value: "interior", label: "Inside", ghl: "Interior Painting" },
    { value: "exterior", label: "Outside", ghl: "Exterior Painting" },
    { value: "interior-exterior", label: "Inside and outside", ghl: "Interior + Exterior" },
    { value: "cabinets", label: "Cabinets", ghl: "Cabinet Refinishing" },
    { value: "other", label: "Something else", ghl: "Other" },
];

export const SITUATIONS: Choice[] = [
    { value: "moving-in", label: "I just moved in", ghl: "Just bought or moving in" },
    { value: "selling", label: "I'm selling my home", ghl: "Getting the home ready to sell" },
    { value: "update", label: "I want a new look", ghl: "Want to update the look" },
    { value: "worn", label: "My paint is old", ghl: "Paint is old or worn" },
    { value: "not-sure", label: "Not sure yet", ghl: "Not sure yet" },
];

export const TIMELINES: Choice[] = [
    { value: "asap", label: "Right away", ghl: "ASAP" },
    { value: "7-days", label: "This week", ghl: "Within 7 days" },
    { value: "30-days", label: "This month", ghl: "Within 30 days" },
    { value: "researching", label: "Just looking", ghl: "Just researching" },
];

export const byValue = (list: Choice[], value: string) => list.find((c) => c.value === value);
