'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/auth';

// Add country codes mapping
const countryPhoneCodes: { [key: string]: string } = {
  "Afghanistan": "+93",
  "Albania": "+355",
  "Algeria": "+213",
  "Andorra": "+376",
  "Angola": "+244",
  "Antigua and Barbuda": "+1-268",
  "Argentina": "+54",
  "Armenia": "+374",
  "Australia": "+61",
  "Austria": "+43",
  "Azerbaijan": "+994",
  "Bahamas": "+1-242",
  "Bahrain": "+973",
  "Bangladesh": "+880",
  "Barbados": "+1-246",
  "Belarus": "+375",
  "Belgium": "+32",
  "Belize": "+501",
  "Benin": "+229",
  "Bhutan": "+975",
  "Bolivia": "+591",
  "Bosnia and Herzegovina": "+387",
  "Botswana": "+267",
  "Brazil": "+55",
  "Brunei": "+673",
  "Bulgaria": "+359",
  "Burkina Faso": "+226",
  "Burundi": "+257",
  "Cabo Verde": "+238",
  "Cambodia": "+855",
  "Cameroon": "+237",
  "Canada": "+1",
  "Central African Republic": "+236",
  "Chad": "+235",
  "Chile": "+56",
  "China": "+86",
  "Colombia": "+57",
  "Comoros": "+269",
  "Congo": "+242",
  "Costa Rica": "+506",
  "Croatia": "+385",
  "Cuba": "+53",
  "Cyprus": "+357",
  "Czech Republic": "+420",
  "Denmark": "+45",
  "Djibouti": "+253",
  "Dominica": "+1-767",
  "Dominican Republic": "+1-809",
  "Ecuador": "+593",
  "Egypt": "+20",
  "El Salvador": "+503",
  "Equatorial Guinea": "+240",
  "Eritrea": "+291",
  "Estonia": "+372",
  "Eswatini": "+268",
  "Ethiopia": "+251",
  "Fiji": "+679",
  "Finland": "+358",
  "France": "+33",
  "Gabon": "+241",
  "Gambia": "+220",
  "Georgia": "+995",
  "Germany": "+49",
  "Ghana": "+233",
  "Greece": "+30",
  "Grenada": "+1-473",
  "Guatemala": "+502",
  "Guinea": "+224",
  "Guinea-Bissau": "+245",
  "Guyana": "+592",
  "Haiti": "+509",
  "Honduras": "+504",
  "Hungary": "+36",
  "Iceland": "+354",
  "India": "+91",
  "Indonesia": "+62",
  "Iran": "+98",
  "Iraq": "+964",
  "Ireland": "+353",
  "Israel": "+972",
  "Italy": "+39",
  "Jamaica": "+1-876",
  "Japan": "+81",
  "Jordan": "+962",
  "Kazakhstan": "+7",
  "Kenya": "+254",
  "Kiribati": "+686",
  "Korea, North": "+850",
  "Korea, South": "+82",
  "Kuwait": "+965",
  "Kyrgyzstan": "+996",
  "Laos": "+856",
  "Latvia": "+371",
  "Lebanon": "+961",
  "Lesotho": "+266",
  "Liberia": "+231",
  "Libya": "+218",
  "Liechtenstein": "+423",
  "Lithuania": "+370",
  "Luxembourg": "+352",
  "Madagascar": "+261",
  "Malawi": "+265",
  "Malaysia": "+60",
  "Maldives": "+960",
  "Mali": "+223",
  "Malta": "+356",
  "Marshall Islands": "+692",
  "Mauritania": "+222",
  "Mauritius": "+230",
  "Mexico": "+52",
  "Micronesia": "+691",
  "Moldova": "+373",
  "Monaco": "+377",
  "Mongolia": "+976",
  "Montenegro": "+382",
  "Morocco": "+212",
  "Mozambique": "+258",
  "Myanmar": "+95",
  "Namibia": "+264",
  "Nauru": "+674",
  "Nepal": "+977",
  "Netherlands": "+31",
  "New Zealand": "+64",
  "Nicaragua": "+505",
  "Niger": "+227",
  "Nigeria": "+234",
  "North Macedonia": "+389",
  "Norway": "+47",
  "Oman": "+968",
  "Pakistan": "+92",
  "Palau": "+680",
  "Palestine": "+970",
  "Panama": "+507",
  "Papua New Guinea": "+675",
  "Paraguay": "+595",
  "Peru": "+51",
  "Philippines": "+63",
  "Poland": "+48",
  "Portugal": "+351",
  "Qatar": "+974",
  "Romania": "+40",
  "Russia": "+7",
  "Rwanda": "+250",
  "Saint Kitts and Nevis": "+1-869",
  "Saint Lucia": "+1-758",
  "Saint Vincent and the Grenadines": "+1-784",
  "Samoa": "+685",
  "San Marino": "+378",
  "Sao Tome and Principe": "+239",
  "Saudi Arabia": "+966",
  "Senegal": "+221",
  "Serbia": "+381",
  "Seychelles": "+248",
  "Sierra Leone": "+232",
  "Singapore": "+65",
  "Slovakia": "+421",
  "Slovenia": "+386",
  "Solomon Islands": "+677",
  "Somalia": "+252",
  "South Africa": "+27",
  "South Sudan": "+211",
  "Spain": "+34",
  "Sri Lanka": "+94",
  "Sudan": "+249",
  "Suriname": "+597",
  "Sweden": "+46",
  "Switzerland": "+41",
  "Syria": "+963",
  "Taiwan": "+886",
  "Tajikistan": "+992",
  "Tanzania": "+255",
  "Thailand": "+66",
  "Timor-Leste": "+670",
  "Togo": "+228",
  "Tonga": "+676",
  "Trinidad and Tobago": "+1-868",
  "Tunisia": "+216",
  "Turkey": "+90",
  "Turkmenistan": "+993",
  "Tuvalu": "+688",
  "Uganda": "+256",
  "Ukraine": "+380",
  "United Arab Emirates": "+971",
  "United Kingdom": "+44",
  "United States": "+1",
  "Uruguay": "+598",
  "Uzbekistan": "+998",
  "Vanuatu": "+678",
  "Vatican City": "+379",
  "Venezuela": "+58",
  "Vietnam": "+84",
  "Yemen": "+967",
  "Zambia": "+260",
  "Zimbabwe": "+263"
};

// Add country flags mapping
const countryFlags: { [key: string]: string } = {
  "Afghanistan": "🇦🇫",
  "Albania": "🇦🇱",
  "Algeria": "🇩🇿",
  "Andorra": "🇦🇩",
  "Angola": "🇦🇴",
  "Antigua and Barbuda": "🇦🇬",
  "Argentina": "🇦🇷",
  "Armenia": "🇦🇲",
  "Australia": "🇦🇺",
  "Austria": "🇦🇹",
  "Azerbaijan": "🇦🇿",
  "Bahamas": "🇧🇸",
  "Bahrain": "🇧🇭",
  "Bangladesh": "🇧🇩",
  "Barbados": "🇧🇧",
  "Belarus": "🇧🇾",
  "Belgium": "🇧🇪",
  "Belize": "🇧🇿",
  "Benin": "🇧🇯",
  "Bhutan": "🇧🇹",
  "Bolivia": "🇧🇴",
  "Bosnia and Herzegovina": "🇧🇦",
  "Botswana": "🇧🇼",
  "Brazil": "🇧🇷",
  "Brunei": "🇧🇳",
  "Bulgaria": "🇧🇬",
  "Burkina Faso": "🇧🇫",
  "Burundi": "🇧🇮",
  "Cabo Verde": "🇨🇻",
  "Cambodia": "🇰🇭",
  "Cameroon": "🇨🇲",
  "Canada": "🇨🇦",
  "Central African Republic": "🇨🇫",
  "Chad": "🇹🇩",
  "Chile": "🇨🇱",
  "China": "🇨🇳",
  "Colombia": "🇨🇴",
  "Comoros": "🇰🇲",
  "Congo": "🇨🇬",
  "Costa Rica": "🇨🇷",
  "Croatia": "🇭🇷",
  "Cuba": "🇨🇺",
  "Cyprus": "🇨🇾",
  "Czech Republic": "🇨🇿",
  "Denmark": "🇩🇰",
  "Djibouti": "🇩🇯",
  "Dominica": "🇩🇲",
  "Dominican Republic": "🇩🇴",
  "Ecuador": "🇪🇨",
  "Egypt": "🇪🇬",
  "El Salvador": "🇸🇻",
  "Equatorial Guinea": "🇬🇶",
  "Eritrea": "🇪🇷",
  "Estonia": "🇪🇪",
  "Eswatini": "🇸🇿",
  "Ethiopia": "🇪🇹",
  "Fiji": "🇫🇯",
  "Finland": "🇫🇮",
  "France": "🇫🇷",
  "Gabon": "🇬🇦",
  "Gambia": "🇬🇲",
  "Georgia": "🇬🇪",
  "Germany": "🇩🇪",
  "Ghana": "🇬🇭",
  "Greece": "🇬🇷",
  "Grenada": "🇬🇩",
  "Guatemala": "🇬🇹",
  "Guinea": "🇬🇳",
  "Guinea-Bissau": "🇬🇼",
  "Guyana": "🇬🇾",
  "Haiti": "🇭🇹",
  "Honduras": "🇭🇳",
  "Hungary": "🇭🇺",
  "Iceland": "🇮🇸",
  "India": "🇮🇳",
  "Indonesia": "🇮🇩",
  "Iran": "🇮🇷",
  "Iraq": "🇮🇶",
  "Ireland": "🇮🇪",
  "Israel": "🇮🇱",
  "Italy": "🇮🇹",
  "Jamaica": "🇯🇲",
  "Japan": "🇯🇵",
  "Jordan": "🇯🇴",
  "Kazakhstan": "🇰🇿",
  "Kenya": "🇰🇪",
  "Kiribati": "🇰🇮",
  "Korea, North": "🇰🇵",
  "Korea, South": "🇰🇷",
  "Kuwait": "🇰🇼",
  "Kyrgyzstan": "🇰🇬",
  "Laos": "🇱🇦",
  "Latvia": "🇱🇻",
  "Lebanon": "🇱🇧",
  "Lesotho": "🇱🇸",
  "Liberia": "🇱🇷",
  "Libya": "🇱🇾",
  "Liechtenstein": "🇱🇮",
  "Lithuania": "🇱🇹",
  "Luxembourg": "🇱🇺",
  "Madagascar": "🇲🇬",
  "Malawi": "🇲🇼",
  "Malaysia": "🇲🇾",
  "Maldives": "🇲🇻",
  "Mali": "🇲🇱",
  "Malta": "🇲🇹",
  "Marshall Islands": "🇲🇭",
  "Mauritania": "🇲🇷",
  "Mauritius": "🇲🇺",
  "Mexico": "🇲🇽",
  "Micronesia": "🇫🇲",
  "Moldova": "🇲🇩",
  "Monaco": "🇲🇨",
  "Mongolia": "🇲🇳",
  "Montenegro": "🇲🇪",
  "Morocco": "🇲🇦",
  "Mozambique": "🇲🇿",
  "Myanmar": "🇲🇲",
  "Namibia": "🇳🇦",
  "Nauru": "🇳🇷",
  "Nepal": "🇳🇵",
  "Netherlands": "🇳🇱",
  "New Zealand": "🇳🇿",
  "Nicaragua": "🇳🇮",
  "Niger": "🇳🇪",
  "Nigeria": "🇳🇬",
  "North Macedonia": "🇲🇰",
  "Norway": "🇳🇴",
  "Oman": "🇴🇲",
  "Pakistan": "🇵🇰",
  "Palau": "🇵🇼",
  "Palestine": "🇵🇸",
  "Panama": "🇵🇦",
  "Papua New Guinea": "🇵🇬",
  "Paraguay": "🇵🇾",
  "Peru": "🇵🇪",
  "Philippines": "🇵🇭",
  "Poland": "🇵🇱",
  "Portugal": "🇵🇹",
  "Qatar": "🇶🇦",
  "Romania": "🇷🇴",
  "Russia": "🇷🇺",
  "Rwanda": "🇷🇼",
  "Saint Kitts and Nevis": "🇰🇳",
  "Saint Lucia": "🇱🇨",
  "Saint Vincent and the Grenadines": "🇻🇨",
  "Samoa": "🇼🇸",
  "San Marino": "🇸🇲",
  "Sao Tome and Principe": "🇸🇹",
  "Saudi Arabia": "🇸🇦",
  "Senegal": "🇸🇳",
  "Serbia": "🇷🇸",
  "Seychelles": "🇸🇨",
  "Sierra Leone": "🇸🇱",
  "Singapore": "🇸🇬",
  "Slovakia": "🇸🇰",
  "Slovenia": "🇸🇮",
  "Solomon Islands": "🇸🇧",
  "Somalia": "🇸🇴",
  "South Africa": "🇿🇦",
  "South Sudan": "🇸🇸",
  "Spain": "🇪🇸",
  "Sri Lanka": "🇱🇰",
  "Sudan": "🇸🇩",
  "Suriname": "🇸🇷",
  "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭",
  "Syria": "🇸🇾",
  "Taiwan": "🇹🇼",
  "Tajikistan": "🇹🇯",
  "Tanzania": "🇹🇿",
  "Thailand": "🇹🇭",
  "Timor-Leste": "🇹🇱",
  "Togo": "🇹🇬",
  "Tonga": "🇹🇴",
  "Trinidad and Tobago": "🇹🇹",
  "Tunisia": "🇹🇳",
  "Turkey": "🇹🇷",
  "Turkmenistan": "🇹🇲",
  "Tuvalu": "🇹🇻",
  "Uganda": "🇺🇬",
  "Ukraine": "🇺🇦",
  "United Arab Emirates": "🇦🇪",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  "Uruguay": "🇺🇾",
  "Uzbekistan": "🇺🇿",
  "Vanuatu": "🇻🇺",
  "Vatican City": "🇻🇦",
  "Venezuela": "🇻🇪",
  "Vietnam": "🇻🇳",
  "Yemen": "🇾🇪",
  "Zambia": "🇿🇲",
  "Zimbabwe": "🇿🇼"
};

// Add countries array at the top
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde",
  "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    accountOwnership: 'individual'
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    // Validate password match and length
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      
      // Set user in auth store
      setUser(data.user);
      
      // Redirect to profile page
      router.push('/profile');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Create Your Account</h2>
          <p className="mt-2 text-sm text-gray-300">
            Fill in your information to get started
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/20">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Registration successful! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="accountOwnership" className="block text-sm font-medium text-gray-700">
                Account Ownership
              </label>
              <select
                id="accountOwnership"
                value={formData.accountOwnership}
                onChange={(e) => setFormData({ ...formData, accountOwnership: e.target.value as 'individual' | 'shared' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="individual">Individual</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}