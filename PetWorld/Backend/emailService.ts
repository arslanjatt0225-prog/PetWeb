import nodemailer from 'nodemailer';
import { IOrder } from './types';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  frontendUrl: string;
}

export function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER || 'arslanjutt00225@gmail.com';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.EMAIL_FROM || `PetWorld <${user}>`;
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  return { host, port, secure, user, pass, from, frontendUrl };
}

export function createTransporter() {
  const config = getSmtpConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    // Useful defaults for Gmail SMTP compatibility
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Verify Gmail SMTP connection status
 */
export async function verifySMTPConnection(): Promise<{
  connected: boolean;
  message: string;
  host: string;
  port: number;
  user: string;
  hasPassword: boolean;
  error?: string;
}> {
  const config = getSmtpConfig();
  const hasPassword = Boolean(config.pass && config.pass.trim().length > 0);

  if (!hasPassword) {
    return {
      connected: false,
      message: 'Gmail App Password is not yet set in SMTP_PASS environment variable.',
      host: config.host,
      port: config.port,
      user: config.user,
      hasPassword: false,
      error: 'Missing SMTP_PASS. Generate a 16-character Google App Password in your Google Account security settings.',
    };
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    return {
      connected: true,
      message: 'Successfully connected and authenticated with Gmail SMTP server.',
      host: config.host,
      port: config.port,
      user: config.user,
      hasPassword: true,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: 'Gmail SMTP authentication failed. Please verify your 16-character App Password.',
      host: config.host,
      port: config.port,
      user: config.user,
      hasPassword: true,
      error: err?.message || 'SMTP Authentication Error',
    };
  }
}

// ==========================================
// BRANDED HTML EMAIL TEMPLATES
// ==========================================

function getEmailHeader() {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #277438; border-radius: 12px 12px 0 0; padding: 24px 32px;">
      <tr>
        <td align="left" style="vertical-align: middle;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="background-color: #ffffff; border-radius: 50%; width: 44px; height: 44px; text-align: center; vertical-align: middle;">
                <span style="font-size: 24px; line-height: 44px;">🐾</span>
              </td>
              <td style="padding-left: 14px;">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">PetWorld</span><br>
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 500; color: #bbf7d0; letter-spacing: 0.5px; text-transform: uppercase;">Care More. Love More.</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function getEmailFooter() {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #17381d; border-radius: 0 0 12px 12px; padding: 24px 32px; margin-top: 0;">
      <tr>
        <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #dcfce7; line-height: 1.6;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: #ffffff;">PetWorld Pakistan – Premium Pet Supplies</p>
          <p style="margin: 0 0 8px 0; color: #86efac; font-size: 12px;">123 Pet Street, Gulberg III, Lahore, Pakistan | +92 300 123 4567</p>
          <p style="margin: 0; color: #4ade80; font-size: 11px;">
            Official Sender: arslanjutt00225@gmail.com &bull; &copy; ${new Date().getFullYear()} PetWorld. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  `;
}

function wrapTemplate(title: string, bodyContent: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f3eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f3eb; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e7e5e4;">
          <tr>
            <td>
              ${getEmailHeader()}
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px 32px 32px; background-color: #ffffff;">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td>
              ${getEmailFooter()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. Email Verification Template
 */
export function getVerificationEmailHtml(name: string, verifyUrl: string) {
  const content = `
    <h1 style="color: #1c1917; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 12px;">
      Welcome to the PetWorld Family, ${name}! 🐶🐱
    </h1>
    <p style="color: #44403c; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
      Thank you for creating an account with PetWorld. We're thrilled to have you with us on the mission to give your furry, feathered, and aquatic friends the happier, healthier life they deserve.
    </p>
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
      <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 600;">
        🛡️ Action Required: Please verify your email address to activate your account and start ordering.
      </p>
    </div>
    <div style="text-align: center; margin-bottom: 32px;">
      <a href="${verifyUrl}" target="_blank" style="display: inline-block; background-color: #277438; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 36px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(39, 116, 56, 0.35);">
        Verify My Email Address &rarr;
      </a>
    </div>
    <p style="color: #78716c; font-size: 13px; line-height: 1.5; margin-bottom: 8px;">
      Or copy and paste this verification URL into your web browser:
    </p>
    <p style="background-color: #f5f5f4; padding: 10px 14px; border-radius: 6px; font-size: 12px; word-break: break-all; color: #277438; font-family: monospace; margin-bottom: 24px;">
      ${verifyUrl}
    </p>
    <p style="color: #a8a29e; font-size: 12px; margin: 0; border-top: 1px solid #f5f5f4; padding-top: 16px;">
      This verification link is secure and will expire in 24 hours. If you did not create a PetWorld account, you can safely ignore this email.
    </p>
  `;
  return wrapTemplate('Verify Your PetWorld Account', content);
}

/**
 * 2. Password Reset Template
 */
export function getPasswordResetEmailHtml(name: string, resetUrl: string) {
  const content = `
    <h1 style="color: #1c1917; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 12px;">
      Password Reset Request 🔐
    </h1>
    <p style="color: #44403c; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      Hello ${name}, we received a request to reset the password for your PetWorld account. Click the button below to choose a new password:
    </p>
    <div style="text-align: center; margin: 28px 0 32px 0;">
      <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #277438; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 36px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(39, 116, 56, 0.35);">
        Reset My Password &rarr;
      </a>
    </div>
    <p style="color: #78716c; font-size: 13px; line-height: 1.5; margin-bottom: 8px;">
      If the button above does not work, copy and paste this link into your browser:
    </p>
    <p style="background-color: #f5f5f4; padding: 10px 14px; border-radius: 6px; font-size: 12px; word-break: break-all; color: #277438; font-family: monospace; margin-bottom: 24px;">
      ${resetUrl}
    </p>
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 14px 18px; margin-bottom: 16px;">
      <p style="margin: 0; color: #92400e; font-size: 13px;">
        ⚠️ For your security, this password reset link is valid for <strong>1 hour</strong> only and can only be used once. If you did not make this request, please ignore this email and your password will remain unchanged.
      </p>
    </div>
  `;
  return wrapTemplate('Reset Your PetWorld Password', content);
}

/**
 * 3. Order Confirmation Template
 */
export function getOrderConfirmationEmailHtml(order: IOrder) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f5f5f4; font-size: 14px; color: #292524;">
          <strong>${item.name}</strong><br>
          <span style="font-size: 12px; color: #78716c;">Category: ${item.category || 'Pet Supplies'}</span>
        </td>
        <td align="center" style="padding: 12px 8px; border-bottom: 1px solid #f5f5f4; font-size: 14px; color: #44403c;">
          ${item.quantity}
        </td>
        <td align="right" style="padding: 12px 8px; border-bottom: 1px solid #f5f5f4; font-size: 14px; font-weight: 600; color: #292524;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('');

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 12px; font-weight: 800; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
        ✓ Order Placed Successfully
      </span>
      <h1 style="color: #1c1917; font-size: 24px; font-weight: 800; margin: 12px 0 4px 0;">
        Thank You for Your Order! 🎉
      </h1>
      <p style="color: #78716c; font-size: 14px; margin: 0;">
        Order Number: <strong style="color: #277438;">${order.orderNumber}</strong>
      </p>
    </div>

    <p style="color: #44403c; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      Hello <strong>${order.customerName}</strong>, we've received your order and our team is getting your pet goodies ready for shipment!
    </p>

    <h2 style="font-size: 16px; color: #1c1917; margin: 24px 0 12px 0; border-bottom: 2px solid #277438; padding-bottom: 6px;">
      Order Items
    </h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #fafaf9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: #78716c;">
          <th align="left" style="padding: 8px;">Product</th>
          <th align="center" style="padding: 8px;">Qty</th>
          <th align="right" style="padding: 8px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; background-color: #fbf9f4; border-radius: 8px; padding: 16px;">
      <tr>
        <td style="padding: 4px 0; font-size: 14px; color: #57534e;">Subtotal:</td>
        <td align="right" style="padding: 4px 0; font-size: 14px; font-weight: 600; color: #292524;">$${order.subtotal.toFixed(2)}</td>
      </tr>
      ${
        order.discount > 0
          ? `
      <tr>
        <td style="padding: 4px 0; font-size: 14px; color: #16a34a;">Discount (${order.couponCode || 'Promo'}):</td>
        <td align="right" style="padding: 4px 0; font-size: 14px; font-weight: 600; color: #16a34a;">-$${order.discount.toFixed(2)}</td>
      </tr>
      `
          : ''
      }
      <tr>
        <td style="padding: 4px 0; font-size: 14px; color: #57534e;">Shipping:</td>
        <td align="right" style="padding: 4px 0; font-size: 14px; font-weight: 600; color: #292524;">
          ${order.shippingCost === 0 ? '<span style="color:#16a34a;">FREE</span>' : `$${order.shippingCost.toFixed(2)}`}
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0 0 0; font-size: 16px; font-weight: 800; color: #1c1917; border-top: 1px dashed #d6d3d1;">Final Total:</td>
        <td align="right" style="padding: 10px 0 0 0; font-size: 18px; font-weight: 800; color: #277438; border-top: 1px dashed #d6d3d1;">$${order.total.toFixed(2)}</td>
      </tr>
    </table>

    <div style="display: flex; gap: 16px; margin-bottom: 24px;">
      <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 0 0 6px 0;">📍 Shipping Address</h3>
        <p style="margin: 0; font-size: 13px; color: #57534e; line-height: 1.5;">
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}${order.shippingAddress.postalCode ? ', ' + order.shippingAddress.postalCode : ''}<br>
          ${order.shippingAddress.country}
        </p>
      </div>
      <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 0 0 6px 0;">💳 Payment Method</h3>
        <p style="margin: 0; font-size: 13px; color: #57534e;">
          ${order.paymentMethod === 'cod' ? 'Cash on Delivery (Pay upon arrival)' : 'Credit / Debit Card (Online)'}
        </p>
      </div>
    </div>
  `;
  return wrapTemplate(`Order Confirmation - ${order.orderNumber}`, content);
}

/**
 * 4. Order Status Update Templates (Processing, Shipped, Delivered, Cancelled)
 */
export function getOrderStatusUpdateEmailHtml(order: IOrder, newStatus: string) {
  const statusConfig: Record<string, { title: string; badge: string; color: string; message: string; icon: string }> = {
    processing: {
      title: 'Your Order is Being Processed 📦',
      badge: 'Order Processing',
      color: '#d97706',
      message: 'Our warehouse team is carefully picking and packing your pet supplies with love and care.',
      icon: '📦',
    },
    shipped: {
      title: 'Your Order is On Its Way! 🚚',
      badge: 'Order Shipped',
      color: '#2563eb',
      message: 'Exciting news! Your package has been dispatched with our courier partner and is on its way to your doorstep.',
      icon: '🚚',
    },
    delivered: {
      title: 'Your Order Has Been Delivered! 🎁',
      badge: 'Order Delivered',
      color: '#16a34a',
      message: 'Your PetWorld package has been successfully delivered. We hope your pet loves every single item!',
      icon: '🎁',
    },
    cancelled: {
      title: 'Order Status Update: Cancelled ℹ️',
      badge: 'Order Cancelled',
      color: '#dc2626',
      message: 'Your order has been marked as cancelled. If this was a mistake or you have questions, please reach out to our 24/7 support.',
      icon: 'ℹ️',
    },
  };

  const current = statusConfig[newStatus.toLowerCase()] || {
    title: `Order Status Update: ${newStatus}`,
    badge: newStatus.toUpperCase(),
    color: '#277438',
    message: `Your order status has been updated to ${newStatus}.`,
    icon: '🐾',
  };

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: ${current.color}15; color: ${current.color}; font-size: 12px; font-weight: 800; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid ${current.color}40;">
        ${current.icon} ${current.badge}
      </span>
      <h1 style="color: #1c1917; font-size: 22px; font-weight: 800; margin: 14px 0 4px 0;">
        ${current.title}
      </h1>
      <p style="color: #78716c; font-size: 14px; margin: 0;">
        Order Number: <strong style="color: #277438;">${order.orderNumber}</strong>
      </p>
    </div>

    <p style="color: #44403c; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      Hello <strong>${order.customerName}</strong>,
    </p>
    <p style="color: #44403c; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
      ${current.message}
    </p>

    <div style="background-color: #fbf9f4; border: 1px solid #e7e5e4; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size: 14px; font-weight: 700; color: #1c1917; margin: 0 0 10px 0;">Order Summary</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px; color: #57534e;">
        <tr>
          <td style="padding: 3px 0;">Items Ordered:</td>
          <td align="right" style="font-weight: 600; color: #292524;">${order.items.reduce((acc, i) => acc + i.quantity, 0)} items</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Total Amount:</td>
          <td align="right" style="font-weight: 700; color: #277438; font-size: 15px;">$${order.total.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">Destination:</td>
          <td align="right" style="color: #292524;">${order.shippingAddress.city}, ${order.shippingAddress.country}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 28px 0 16px 0;">
      <a href="${getSmtpConfig().frontendUrl}/account/orders" target="_blank" style="display: inline-block; background-color: #277438; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 32px; border-radius: 9999px;">
        View Order Details in Account &rarr;
      </a>
    </div>
  `;
  return wrapTemplate(`Order ${order.orderNumber} Status: ${current.badge}`, content);
}

// ==========================================
// SEND EMAIL ACTIONS
// ==========================================

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<{ success: boolean; messageId?: string; error?: string; previewLink?: string }> {
  const config = getSmtpConfig();
  const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;

  // If no SMTP password provided, simulate and log without crashing
  if (!config.pass || config.pass.trim().length === 0) {
    console.log(`[PetWorld Email Service - SMTP_PASS not set] Verification email simulated for ${to}. Verify Link: ${verifyUrl}`);
    return {
      success: true,
      messageId: `simulated-verify-${Date.now()}`,
      previewLink: verifyUrl,
    };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: config.from,
      to,
      subject: '🐾 Verify your PetWorld account',
      html: getVerificationEmailHtml(name, verifyUrl),
    });
    console.log(`[PetWorld Email Service] Verification email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, previewLink: verifyUrl };
  } catch (err: any) {
    console.error(`[PetWorld Email Service Error] Failed to send verification email to ${to}:`, err.message);
    return { success: false, error: err.message, previewLink: verifyUrl };
  }
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<{ success: boolean; messageId?: string; error?: string; previewLink?: string }> {
  const config = getSmtpConfig();
  const resetUrl = `${config.frontendUrl}/auth/reset-password?token=${token}`;

  if (!config.pass || config.pass.trim().length === 0) {
    console.log(`[PetWorld Email Service - SMTP_PASS not set] Password reset simulated for ${to}. Reset Link: ${resetUrl}`);
    return {
      success: true,
      messageId: `simulated-reset-${Date.now()}`,
      previewLink: resetUrl,
    };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: config.from,
      to,
      subject: '🔐 Reset your PetWorld password',
      html: getPasswordResetEmailHtml(name, resetUrl),
    });
    console.log(`[PetWorld Email Service] Password reset email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId, previewLink: resetUrl };
  } catch (err: any) {
    console.error(`[PetWorld Email Service Error] Failed to send password reset to ${to}:`, err.message);
    return { success: false, error: err.message, previewLink: resetUrl };
  }
}

export async function sendOrderConfirmationEmail(order: IOrder): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getSmtpConfig();

  if (!config.pass || config.pass.trim().length === 0) {
    console.log(`[PetWorld Email Service - SMTP_PASS not set] Order confirmation simulated for ${order.customerEmail} (Order #${order.orderNumber})`);
    return { success: true, messageId: `simulated-order-${Date.now()}` };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: config.from,
      to: order.customerEmail,
      subject: `🎉 Order Confirmation - ${order.orderNumber} | PetWorld`,
      html: getOrderConfirmationEmailHtml(order),
    });
    console.log(`[PetWorld Email Service] Order confirmation email sent to ${order.customerEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[PetWorld Email Service Error] Failed to send order confirmation to ${order.customerEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

export async function sendOrderStatusUpdateEmail(order: IOrder, newStatus: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getSmtpConfig();

  if (!config.pass || config.pass.trim().length === 0) {
    console.log(`[PetWorld Email Service - SMTP_PASS not set] Order status update (${newStatus}) simulated for ${order.customerEmail} (Order #${order.orderNumber})`);
    return { success: true, messageId: `simulated-status-${Date.now()}` };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: config.from,
      to: order.customerEmail,
      subject: `🐾 Update on Order ${order.orderNumber}: ${newStatus.toUpperCase()} | PetWorld`,
      html: getOrderStatusUpdateEmailHtml(order, newStatus),
    });
    console.log(`[PetWorld Email Service] Order status update (${newStatus}) sent to ${order.customerEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[PetWorld Email Service Error] Failed to send order status update to ${order.customerEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

export async function sendCustomTestEmail(to: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getSmtpConfig();

  if (!config.pass || config.pass.trim().length === 0) {
    return {
      success: false,
      error: 'Cannot send test email: SMTP_PASS is empty. Please set your 16-character Gmail App Password in .env.local',
    };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: config.from,
      to,
      subject: '🐾 PetWorld Gmail SMTP Integration Test',
      html: wrapTemplate(
        'Gmail SMTP Test Successful',
        `
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 48px;">🚀</span>
          <h1 style="color: #166534; font-size: 24px; font-weight: 800; margin: 12px 0 6px 0;">Gmail SMTP Connected!</h1>
          <p style="color: #44403c; font-size: 15px; margin: 0;">
            This test email confirms that your PetWorld email integration via Gmail SMTP (arslanjutt00225@gmail.com) is operational.
          </p>
        </div>
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
          <p style="margin: 0; color: #166534; font-size: 13px;">
            <strong>Sender:</strong> ${config.from}<br>
            <strong>Host:</strong> ${config.host}:${config.port}<br>
            <strong>Timestamp:</strong> ${new Date().toLocaleString()}<br>
            <strong>Environment:</strong> Production / AI Studio
          </p>
        </div>
        `
      ),
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
