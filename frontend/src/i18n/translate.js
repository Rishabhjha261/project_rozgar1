// For this take-home we avoid shipping Google credentials to the browser.
// This function acts as an abstraction point: later, replace with a backend proxy
// that calls Google Cloud Translation securely.

const MOCK = {
  hi: {
    'Home Maid (Cooking + Cleaning)': 'घर की मेड (खाना + सफाई)',
    'Personal Driver (Car)': 'पर्सनल ड्राइवर (कार)',
    'Delivery Partner (2-Wheeler)': 'डिलीवरी पार्टनर (2-व्हीलर)',
    'Security Guard (Night Shift)': 'सिक्योरिटी गार्ड (नाइट शिफ्ट)',
    'Electrician (Home Visits)': 'इलेक्ट्रीशियन (होम विजिट)',
    'Plumber (Society Maintenance)': 'प्लंबर (सोसायटी मेंटेनेंस)',
    'Construction Labour (Daily Wage)': 'निर्माण मजदूर (दैनिक मजदूरी)',
    'Restaurant Waiter': 'रेस्टोरेंट वेटर',
  },
  te: {
    'Home Maid (Cooking + Cleaning)': 'ఇంటి పనిమనిషి (వంట + శుభ్రపరిచడం)',
    'Personal Driver (Car)': 'వ్యక్తిగత డ్రైవర్ (కారు)',
    'Delivery Partner (2-Wheeler)': 'డెలివరీ పార్టనర్ (2-వీలర్)',
    'Security Guard (Night Shift)': 'సెక్యూరిటీ గార్డ్ (నైట్ షిఫ్ట్)',
    'Electrician (Home Visits)': 'ఎలక్ట్రిషియన్ (హోమ్ విజిట్స్)',
    'Plumber (Society Maintenance)': 'ప్లంబర్ (సొసైటీ మెయింటెనెన్స్)',
    'Construction Labour (Daily Wage)': 'నిర్మాణ కూలీ (రోజువారీ వేతనం)',
    'Restaurant Waiter': 'రెస్టారెంట్ వెయిటర్',
  },
  bn: {
    'Home Maid (Cooking + Cleaning)': 'গৃহকর্মী (রান্না + পরিষ্কার)',
    'Personal Driver (Car)': 'ব্যক্তিগত ড্রাইভার (গাড়ি)',
    'Delivery Partner (2-Wheeler)': 'ডেলিভারি পার্টনার (2-হুইলার)',
    'Security Guard (Night Shift)': 'সিকিউরিটি গার্ড (নাইট শিফট)',
    'Electrician (Home Visits)': 'ইলেক্ট্রিশিয়ান (হোম ভিজিট)',
    'Plumber (Society Maintenance)': 'প্লাম্বার (সোসাইটি মেইনটেন্যান্স)',
    'Construction Labour (Daily Wage)': 'নির্মাণ মজুর (দৈনিক মজুরি)',
    'Restaurant Waiter': 'রেস্তোরাঁ ওয়েটার',
  },
  mr: {
    'Home Maid (Cooking + Cleaning)': 'घरकामवाली (स्वयंपाक + साफसफाई)',
    'Personal Driver (Car)': 'पर्सनल ड्रायव्हर (कार)',
    'Delivery Partner (2-Wheeler)': 'डिलिव्हरी पार्टनर (2-व्हीलर)',
    'Security Guard (Night Shift)': 'सिक्युरिटी गार्ड (नाईट शिफ्ट)',
    'Electrician (Home Visits)': 'इलेक्ट्रीशियन (होम व्हिजिट)',
    'Plumber (Society Maintenance)': 'प्लंबर (सोसायटी मेंटेनन्स)',
    'Construction Labour (Daily Wage)': 'बांधकाम मजूर (दैनिक मजुरी)',
    'Restaurant Waiter': 'रेस्टॉरंट वेटर',
  },
}

export async function translateText(text, targetLang) {
  if (!text) return ''
  if (!targetLang || targetLang === 'en') return text

  const hit = MOCK[targetLang]?.[text]
  if (hit) return hit

  // fallback: keep original for now
  return text
}
