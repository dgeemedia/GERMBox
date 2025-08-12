// api.mjs
let cachedRates = null;

export async function getExchangeRates() {
  // If rates are already cached in memory, return them
  if (cachedRates) {
    return cachedRates;
  }

  // Also check sessionStorage in case page is reloaded
  const storedData = sessionStorage.getItem('exchangeRates');
  if (storedData) {
    cachedRates = JSON.parse(storedData);
    return cachedRates;
  }

  const API_KEY = '46b40cb5cd597fb786634e7b'; // store securely in production

  try {
    // Step 1: Detect user's country/currency
    const locRes = await fetch('https://ipapi.co/json/');
    if (!locRes.ok) throw new Error('Location API failed');
    const locData = await locRes.json();
    const currency = locData.currency || 'NGN'; // fallback to NGN if unknown

    // Step 2: Get exchange rates for detected currency
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currency}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Exchange rate API failed');

    const data = await res.json();

    // Build the final result
    cachedRates = {
      base: data.base_code,
      rates: data.conversion_rates,
      location: {
        country: locData.country_name,
        currency: currency
      }
    };

    // Save to sessionStorage for faster reloads
    sessionStorage.setItem('exchangeRates', JSON.stringify(cachedRates));

    return cachedRates;

  } catch (err) {
    console.error(err);
    return {
      base: 'NGN',
      rates: { USD: 0.0013, EUR: 0.0012, NGN: 1 },
      location: { country: 'Unknown', currency: 'NGN' }
    }; // fallback
  }
}

export async function getInstitutionLocations() {
  // Mock data for CBN institutions across Nigeria
  return [
    { name: 'CBN Headquarters, Abuja', lat: 9.0579, lng: 7.4951 },
    { name: 'CBN Branch, Lagos', lat: 6.5244, lng: 3.3792 },
    { name: 'CBN Branch, Kano', lat: 12.0022, lng: 8.5919 },
    { name: 'CBN Branch, Enugu', lat: 6.4483, lng: 7.5139 },
    { name: 'CBN Branch, Port Harcourt', lat: 4.8156, lng: 7.0498 }
  ];
}