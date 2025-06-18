import { useEffect, useState } from "react";
import { Sidebar } from "./Components/Sidebar";
import ChatView from "./Components/ChatView";

export function HomePage() {
  const [contactSelected, setContactSelected] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactSelected(null); // Sai da conversa
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="flex h-screen bg-zinc-800 text-white">
      <Sidebar setContactSelected={setContactSelected} />
      <ChatView contato={contactSelected} />
    </div>
  );
};