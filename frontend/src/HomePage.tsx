import { useEffect, useState } from "react";
import { Sidebar } from "./Components/Sidebar";
import ChatView from "./Components/ChatView";
import axios from "axios";

export function HomePage() {
  const [contactSelected, setContactSelected] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/mensagens')
      .then(response => {
        setMensagens(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar mensagens:', error);
      });
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactSelected(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="flex h-screen bg-zinc-800 text-white overflow-hidden">
      <Sidebar
        setContactSelected={setContactSelected}
        contato={contactSelected}
        mensagens={mensagens}
      />
      <ChatView
        setContactSelected={setContactSelected}
        contato={contactSelected}
        mensagens={mensagens}
        setMensagens={setMensagens}
      />
    </div>
  );
}
