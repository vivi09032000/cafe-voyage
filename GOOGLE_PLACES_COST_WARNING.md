# Google Places Cost Warning

## Why this file exists

Cafe Voyage previously incurred unexpected Google Places API charges after
running the bulk audit script:

- `scripts/audit-google-places-status.mjs`

That script performed large-volume audit requests across many cafes and cities,
including multiple Google Places calls per cafe:

- Nearby Search
- Text Search fallback
- Place Details

At scale, this can become expensive very quickly.

## Current policy

The bulk Google Places audit script is intentionally disabled.

We should **not** use Google Places as a broad batch-cleaning or full-dataset
refresh tool unless the billing model, quotas, and request volume are explicitly
reviewed first.

## What to avoid

Do **not**:

- run full-city or full-country Google Places audits
- loop over every Cafe Nomad record with Nearby Search / Text Search / Details
- use Google Places as a default data-cleaning pipeline
- re-enable the disabled audit script without a separate review

## Safer alternatives

Prefer:

1. Cafe Nomad as the primary Taiwan source
2. Supabase tables for manual overrides and status records
3. Small, manual Google checks for specific cafes only
4. Saving checked results into Supabase so we do not repeat the same paid calls

## If Google Places must be used again

Before any future Google Places work:

1. Confirm Google Cloud budget alerts are enabled
2. Confirm daily quotas are capped
3. Restrict the API key to the exact APIs needed
4. Test with a tiny sample first
5. Record expected request count before running
6. Add rate limiting and a hard stop
7. Prefer manual or curated checks over bulk sweeps

## Recommended future approach

If we ever revisit Places-based enrichment, it should be:

- manual
- capped
- sampled
- cached into Supabase

not a full automatic audit of the entire dataset.
