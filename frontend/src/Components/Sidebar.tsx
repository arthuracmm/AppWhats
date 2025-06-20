import { ArrowRight, SearchIcon, User } from "lucide-react";
import { useState } from "react";

type SidebarProps = {
    setContactSelected: (contato: string) => void;
    contato: string | null;
    mensagens: Mensagem[];
};

type Mensagem = {
    id: number;
    contato: string;
    texto: string;
    horario: string;
    remetente: string;
};

function parseHorario(horarioStr: string): Date | null {
    const match = horarioStr.match(/\[(\d{1,2}):(\d{2}), (\d{1,2})\/(\d{1,2})\/(\d{4})]/);
    if (!match) return null;

    const [, hour, minute, day, month, year] = match.map(Number);
    return new Date(year, month - 1, day, hour, minute);
}

export function Sidebar({ setContactSelected, contato, mensagens }: SidebarProps) {
    const [search, setSearch] = useState<string>('');

    const contatosUnicos: Mensagem[] = Object.values(
        mensagens.reduce((acc, msg) => {
            const msgDate = parseHorario(msg.horario);
            const current = acc[msg.contato];
            const currentDate = current ? parseHorario(current.horario) : null;

            if (
                !current ||
                (msgDate && currentDate && (
                    msgDate > currentDate ||
                    (msgDate.getTime() === currentDate.getTime() && msg.id > current.id)
                ))
            ) {
                acc[msg.contato] = msg;
            }

            return acc;
        }, {} as Record<string, any>)
    );

    contatosUnicos.sort((a, b) => {
        const dateA = parseHorario(a.horario);
        const dateB = parseHorario(b.horario);
        if (dateA && dateB) {
            const timeDiff = dateB.getTime() - dateA.getTime();
            return timeDiff !== 0 ? timeDiff : b.id - a.id;
        }
        return 0;
    });



    return (
        <div className="flex flex-col gap-2 w-120 bg-zinc-800 text-white p-4 border-r border-zinc-600">
            <h1 className="text-2xl font-semibold mb-2">AppWhats</h1>

            <div className="flex items-center bg-zinc-600 rounded-full py-2 px-4 gap-2">
                <SearchIcon size={15} />
                <input
                    type="text"
                    className="w-full h-full text-xs outline-none bg-transparent"
                    placeholder="Pesquisar uma Conversa"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto">
                {contatosUnicos
                    .filter(msg =>
                        msg.contato.toLowerCase().includes(search.toLowerCase()) ||
                        msg.texto.toLowerCase().includes(search.toLowerCase())
                    )
                    .map(msg => (
                        <div
                            className={`flex gap-3 p-2 rounded-lg hover:bg-zinc-700 ${contato === msg.contato ? 'bg-zinc-700' : 'bg-zinc-800'} cursor-pointer items-center relative`}
                            key={msg.id}
                            onClick={() => setContactSelected(msg.contato)}
                        >
                            <div className="bg-white/5 p-3 rounded-full w-fit border border-zinc-600">
                                <User fill="#fff" />
                            </div>
                            <div className="flex flex-col w-full overflow-hidden">
                                <p className="truncate">{msg.contato}</p>
                                <div className="text-white/60 text-xs">
                                    {msg.remetente === 'Contato' ? (
                                        <p className="truncate">{msg.texto}</p>
                                    ) : (
                                        <div className="flex items-center gap-2 w-full">
                                            <ArrowRight size={15} className="flex-shrink-0" />
                                            <p className="truncate w-full">{msg.texto}</p>
                                        </div>
                                    )}

                                    <p className="absolute top-4 right-4"> {parseHorario(msg.horario)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) || 'Hora inválida'}</p>

                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
