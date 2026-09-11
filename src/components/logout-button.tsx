import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabase';
import { Button } from './ui/button';

function LogoutButton() {
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    navigate({ to: '/login' });
  }

  return (
    <Button
      type='button'
      variant='ghost'
      aria-label='Logout'
      onClick={handleLogout}
      className='size-10 rounded-full border border-[#e2e2ef] bg-white p-0 text-[#5050E0] shadow-sm hover:bg-[#5050E0]/10 hover:text-[#5050E0]'
    >
      <LogOut className='size-4' />
    </Button>
  );
}

export default LogoutButton;
