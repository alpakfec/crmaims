import { getServerSession } from 'next-auth';
import { authConfig } from './config';

export async function getCurrentUser() {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function isAdmin(role?: string) {
  return role === 'admin';
}

export function isManager(role?: string) {
  return role === 'admin' || role === 'sales_manager';
}

export function isSalesRep(role?: string) {
  return role === 'sales_rep' || role === 'sales_manager' || role === 'admin';
}
