import { getUserName } from '../shared/GetUserName';

export const REVIEWS_PER_PAGE = 8;

/** Extract { name, email } from a rating record, handling populated / bare-ID shapes */
export function resolveUser(r) {
  const name   = getUserName(r);                              // handles r.userId / r.user / flat fields
  const person = r.userId ?? r.user ?? null;
  const email  =
    (person && typeof person === 'object' ? person.email : null) ??
    r.email ??
    '';
  return { name, email };
}

/** Map a numeric star value to a human-readable label + Tailwind classes */
export function ratingLabel(val) {
  if (val >= 5) return { text: 'ممتاز',    cls: 'bg-green-50  text-green-600  border-green-100'  };
  if (val >= 4) return { text: 'جيد جداً', cls: 'bg-blue-50   text-blue-600   border-blue-100'   };
  if (val >= 3) return { text: 'جيد',      cls: 'bg-amber-50  text-amber-600  border-amber-100'  };
  return              { text: 'ضعيف',     cls: 'bg-red-50    text-red-600    border-red-100'    };
}