// lib/utils.ts

export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  return doc;
}

export const formatNumber = (x: number | null | undefined) => {
  if (x === null || x === undefined) {
    return '0';  // Możesz tutaj ustawić domyślną wartość, jeśli `x` jest null lub undefined
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


export const formatId = (x: string) => {
  return `..${x.substring(20, 24)}`;
}

// Funkcja pobierająca status Guest Checkout z publicznego API
export const getGuestCheckoutStatus = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/guest-checkout`);
    if (!res.ok) throw new Error('Failed to fetch guest checkout status');
    const data = await res.json();
    return data.success ? data.data.isGuestCheckoutEnabled : false;
  } catch (error) {
    console.error('Error fetching guest checkout status:', error);
    return false;
  }
};
