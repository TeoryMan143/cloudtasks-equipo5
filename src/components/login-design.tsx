import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CalendarDays, Mail, Lock, MoveRight } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import FormField from '@/components/form-field';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError('User or password incorrect');
      return;
    }

    navigate({ to: '/' });
  }
  return (
    <main className='min-h-screen bg-[#F8F8F8] text-[#26263c] bg-[url(./assets/background-login.png)] bg-cover bg-center'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:px-12 justify-center items-center flex flex-col'>
        <header className='mb-8 flex flex-col gap-9 sm:flex-row sm:items-end sm:justify-between w-full'>
          <div className='w-full sm:w-auto self-start'>
            <div className='mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#865cf0]'>
              <CalendarDays className='size-4' />
              Cloudtasks
            </div>
          </div>
        </header>
        <section className='mb-8 flex flex-col gap-4 sm:items-center sm:justify-between w-full'>
          <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-8 shadow-md sm:p-12 w-1/3'>
            <div className='mb-0.5 gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#865cf0] justify-center items-center flex flex-col'>
              <CalendarDays className='size-7' />
              Cloudtasks
            </div>

            <h1 className='text-2xl font-bold'>Welcome back</h1>

            <p className='text-xs text-gray-500'>
              Sign in to your account and keep
            </p>

            <form
              onSubmit={handleSubmit}
              className='flex w-full max-w-sm flex-col gap-4'
            >
              <FormField
                id='email'
                icon={Mail}
                type='email'
                placeholder='Email address'
                autoComplete='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <FormField
                id='password'
                icon={Lock}
                type='password'
                placeholder='Password'
                autoComplete='current-password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={error}
                required
              />

              <button
                type='submit'
                disabled={loading}
                className='w-full rounded-lg bg-[#5050E0] py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5050E0]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5050E0]'
              >
                Log in
                <MoveRight className='size-4 inline-block ml-2' />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
