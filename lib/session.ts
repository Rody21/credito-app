import { authClient } from '@/lib/auth';

export async function getCurrentUser() {
  const {
    data: { user },
  } = await authClient.auth.getUser();

  return user;
}
