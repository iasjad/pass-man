import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Manager from './components/Manager';
import Footer from './components/Footer';
import Auth from './auth/Auth';
import { supabase } from './utils/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Navbar session={session} />

      <div className="min-h-[84.8vh] relative">
        {!session ? (
          <Auth />
        ) : (
          <Manager key={session.user.id} session={session} />
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;
