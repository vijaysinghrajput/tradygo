// Fixed UUIDs for deterministic seeding
export const VENDOR_IDS = {
  V1: '3f1a2b3c-4d5e-46f7-89a0-12b34c56d701',
  V2: '3f1a2b3c-4d5e-46f7-89a0-12b34c56d702',
  V3: '3f1a2b3c-4d5e-46f7-89a0-12b34c56d703',
  V4: '3f1a2b3c-4d5e-46f7-89a0-12b34c56d704',
  V5: '3f1a2b3c-4d5e-46f7-89a0-12b34c56d705',
};

// Fixed UUIDs for child entities
export const FIXED_IDS = {
  // Addresses
  ADDR_V1_REG: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d801',
  ADDR_V1_WARE: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d802',
  ADDR_V2_REG: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d803',
  ADDR_V2_WARE: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d804',
  ADDR_V3_REG: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d805',
  ADDR_V3_WARE: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d806',
  ADDR_V4_REG: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d807',
  ADDR_V4_WARE: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d808',
  ADDR_V5_REG: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d809',
  ADDR_V5_WARE: '4f1a2b3c-4d5e-46f7-89a0-12b34c56d810',
  
  // Bank Accounts
  BANK_V1: '5f1a2b3c-4d5e-46f7-89a0-12b34c56d901',
  BANK_V2: '5f1a2b3c-4d5e-46f7-89a0-12b34c56d902',
  BANK_V3: '5f1a2b3c-4d5e-46f7-89a0-12b34c56d903',
  BANK_V4: '5f1a2b3c-4d5e-46f7-89a0-12b34c56d904',
  BANK_V5: '5f1a2b3c-4d5e-46f7-89a0-12b34c56d905',
  
  // Commission Rules
  COMM_GLOBAL: '6f1a2b3c-4d5e-46f7-89a0-12b34c56da01',
  COMM_V1: '6f1a2b3c-4d5e-46f7-89a0-12b34c56da02',
  COMM_V2: '6f1a2b3c-4d5e-46f7-89a0-12b34c56da03',
  COMM_V4_CAT: '6f1a2b3c-4d5e-46f7-89a0-12b34c56da04',
  
  // Statements
  STMT_V1_JUN: '7f1a2b3c-4d5e-46f7-89a0-12b34c56db01',
  STMT_V1_JUL: '7f1a2b3c-4d5e-46f7-89a0-12b34c56db02',
  STMT_V2_JUN: '7f1a2b3c-4d5e-46f7-89a0-12b34c56db03',
  STMT_V2_JUL: '7f1a2b3c-4d5e-46f7-89a0-12b34c56db04',
  STMT_V4_JUN: '7f1a2b3c-4d5e-46f7-89a0-12b34c56db05',
  STMT_V4_JUL: '7f1a2b3c-4d5e-46f7-89a0-12b34c56db06',
  
  // Payouts
  PAYOUT_V1_1: '8f1a2b3c-4d5e-46f7-89a0-12b34c56dc01',
  PAYOUT_V2_1: '8f1a2b3c-4d5e-46f7-89a0-12b34c56dc02',
  PAYOUT_V4_1: '8f1a2b3c-4d5e-46f7-89a0-12b34c56dc03',
  PAYOUT_V4_FAIL: '8f1a2b3c-4d5e-46f7-89a0-12b34c56dc04',
  
  // Settings
  SET_V1: '9f1a2b3c-4d5e-46f7-89a0-12b34c56dd01',
  SET_V2: '9f1a2b3c-4d5e-46f7-89a0-12b34c56dd02',
  SET_V3: '9f1a2b3c-4d5e-46f7-89a0-12b34c56dd03',
  SET_V4: '9f1a2b3c-4d5e-46f7-89a0-12b34c56dd04',
  SET_V5: '9f1a2b3c-4d5e-46f7-89a0-12b34c56dd05',
};

export const vendorSeedData = {
  vendors: [
    {
      id: VENDOR_IDS.V1,
      name: 'Acme Retail',
      legalName: 'Acme Retail Private Limited',
      email: 'contact@acmeretail.com',
      phone: '9876543210',
      gstNumber: '29ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      status: 'ACTIVE' as const,
    },
    {
      id: VENDOR_IDS.V2,
      name: 'Bharat Electronics',
      legalName: 'Bharat Electronics Corporation',
      email: 'info@bharatelectronics.in',
      phone: '9876543211',
      gstNumber: '27FGHIJ5678G2A6',
      panNumber: 'FGHIJ5678G',
      status: 'ACTIVE' as const,
    },
    {
      id: VENDOR_IDS.V3,
      name: 'GreenLeaf Organics',
      legalName: 'GreenLeaf Organics LLP',
      email: 'hello@greenleaforganics.com',
      phone: '9876543212',
      gstNumber: '19KLMNO9012H3B7',
      panNumber: 'KLMNO9012H',
      status: 'PENDING' as const,
    },
    {
      id: VENDOR_IDS.V4,
      name: 'TrendyKart',
      legalName: 'TrendyKart Fashion Private Limited',
      email: 'support@trendykart.com',
      phone: '9876543213',
      gstNumber: '36PQRST3456I4C8',
      panNumber: 'PQRST3456I',
      status: 'ACTIVE' as const,
    },
    {
      id: VENDOR_IDS.V5,
      name: 'TechBazaar',
      legalName: 'TechBazaar Solutions India Private Limited',
      email: 'admin@techbazaar.in',
      phone: '9876543214',
      gstNumber: '07UVWXY7890J5D9',
      panNumber: 'UVWXY7890J',
      status: 'SUSPENDED' as const,
    },
  ],
  
  addresses: [
    // Acme Retail
    {
      id: FIXED_IDS.ADDR_V1_REG,
      vendorId: VENDOR_IDS.V1,
      line1: '123 Business Park',
      line2: 'Sector 18',
      city: 'Gurgaon',
      state: 'Haryana',
      country: 'India',
      postalCode: '122001',
      type: 'REGISTERED',
      isDefault: true,
    },
    {
      id: FIXED_IDS.ADDR_V1_WARE,
      vendorId: VENDOR_IDS.V1,
      line1: '456 Industrial Area',
      line2: 'Phase 2',
      city: 'Gurgaon',
      state: 'Haryana',
      country: 'India',
      postalCode: '122001',
      type: 'WAREHOUSE',
      isDefault: false,
    },
    // Bharat Electronics
    {
      id: FIXED_IDS.ADDR_V2_REG,
      vendorId: VENDOR_IDS.V2,
      line1: '789 Electronics Hub',
      line2: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560066',
      type: 'REGISTERED',
      isDefault: true,
    },
    {
      id: FIXED_IDS.ADDR_V2_WARE,
      vendorId: VENDOR_IDS.V2,
      line1: '321 Tech Park',
      line2: 'Electronic City',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560100',
      type: 'WAREHOUSE',
      isDefault: false,
    },
    // GreenLeaf Organics
    {
      id: FIXED_IDS.ADDR_V3_REG,
      vendorId: VENDOR_IDS.V3,
      line1: '654 Organic Valley',
      line2: 'Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '411001',
      type: 'REGISTERED',
      isDefault: true,
    },
    {
      id: FIXED_IDS.ADDR_V3_WARE,
      vendorId: VENDOR_IDS.V3,
      line1: '987 Green Fields',
      line2: 'Hinjewadi',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '411057',
      type: 'WAREHOUSE',
      isDefault: false,
    },
    // TrendyKart
    {
      id: FIXED_IDS.ADDR_V4_REG,
      vendorId: VENDOR_IDS.V4,
      line1: '147 Fashion Street',
      line2: 'Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400050',
      type: 'REGISTERED',
      isDefault: true,
    },
    {
      id: FIXED_IDS.ADDR_V4_WARE,
      vendorId: VENDOR_IDS.V4,
      line1: '258 Garment Hub',
      line2: 'Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400069',
      type: 'WAREHOUSE',
      isDefault: false,
    },
    // TechBazaar
    {
      id: FIXED_IDS.ADDR_V5_REG,
      vendorId: VENDOR_IDS.V5,
      line1: '369 Tech Tower',
      line2: 'Cyber City',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500081',
      type: 'REGISTERED',
      isDefault: true,
    },
    {
      id: FIXED_IDS.ADDR_V5_WARE,
      vendorId: VENDOR_IDS.V5,
      line1: '741 IT Park',
      line2: 'HITEC City',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500081',
      type: 'WAREHOUSE',
      isDefault: false,
    },
  ],
  
  bankAccounts: [
    {
      id: FIXED_IDS.BANK_V1,
      vendorId: VENDOR_IDS.V1,
      accountHolder: 'Acme Retail Private Limited',
      accountNumber: '1234567890123456',
      ifsc: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'Gurgaon Sector 18',
      status: 'VERIFIED' as const,
    },
    {
      id: FIXED_IDS.BANK_V2,
      vendorId: VENDOR_IDS.V2,
      accountHolder: 'Bharat Electronics Corporation',
      accountNumber: '2345678901234567',
      ifsc: 'ICIC0002345',
      bankName: 'ICICI Bank',
      branch: 'Bangalore Whitefield',
      status: 'VERIFIED' as const,
    },
    {
      id: FIXED_IDS.BANK_V3,
      vendorId: VENDOR_IDS.V3,
      accountHolder: 'GreenLeaf Organics LLP',
      accountNumber: '3456789012345678',
      ifsc: 'SBIN0003456',
      bankName: 'State Bank of India',
      branch: 'Pune Koregaon Park',
      status: 'UNVERIFIED' as const,
    },
    {
      id: FIXED_IDS.BANK_V4,
      vendorId: VENDOR_IDS.V4,
      accountHolder: 'TrendyKart Fashion Private Limited',
      accountNumber: '4567890123456789',
      ifsc: 'AXIS0004567',
      bankName: 'Axis Bank',
      branch: 'Mumbai Linking Road',
      status: 'VERIFIED' as const,
    },
    {
      id: FIXED_IDS.BANK_V5,
      vendorId: VENDOR_IDS.V5,
      accountHolder: 'TechBazaar Solutions India Private Limited',
      accountNumber: '5678901234567890',
      ifsc: 'KOTAK0005678',
      bankName: 'Kotak Mahindra Bank',
      branch: 'Hyderabad HITEC City',
      status: 'REJECTED' as const,
    },
  ],
  
  kyc: [
    // Acme Retail - All approved
    { vendorId: VENDOR_IDS.V1, docType: 'GST_CERTIFICATE', docUrl: 'https://storage.tradygo.com/kyc/acme-gst.pdf', status: 'APPROVED' as const, remarks: 'Valid GST certificate' },
    { vendorId: VENDOR_IDS.V1, docType: 'PAN_CARD', docUrl: 'https://storage.tradygo.com/kyc/acme-pan.pdf', status: 'APPROVED' as const, remarks: 'PAN verified' },
    { vendorId: VENDOR_IDS.V1, docType: 'BANK_STATEMENT', docUrl: 'https://storage.tradygo.com/kyc/acme-bank.pdf', status: 'APPROVED' as const, remarks: 'Bank statement verified' },
    
    // Bharat Electronics - Mix of approved and pending
    { vendorId: VENDOR_IDS.V2, docType: 'GST_CERTIFICATE', docUrl: 'https://storage.tradygo.com/kyc/bharat-gst.pdf', status: 'APPROVED' as const, remarks: 'GST certificate approved' },
    { vendorId: VENDOR_IDS.V2, docType: 'PAN_CARD', docUrl: 'https://storage.tradygo.com/kyc/bharat-pan.pdf', status: 'APPROVED' as const, remarks: 'PAN card verified' },
    { vendorId: VENDOR_IDS.V2, docType: 'INCORPORATION_CERTIFICATE', docUrl: 'https://storage.tradygo.com/kyc/bharat-inc.pdf', status: 'PENDING' as const, remarks: null },
    
    // GreenLeaf Organics - Pending approval
    { vendorId: VENDOR_IDS.V3, docType: 'GST_CERTIFICATE', docUrl: 'https://storage.tradygo.com/kyc/greenleaf-gst.pdf', status: 'PENDING' as const, remarks: null },
    { vendorId: VENDOR_IDS.V3, docType: 'PAN_CARD', docUrl: 'https://storage.tradygo.com/kyc/greenleaf-pan.pdf', status: 'PENDING' as const, remarks: null },
    
    // TrendyKart - Mix with one rejection
    { vendorId: VENDOR_IDS.V4, docType: 'GST_CERTIFICATE', docUrl: 'https://storage.tradygo.com/kyc/trendy-gst.pdf', status: 'APPROVED' as const, remarks: 'GST verified successfully' },
    { vendorId: VENDOR_IDS.V4, docType: 'PAN_CARD', docUrl: 'https://storage.tradygo.com/kyc/trendy-pan.pdf', status: 'REJECTED' as const, remarks: 'PAN card image unclear, please resubmit' },
    { vendorId: VENDOR_IDS.V4, docType: 'BANK_STATEMENT', docUrl: 'https://storage.tradygo.com/kyc/trendy-bank.pdf', status: 'APPROVED' as const, remarks: 'Bank statement verified' },
    
    // TechBazaar - Rejected documents
    { vendorId: VENDOR_IDS.V5, docType: 'GST_CERTIFICATE', docUrl: 'https://storage.tradygo.com/kyc/tech-gst.pdf', status: 'REJECTED' as const, remarks: 'GST number mismatch' },
    { vendorId: VENDOR_IDS.V5, docType: 'PAN_CARD', docUrl: 'https://storage.tradygo.com/kyc/tech-pan.pdf', status: 'REJECTED' as const, remarks: 'Invalid PAN format' },
  ],
  
  commissionRules: [
    // Global rule (using V1 as placeholder for global)
    {
      id: FIXED_IDS.COMM_GLOBAL,
      vendorId: VENDOR_IDS.V1,
      type: 'PERCENTAGE' as const,
      value: '10.00',
      category: null,
    },
    // V1 override
    {
      id: FIXED_IDS.COMM_V1,
      vendorId: VENDOR_IDS.V1,
      type: 'PERCENTAGE' as const,
      value: '12.00',
      category: null,
    },
    // V2 flat rate
    {
      id: FIXED_IDS.COMM_V2,
      vendorId: VENDOR_IDS.V2,
      type: 'FLAT' as const,
      value: '15.00',
      category: null,
    },
    // V4 category-specific
    {
      id: FIXED_IDS.COMM_V4_CAT,
      vendorId: VENDOR_IDS.V4,
      type: 'PERCENTAGE' as const,
      value: '8.00',
      category: 'FASHION',
    },
  ],
  
  statements: [
    // June 2025 statements
    {
      id: FIXED_IDS.STMT_V1_JUN,
      vendorId: VENDOR_IDS.V1,
      periodStart: new Date('2025-06-01'),
      periodEnd: new Date('2025-06-30'),
      totalSales: '125000.00',
      totalFees: '15000.00',
      netAmount: '110000.00',
      status: 'FINALIZED' as const,
    },
    {
      id: FIXED_IDS.STMT_V2_JUN,
      vendorId: VENDOR_IDS.V2,
      periodStart: new Date('2025-06-01'),
      periodEnd: new Date('2025-06-30'),
      totalSales: '89000.00',
      totalFees: '8900.00',
      netAmount: '80100.00',
      status: 'FINALIZED' as const,
    },
    {
      id: FIXED_IDS.STMT_V4_JUN,
      vendorId: VENDOR_IDS.V4,
      periodStart: new Date('2025-06-01'),
      periodEnd: new Date('2025-06-30'),
      totalSales: '67000.00',
      totalFees: '5360.00',
      netAmount: '61640.00',
      status: 'FINALIZED' as const,
    },
    // July 2025 statements
    {
      id: FIXED_IDS.STMT_V1_JUL,
      vendorId: VENDOR_IDS.V1,
      periodStart: new Date('2025-07-01'),
      periodEnd: new Date('2025-07-31'),
      totalSales: '142000.00',
      totalFees: '17040.00',
      netAmount: '124960.00',
      status: 'FINALIZED' as const,
    },
    {
      id: FIXED_IDS.STMT_V2_JUL,
      vendorId: VENDOR_IDS.V2,
      periodStart: new Date('2025-07-01'),
      periodEnd: new Date('2025-07-31'),
      totalSales: '95000.00',
      totalFees: '9500.00',
      netAmount: '85500.00',
      status: 'FINALIZED' as const,
    },
    {
      id: FIXED_IDS.STMT_V4_JUL,
      vendorId: VENDOR_IDS.V4,
      periodStart: new Date('2025-07-01'),
      periodEnd: new Date('2025-07-31'),
      totalSales: '78000.00',
      totalFees: '6240.00',
      netAmount: '71760.00',
      status: 'DRAFT' as const,
    },
  ],
  
  payouts: [
    {
      id: FIXED_IDS.PAYOUT_V1_1,
      vendorId: VENDOR_IDS.V1,
      statementId: FIXED_IDS.STMT_V1_JUN,
      amount: '110000.00',
      status: 'COMPLETED' as const,
      reference: 'UTR123456789',
    },
    {
      id: FIXED_IDS.PAYOUT_V2_1,
      vendorId: VENDOR_IDS.V2,
      statementId: FIXED_IDS.STMT_V2_JUN,
      amount: '80100.00',
      status: 'COMPLETED' as const,
      reference: 'UTR987654321',
    },
    {
      id: FIXED_IDS.PAYOUT_V4_1,
      vendorId: VENDOR_IDS.V4,
      statementId: FIXED_IDS.STMT_V4_JUN,
      amount: '61640.00',
      status: 'INITIATED' as const,
      reference: null,
    },
    {
      id: FIXED_IDS.PAYOUT_V4_FAIL,
      vendorId: VENDOR_IDS.V4,
      statementId: null,
      amount: '25000.00',
      status: 'FAILED' as const,
      reference: null,
    },
  ],
  
  settings: [
    {
      id: FIXED_IDS.SET_V1,
      vendorId: VENDOR_IDS.V1,
      autoPayout: true,
      defaultCommissionType: 'PERCENTAGE' as const,
      defaultCommissionValue: '12.00',
    },
    {
      id: FIXED_IDS.SET_V2,
      vendorId: VENDOR_IDS.V2,
      autoPayout: false,
      defaultCommissionType: 'FLAT' as const,
      defaultCommissionValue: '15.00',
    },
    {
      id: FIXED_IDS.SET_V3,
      vendorId: VENDOR_IDS.V3,
      autoPayout: false,
      defaultCommissionType: 'PERCENTAGE' as const,
      defaultCommissionValue: '10.00',
    },
    {
      id: FIXED_IDS.SET_V4,
      vendorId: VENDOR_IDS.V4,
      autoPayout: true,
      defaultCommissionType: 'PERCENTAGE' as const,
      defaultCommissionValue: '8.00',
    },
    {
      id: FIXED_IDS.SET_V5,
      vendorId: VENDOR_IDS.V5,
      autoPayout: false,
      defaultCommissionType: 'PERCENTAGE' as const,
      defaultCommissionValue: '10.00',
    },
  ],
  
  issues: [
    { vendorId: VENDOR_IDS.V1, title: 'Payment delay inquiry', description: 'Vendor inquiring about delayed payout for June statement', status: 'RESOLVED' as const },
    { vendorId: VENDOR_IDS.V1, title: 'Product catalog update', description: 'Request to update product descriptions and images', status: 'IN_PROGRESS' as const },
    { vendorId: VENDOR_IDS.V2, title: 'KYC document pending', description: 'Incorporation certificate still under review', status: 'OPEN' as const },
    { vendorId: VENDOR_IDS.V3, title: 'Account activation request', description: 'Vendor requesting account activation after KYC submission', status: 'OPEN' as const },
    { vendorId: VENDOR_IDS.V4, title: 'PAN card resubmission', description: 'Need to resubmit clear PAN card image', status: 'OPEN' as const },
    { vendorId: VENDOR_IDS.V4, title: 'Failed payout investigation', description: 'Investigating failed payout of ₹25,000', status: 'IN_PROGRESS' as const },
    { vendorId: VENDOR_IDS.V5, title: 'Account suspension appeal', description: 'Vendor appealing account suspension due to KYC issues', status: 'OPEN' as const },
    { vendorId: VENDOR_IDS.V5, title: 'Document verification failure', description: 'GST and PAN documents rejected, need resubmission', status: 'OPEN' as const },
  ],
  
  vendorUsers: [
    // Demo users for vendors (will be created if users table exists)
    { email: 'owner@acmeretail.com', firstName: 'Rajesh', lastName: 'Kumar', role: 'SELLER' as const, vendorId: VENDOR_IDS.V1, vendorRole: 'OWNER' },
    { email: 'manager@acmeretail.com', firstName: 'Priya', lastName: 'Sharma', role: 'SELLER' as const, vendorId: VENDOR_IDS.V1, vendorRole: 'MANAGER' },
    { email: 'admin@bharatelectronics.in', firstName: 'Suresh', lastName: 'Reddy', role: 'SELLER' as const, vendorId: VENDOR_IDS.V2, vendorRole: 'OWNER' },
    { email: 'owner@greenleaforganics.com', firstName: 'Anita', lastName: 'Patel', role: 'SELLER' as const, vendorId: VENDOR_IDS.V3, vendorRole: 'OWNER' },
    { email: 'ceo@trendykart.com', firstName: 'Vikram', lastName: 'Singh', role: 'SELLER' as const, vendorId: VENDOR_IDS.V4, vendorRole: 'OWNER' },
    { email: 'founder@techbazaar.in', firstName: 'Arjun', lastName: 'Mehta', role: 'SELLER' as const, vendorId: VENDOR_IDS.V5, vendorRole: 'OWNER' },
  ],
  
  products: [
    // Acme Retail products
    { vendorId: VENDOR_IDS.V1, name: 'Premium Bluetooth Headphones', price: '2999.00' },
    { vendorId: VENDOR_IDS.V1, name: 'Wireless Mouse', price: '899.00' },
    { vendorId: VENDOR_IDS.V1, name: 'USB-C Cable', price: '299.00' },
    
    // Bharat Electronics products
    { vendorId: VENDOR_IDS.V2, name: 'Smart LED TV 43"', price: '25999.00' },
    { vendorId: VENDOR_IDS.V2, name: 'Home Theater System', price: '15999.00' },
    { vendorId: VENDOR_IDS.V2, name: 'Bluetooth Speaker', price: '3999.00' },
    { vendorId: VENDOR_IDS.V2, name: 'Smartphone', price: '18999.00' },
    
    // GreenLeaf Organics products
    { vendorId: VENDOR_IDS.V3, name: 'Organic Quinoa 1kg', price: '450.00' },
    { vendorId: VENDOR_IDS.V3, name: 'Cold Pressed Coconut Oil', price: '320.00' },
    { vendorId: VENDOR_IDS.V3, name: 'Organic Honey 500g', price: '280.00' },
    
    // TrendyKart products
    { vendorId: VENDOR_IDS.V4, name: 'Designer Kurta Set', price: '1899.00' },
    { vendorId: VENDOR_IDS.V4, name: 'Casual T-Shirt', price: '599.00' },
    { vendorId: VENDOR_IDS.V4, name: 'Formal Shirt', price: '1299.00' },
    { vendorId: VENDOR_IDS.V4, name: 'Denim Jeans', price: '1799.00' },
    
    // TechBazaar products
    { vendorId: VENDOR_IDS.V5, name: 'Gaming Laptop', price: '75999.00' },
    { vendorId: VENDOR_IDS.V5, name: 'Mechanical Keyboard', price: '4999.00' },
    { vendorId: VENDOR_IDS.V5, name: 'Gaming Mouse', price: '2499.00' },
  ],
  
  orders: [
    // Orders for active vendors
    { vendorId: VENDOR_IDS.V1, totalAmount: '2999.00', status: 'DELIVERED' as const },
    { vendorId: VENDOR_IDS.V1, totalAmount: '1198.00', status: 'SHIPPED' as const },
    { vendorId: VENDOR_IDS.V1, totalAmount: '899.00', status: 'PROCESSING' as const },
    
    { vendorId: VENDOR_IDS.V2, totalAmount: '25999.00', status: 'DELIVERED' as const },
    { vendorId: VENDOR_IDS.V2, totalAmount: '18999.00', status: 'CONFIRMED' as const },
    
    { vendorId: VENDOR_IDS.V4, totalAmount: '1899.00', status: 'DELIVERED' as const },
    { vendorId: VENDOR_IDS.V4, totalAmount: '2898.00', status: 'SHIPPED' as const },
    { vendorId: VENDOR_IDS.V4, totalAmount: '1799.00', status: 'PROCESSING' as const },
  ],
};