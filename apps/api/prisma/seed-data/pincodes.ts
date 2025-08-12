export interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  region: string;
  deliveryDays: number; // Estimated delivery days
}

export const pincodesData: PincodeData[] = [
  // Delhi NCR
  { pincode: '110001', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110002', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110003', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110005', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110006', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110007', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110008', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110009', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110010', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110011', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110012', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110013', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110014', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110015', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110016', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110017', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110018', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110019', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  { pincode: '110020', city: 'New Delhi', state: 'Delhi', region: 'North', deliveryDays: 1 },
  
  // Gurgaon
  { pincode: '122001', city: 'Gurgaon', state: 'Haryana', region: 'North', deliveryDays: 1 },
  { pincode: '122002', city: 'Gurgaon', state: 'Haryana', region: 'North', deliveryDays: 1 },
  { pincode: '122003', city: 'Gurgaon', state: 'Haryana', region: 'North', deliveryDays: 1 },
  { pincode: '122004', city: 'Gurgaon', state: 'Haryana', region: 'North', deliveryDays: 1 },
  { pincode: '122005', city: 'Gurgaon', state: 'Haryana', region: 'North', deliveryDays: 1 },
  
  // Noida
  { pincode: '201301', city: 'Noida', state: 'Uttar Pradesh', region: 'North', deliveryDays: 1 },
  { pincode: '201302', city: 'Noida', state: 'Uttar Pradesh', region: 'North', deliveryDays: 1 },
  { pincode: '201303', city: 'Noida', state: 'Uttar Pradesh', region: 'North', deliveryDays: 1 },
  { pincode: '201304', city: 'Noida', state: 'Uttar Pradesh', region: 'North', deliveryDays: 1 },
  { pincode: '201305', city: 'Noida', state: 'Uttar Pradesh', region: 'North', deliveryDays: 1 },
  
  // Mumbai
  { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400002', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400003', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400004', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400005', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400006', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400007', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400008', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400009', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400010', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400011', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400012', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400013', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400014', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400015', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400016', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400017', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400018', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400019', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '400020', city: 'Mumbai', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  
  // Bangalore
  { pincode: '560001', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560002', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560003', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560004', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560005', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560006', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560007', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560008', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560009', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560010', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560011', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560012', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560013', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560014', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560015', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560016', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560017', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560018', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560019', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  { pincode: '560020', city: 'Bangalore', state: 'Karnataka', region: 'South', deliveryDays: 2 },
  
  // Chennai
  { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  { pincode: '600002', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  { pincode: '600003', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  { pincode: '600004', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  { pincode: '600005', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  { pincode: '600006', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  { pincode: '600007', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  { pincode: '600008', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  { pincode: '600009', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  { pincode: '600010', city: 'Chennai', state: 'Tamil Nadu', region: 'South', deliveryDays: 3 },
  
  // Kolkata
  { pincode: '700001', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  { pincode: '700002', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  { pincode: '700003', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  { pincode: '700004', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  { pincode: '700005', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  { pincode: '700006', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  { pincode: '700007', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  { pincode: '700008', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  { pincode: '700009', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  { pincode: '700010', city: 'Kolkata', state: 'West Bengal', region: 'East', deliveryDays: 3 },
  
  // Ahmedabad
  { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  { pincode: '380002', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  { pincode: '380003', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  { pincode: '380004', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  { pincode: '380005', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  { pincode: '380006', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  { pincode: '380007', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  { pincode: '380008', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  { pincode: '380009', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  { pincode: '380010', city: 'Ahmedabad', state: 'Gujarat', region: 'West', deliveryDays: 3 },
  
  // Pune
  { pincode: '411001', city: 'Pune', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '411002', city: 'Pune', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '411003', city: 'Pune', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '411004', city: 'Pune', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  { pincode: '411005', city: 'Pune', state: 'Maharashtra', region: 'West', deliveryDays: 2 },
  
  // Hyderabad
  { pincode: '500001', city: 'Hyderabad', state: 'Telangana', region: 'South', deliveryDays: 3 },
  { pincode: '500002', city: 'Hyderabad', state: 'Telangana', region: 'South', deliveryDays: 3 },
  { pincode: '500003', city: 'Hyderabad', state: 'Telangana', region: 'South', deliveryDays: 3 },
  { pincode: '500004', city: 'Hyderabad', state: 'Telangana', region: 'South', deliveryDays: 3 },
  { pincode: '500005', city: 'Hyderabad', state: 'Telangana', region: 'South', deliveryDays: 3 },
];

// Helper function to get random pincode
export function getRandomPincode(): PincodeData {
  return pincodesData[Math.floor(Math.random() * pincodesData.length)];
}

// Helper function to get pincodes by region
export function getPincodesByRegion(region: string): PincodeData[] {
  return pincodesData.filter(p => p.region === region);
}

// Helper function to get delivery days by pincode
export function getDeliveryDays(pincode: string): number {
  const pincodeData = pincodesData.find(p => p.pincode === pincode);
  return pincodeData?.deliveryDays || 5; // Default 5 days for unknown pincodes
}