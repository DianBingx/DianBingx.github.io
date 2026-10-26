// Local navigation check only: a public static page is not access-controlled.

export const invitationRoutes = [
  { digest: '6eb00b4b2614a144d41ccdf709017a675953fae2df6cfd6b397bd9e4d8708461', path: '../index.html' },
  { digest: '5c412a262086b9701cda06302f6667f9265b1807d0368fcec6cc03bf64fc250b', path: '../../Game/index.html' },
  { digest: 'ea93d6a262ecb87a9fa4d09edbd7654c046597936a8e235fc3949eb01775ff99', path: '../../Tools/index.html' },
];

export async function digestInvitation(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
