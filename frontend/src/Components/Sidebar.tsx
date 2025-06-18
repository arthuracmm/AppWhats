import { ArrowRight, SearchIcon, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios';

type SidebarProps = {
    setContactSelected: (contato: string) => void;
};

export function Sidebar({ setContactSelected }: SidebarProps) {
    const [search, setSearch] = useState<string>('')
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        axios.get('http://localhost:3001/mensagens')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const contatosUnicos = Object.values(
        data.reduce((acc, msg) => {
            if (!acc[msg.contato] || acc[msg.contato].horario > msg.horario) {
                acc[msg.contato] = msg;
            }
            return acc;
        }, {})
    );

    return (
        <div className="flex flex-col gap-2 w-100  bg-zinc-800 text-white p-4 border-r-1 border-zinc-600">
            <h1 className="text-2xl font-semibold mb-2">AppWhats</h1>
            <div className="flex items-center bg-zinc-600 rounded-full py-2 px-4 gap-2">
                <SearchIcon size={15} />
                <input type="text" className="w-full h-full text-xs outline-none" placeholder="Pesquisar uma Conversa" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="overflow-y-auto">
                {contatosUnicos
                    .filter(msg =>
                        msg.contato.toLowerCase().includes(search.toLowerCase()) ||
                        msg.texto.toLowerCase().includes(search.toLowerCase())
                    )
                    .map(msg => (
                        <div className="flex gap-3 p-2 rounded-lg hover:bg-zinc-700 cursor-pointer items-center" key={msg.key} onClick={(e) => setContactSelected(msg.contato)}>
                            <div className="bg-white/5 p-3 rounded-full w-fit border-1 border-zinc-600">
                                <User fill="#fff" />
                            </div>
                            <div className="flex flex-col gap-1 line-clamp-1">
                                <p className="truncate">{msg.contato}</p>
                                <div className="text-white/60 text-xs line-clamp-1">
                                    {msg.remetente === 'Contato' ? msg.texto :
                                        <div className="flex items-center gap-2 w-full">
                                            <ArrowRight size={15} className="flex-shrink-0" />
                                            <p className="truncate w-full">{msg.texto}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}

            </div>

        </div>
    )
}