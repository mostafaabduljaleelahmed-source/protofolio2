import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory rate limiting map for brute-force protection
const attemptTracker = new Map<string, { attempts: number; lockoutUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const tracking = attemptTracker.get(clientIp) || { attempts: 0, lockoutUntil: 0 };

  // Check if IP is currently locked out
  if (tracking.lockoutUntil > now) {
    const remainingSec = Math.ceil((tracking.lockoutUntil - now) / 1000);
    return res.status(429).json({
      error: `Too many failed attempts. Try again in ${remainingSec} seconds.`,
      lockout: true,
      remainingSec
    });
  }

  const { pin } = req.body || {};
  const serverPin = process.env.ADMIN_PIN || '8899';

  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'PIN parameter is required' });
  }

  // Verify PIN
  if (pin.trim() === serverPin.trim()) {
    // Reset failed attempts on success
    attemptTracker.delete(clientIp);

    // Create session token
    const token = Buffer.from(`admin_${now}_${Math.random().toString(36).substring(2)}`).toString('base64');

    // Set secure HttpOnly session cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieHeader = `jaleelo_admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; ${isProduction ? 'Secure;' : ''} Max-Age=86400`;

    res.setHeader('Set-Cookie', cookieHeader);
    return res.status(200).json({
      success: true,
      token,
      message: 'Admin authentication verified'
    });
  } else {
    // Increment failed attempts
    tracking.attempts += 1;
    if (tracking.attempts >= MAX_ATTEMPTS) {
      tracking.lockoutUntil = now + LOCKOUT_MS;
      attemptTracker.set(clientIp, tracking);
      return res.status(429).json({
        error: 'Maximum authentication attempts exceeded. Account locked for 15 minutes.',
        lockout: true,
        remainingSec: 900
      });
    }

    attemptTracker.set(clientIp, tracking);
    const remainingAttempts = MAX_ATTEMPTS - tracking.attempts;

    return res.status(401).json({
      error: `Invalid admin PIN passcode. ${remainingAttempts} attempt(s) remaining.`,
      remainingAttempts
    });
  }
}
