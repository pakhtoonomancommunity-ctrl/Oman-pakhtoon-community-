import { Member } from '../types';

// Read VITE_GOOGLE_CLIENT_ID from environment if defined and valid, otherwise fall back to default client ID
export const getGoogleClientId = (): string => {
  const envId = ((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string) || '';
  if (envId && envId.includes('apps.googleusercontent.com')) {
    return envId;
  }
  return '417245017023-moi1fqq7v4iorf781j5sd03qkcur8pev.apps.googleusercontent.com';
};

/**
 * Generates the Google OAuth 2.0 Authorization URL for the Implicit Grant Flow
 */
export const getGoogleAuthUrl = (clientId: string): string => {
  const redirectUri = window.location.origin + window.location.pathname;
  const scope = encodeURIComponent(
    'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'
  );
  
  // State holds active tab info so they return to admin panel after login
  const state = encodeURIComponent('activePage=cabinet&adminTab=members');

  return `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=token` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&include_granted_scopes=true` +
    `&prompt=consent`;
};

/**
 * Extracts and returns the access_token from the URL hash if present
 */
export const checkAuthFromUrl = (): { token: string | null; state: string | null } => {
  const hash = window.location.hash;
  if (!hash) return { token: null, state: null };

  const params = new URLSearchParams(hash.substring(1));
  const token = params.get('access_token');
  const state = params.get('state');

  // Clean the hash from url to keep it neat
  if (token) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  return { token, state };
};

/**
 * Creates a brand new Google Spreadsheet in Google Drive
 */
export const createSpreadsheet = async (token: string, title: string): Promise<string> => {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
      sheets: [
        {
          properties: {
            title: 'Members Directory',
            gridProperties: {
              columnCount: 15,
              rowCount: 1000,
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to create spreadsheet');
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;

  // Write headers immediately
  await writeSpreadsheetHeaders(token, spreadsheetId);

  return spreadsheetId;
};

/**
 * Writes the standard professional headers to the connected spreadsheet
 */
const writeSpreadsheetHeaders = async (token: string, spreadsheetId: string): Promise<void> => {
  const headers = [
    [
      'System ID',
      'Full Name',
      'Father Name',
      'Oman Contact Phone',
      'Oman Civil ID',
      'Passport Number',
      'Blood Group',
      'Residency Region (Oman)',
      'Home District (Pak)',
      'Join Date',
      'Card Type (Standard/VIP)',
      'Approval Status',
      'Registration Fee (OMR)',
      'Fee Status (Paid/Unpaid)',
      'Photo URL / Asset'
    ],
  ];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:O1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: headers,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to write sheet headers');
  }
};

/**
 * Appends a newly registered member to the spreadsheet
 */
export const appendMemberToSheet = async (
  token: string,
  spreadsheetId: string,
  member: Member
): Promise<void> => {
  // Map member to sheet row matching headers
  const rowValue = [
    member.id,
    member.name,
    member.fatherName,
    member.phone,
    member.omanId,
    member.passportNo || 'N/A',
    member.bloodGroup,
    member.regionOman,
    member.regionPak,
    member.joinDate,
    member.cardType,
    member.status,
    member.feeAmount || 5,
    member.feeStatus || 'Unpaid',
    member.photoUrl ? (member.photoUrl.startsWith('data:image') ? 'Uploaded Photo (Base64 Profile)' : member.photoUrl) : 'None'
  ];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:A:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValue],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to append registration row');
  }
};

/**
 * Synchronizes all members (the entire directory) into the connected Google Sheet by overwriting
 */
export const syncAllMembersToSheet = async (
  token: string,
  spreadsheetId: string,
  members: Member[]
): Promise<void> => {
  // Start with headers
  const rows = [
    [
      'System ID',
      'Full Name',
      'Father Name',
      'Oman Contact Phone',
      'Oman Civil ID',
      'Passport Number',
      'Blood Group',
      'Residency Region (Oman)',
      'Home District (Pak)',
      'Join Date',
      'Card Type (Standard/VIP)',
      'Approval Status',
      'Registration Fee (OMR)',
      'Fee Status (Paid/Unpaid)',
      'Photo URL / Asset'
    ],
  ];

  // Map each member
  members.forEach(m => {
    rows.push([
      m.id,
      m.name,
      m.fatherName,
      m.phone,
      m.omanId,
      m.passportNo || 'N/A',
      m.bloodGroup,
      m.regionOman,
      m.regionPak,
      m.joinDate,
      m.cardType,
      m.status,
      String(m.feeAmount || 5),
      m.feeStatus || 'Unpaid',
      m.photoUrl ? (m.photoUrl.startsWith('data:image') ? 'Uploaded Photo (Base64 Profile)' : m.photoUrl) : 'None'
    ]);
  });

  // Overwrite starting from cell A1 down
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:O${rows.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to fully sync registry sheet');
  }
};
