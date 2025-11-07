// Barangays in Silago, Southern Leyte, Philippines
// Coordinates are approximate and should be verified/adjusted for production use
export const SILAGO_BARANGAYS = [
  {
    name: 'Abgao',
    lat: 10.5500,
    lng: 125.2600,
    value: 'abgao'
  },
  {
    name: 'Babayongan',
    lat: 10.5450,
    lng: 125.2550,
    value: 'babayongan'
  },
  {
    name: 'Biasong',
    lat: 10.5380,
    lng: 125.2580,
    value: 'biasong'
  },
  {
    name: 'Bontoc',
    lat: 10.5420,
    lng: 125.2620,
    value: 'bontoc'
  },
  {
    name: 'Buenavista',
    lat: 10.5350,
    lng: 125.2500,
    value: 'buenavista'
  },
  {
    name: 'Cabugao',
    lat: 10.5480,
    lng: 125.2570,
    value: 'cabugao'
  },
  {
    name: 'Cagtinae',
    lat: 10.5320,
    lng: 125.2540,
    value: 'cagtinae'
  },
  {
    name: 'Casuluhan',
    lat: 10.5400,
    lng: 125.2590,
    value: 'casuluhan'
  },
  {
    name: 'Hingatungan',
    lat: 10.5550,
    lng: 125.2650,
    value: 'hingatungan'
  },
  {
    name: 'Hindang',
    lat: 10.5300,
    lng: 125.2480,
    value: 'hindang'
  },
  {
    name: 'Laguma',
    lat: 10.5280,
    lng: 125.2520,
    value: 'laguma'
  },
  {
    name: 'Lawgawan',
    lat: 10.5460,
    lng: 125.2610,
    value: 'lawgawan'
  },
  {
    name: 'Napantao',
    lat: 10.5370,
    lng: 125.2560,
    value: 'napantao'
  },
  {
    name: 'Pangi',
    lat: 10.5440,
    lng: 125.2630,
    value: 'pangi'
  },
  {
    name: 'Poblacion (Central Silago)',
    lat: 10.5383,
    lng: 125.2572,
    value: 'poblacion'
  },
  {
    name: 'San Isidro',
    lat: 10.5340,
    lng: 125.2600,
    value: 'san_isidro'
  },
  {
    name: 'Timba',
    lat: 10.5290,
    lng: 125.2550,
    value: 'timba'
  },
  {
    name: 'Tubod',
    lat: 10.5510,
    lng: 125.2590,
    value: 'tubod'
  }
];

// Helper function to get barangay by value
export const getBarangayByValue = (value) => {
  return SILAGO_BARANGAYS.find(b => b.value === value);
};

// Helper function to get barangay by name
export const getBarangayByName = (name) => {
  return SILAGO_BARANGAYS.find(b => b.name.toLowerCase() === name.toLowerCase());
};

// Center of Silago for map initialization
export const SILAGO_CENTER = {
  lat: 10.5383,
  lng: 125.2572,
  name: 'Silago, Southern Leyte'
};

export default {
  SILAGO_BARANGAYS,
  getBarangayByValue,
  getBarangayByName,
  SILAGO_CENTER
};
