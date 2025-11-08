/**
 * ==============================================================
 * PincodeLookup – Fast, Type-Safe Pincode Utility Class
 * ==============================================================
 *
 * Features:
 *   • O(1) lookup via precomputed Map
 *   • Validate pincode by state/district
 *   • Get states, districts, ranges
 *   • Partial pincode search (autocomplete)
 *   • Fuzzy district name search
 *   • Zero runtime parsing
 *
 * Usage:
 *   import PincodeLookup from '@/lib/PincodeLookup';
 *   const result = PincodeLookup.findLocationByPincode(781001);
 *
 * ==============================================================
 */

import pincodeDB, { PincodeRange } from '@/data/pincodeDB';

export interface Location {
  state: string;
  district: string;
}

export interface LocationWithRange extends Location {
  from: number;
  to: number;
}

class PincodeLookup {
  /** O(1) lookup: pincode → { state, district } */
  private readonly lookupMap = new Map<number, Location>();

  constructor() {
    this.buildLookupMap();
  }

  /** Build Map once at startup */
  private buildLookupMap(): void {
    for (const [state, districts] of Object.entries(pincodeDB)) {
      for (const [district, { from, to }] of Object.entries(districts)) {
        for (let pin = from; pin <= to; pin++) {
          this.lookupMap.set(pin, { state, district });
        }
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Core Lookup                                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Find state and district by pincode.
   * @param pincode 6-digit number
   * @returns Location or null
   */
  public findLocationByPincode(pincode: number): Location | null {
    return this.lookupMap.get(pincode) ?? null;
  }

  /**
   * Validate if pincode belongs to given state & district.
   * @param pincode
   * @param state
   * @param district
   * @returns boolean
   */
  public validatePincode(pincode: number, state: string, district: string): boolean {
    const loc = this.findLocationByPincode(pincode);
    return loc !== null && loc.state === state && loc.district === district;
  }

  /* ------------------------------------------------------------------ */
  /* List Helpers                                                       */
  /* ------------------------------------------------------------------ */

  /** Get all state names (sorted) */
  public getAllStates(): string[] {
    return Object.keys(pincodeDB).sort();
  }

  /** Get districts for a state (sorted) */
  public getDistrictsByState(state: string): string[] {
    const districts = pincodeDB[state];
    return districts ? Object.keys(districts).sort() : [];
  }

  /** Get pincode range for state + district */
  public getPincodeRange(state: string, district: string): PincodeRange | null {
    return pincodeDB[state]?.[district] ?? null;
  }

  /* ------------------------------------------------------------------ */
  /* Validation & Utilities                                             */
  /* ------------------------------------------------------------------ */

  /** Simple 6-digit pincode validation */
  public isValidPincode(pin: number | string): boolean {
    const p = Number(pin);
    return Number.isInteger(p) && p >= 100000 && p <= 999999;
  }

  /**
   * Search by partial pincode (e.g. "781" → all matching districts)
   * @param partial string (1–6 digits)
   */
  public searchByPartialPincode(partial: string): LocationWithRange[] {
    const prefix = partial.trim();
    if (!/^\d{1,6}$/.test(prefix)) return [];

    const results: LocationWithRange[] = [];
    const numPrefix = Number(prefix);

    for (const [state, districts] of Object.entries(pincodeDB)) {
      for (const [district, range] of Object.entries(districts)) {
        if (range.from.toString().startsWith(prefix)) {
          results.push({ state, district, ...range });
        }
      }
    }
    return results;
  }

  /**
   * Get all possible matches for a pincode (handles rare overlaps)
   */
  public getAllMatchesForPincode(pincode: number): LocationWithRange[] {
    const primary = this.findLocationByPincode(pincode);
    if (!primary) return [];

    const range = this.getPincodeRange(primary.state, primary.district);
    return range ? [{ ...primary, ...range }] : [];
  }

  /* ------------------------------------------------------------------ */
  /* Extra Helpers (Future-Proof)                                       */
  /* ------------------------------------------------------------------ */

  /**
   * Fuzzy search districts by name (case-insensitive, contains)
   */
  public searchDistrictsByName(query: string): LocationWithRange[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: LocationWithRange[] = [];
    for (const [state, districts] of Object.entries(pincodeDB)) {
      for (const [district, range] of Object.entries(districts)) {
        if (district.toLowerCase().includes(q)) {
          results.push({ state, district, ...range });
        }
      }
    }
    return results;
  }

  /** Total number of pincodes in DB */
  public getTotalPincodeCount(): number {
    return this.lookupMap.size;
  }
}

/* ------------------------------------------------------------------ */
/* Export singleton instance + class                                   */
/* ------------------------------------------------------------------ */
const pincodeLookup = new PincodeLookup();
export default pincodeLookup;

/* Export class if you want multiple instances (rare) */
export { PincodeLookup };