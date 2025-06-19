import { useEffect, useState } from 'react';
import textimg from '../assets/text-messages.png'
import axios from 'axios';
import { Send, User } from 'lucide-react';

type ChatViewProps = {
    setContactSelected: (contato: string) => void;
    contato: string | null;
};

type Mensagem = {
    horaFormatada: string;
    dataFormatada: string;
    id: number;
    contato: string;
    texto: string;
    horario: string;
    remetente: string;
};

function formatarHorario(horario: string): { hora: string; data: string } {
    const match = horario.match(/\[(\d{1,2}:\d{2}), (\d{1,2}\/\d{1,2}\/\d{4})]/);
    if (!match) return { hora: '', data: '' };

    const [, hora, data] = match;
    return { hora, data };
}

function agruparPorDia(mensagens: Mensagem[]): Record<string, Mensagem[]> {
    return mensagens.reduce((acc: Record<string, Mensagem[]>, msg: Mensagem) => {
        const { data, hora } = formatarHorario(msg.horario);
        msg.dataFormatada = data;
        msg.horaFormatada = hora;

        if (!acc[data]) acc[data] = [];
        acc[data].push(msg);
        return acc;
    }, {});
}


const ChatView = ({ contato }: ChatViewProps) => {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        axios.get('http://localhost:3001/mensagens')
            .then(response => {
                setData(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const contatosUnicos: Mensagem[] = Object.values(
        data.reduce((acc, msg) => {
            if (!acc[msg.contato] || acc[msg.contato].horario > msg.horario) {
                acc[msg.contato] = msg;
            }
            return acc;
        }, {})
    );

    if (!contato) {
        return (
            <div className="flex flex-col flex-1 justify-between items-center py-8">
                <p> </p>
                <div className="flex flex-col items-center gap-4">
                    <img src={textimg} className='w-120 object-cover' />
                    <div className='flex flex-col items-center'>
                        <h1 className='text-3xl'>Selecione um contato</h1>
                        <p className='text-xs'>para iniciar uma conversa </p>
                    </div>
                </div>
                <p className="text-xs">© 2025 Desenvolvido por ACM. Todos os direitos reservados.</p>
            </div>
        )
    }

    return (
        <div className="flex-1">
            {contatosUnicos
                .filter(msg =>
                    msg.contato.toLowerCase().includes(contato.toLowerCase())
                )
                .map(msg => {
                    const mensagensDoContato = data.filter(m => m.contato === msg.contato);
                    const mensagensPorDia = agruparPorDia(mensagensDoContato);

                    return (
                        <div className="flex flex-col bg-zinc-700/50 h-screen overflow-hidden" key={msg.id}>
                            <div className="flex gap-3 p-2 items-center justify-between bg-zinc-800 px-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/5 p-3 rounded-full w-fit border-1 border-zinc-600">
                                        <User fill="#fff" />
                                    </div>
                                    <p className="truncate">{msg.contato}</p>
                                </div>
                            </div>

                            <div className="flex-1 gap-1 overflow-y-auto">
                                <div className="flex-1 p-4">
                                    {Object.entries(mensagensPorDia).map(([data, mensagens]) => (
                                        <div key={data} className=' space-y-1'>
                                            <div className="flex w-full items-center justify-center text-center text-xs text-white/50 my-2">
                                                <p className='bg-zinc-800 w-fit p-2 rounded-md'>{data}</p>
                                            </div>
                                            {mensagens.map((mensagem, index) => (
                                                <div key={index} className={`flex ${mensagem.remetente === 'Você' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`px-4 py-2 rounded-lg max-w-[50%] text-sm ${mensagem.remetente === 'Você' ? 'bg-emerald-500 text-white' : 'bg-zinc-600 text-white'} relative`}>
                                                        <p className={`${mensagem.texto === '' ? 'flex aspect-square items-center' : ''} ${mensagem.remetente === 'Você' ? 'mr-6' : 'mr-6'}`}>
                                                            {!mensagem.texto ? "FIGURINHA/IMAGEM" : mensagem.texto}
                                                        </p>
                                                        <p className='absolute text-[11px] text-white/50 text-right bottom-1 right-2'>{mensagem.horaFormatada}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="sticky flex bottom-2 rounded-full mx-2 bg-zinc-700 h-12 items-center overflow-hidden">
                                <input type="text" placeholder="Digite uma mensagem" className="w-full h-full outline-none px-5 text-xs" />
                                <div className='bg-emerald-500 py-5 px-10 pr-10 rounded-md hover:bg-emerald-400 cursor-pointer'>
                                    <Send />
                                </div>
                            </div>
                        </div>
                    );
                })}

        </div >
    );
};

export default ChatView;
