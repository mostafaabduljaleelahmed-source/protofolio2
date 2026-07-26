import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieHeader = `jaleelo_admin_session=; Path=/; HttpOnly; SameSite=Strict; ${isProduction ? 'Secure;' : ''} Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  res.setHeader('Set-Cookie', cookieHeader);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
