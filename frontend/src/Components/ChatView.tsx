import { useEffect, useState } from 'react';
import textimg from '../assets/text-messages.png'
import axios from 'axios';
import { User, X } from 'lucide-react';



type ChatViewProps = {
    setContactSelected: (contato: string) => void;
    contato: string | null;
};

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

    const contatosUnicos = Object.values(
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

                    return (
                        <div className="flex flex-col bg-zinc-700/50 h-screen overflow-hidden" key={msg.key}>
                            <div className="flex gap-3 p-2 items-center justify-between bg-zinc-800 px-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/5 p-3 rounded-full w-fit border-1 border-zinc-600">
                                        <User fill="#fff" />
                                    </div>
                                    <p className="truncate">{msg.contato}</p>
                                </div>
                            </div>
                            <div className="flex-1 gap-1 overflow-y-auto">
                                <div className="flex-1 p-4 space-y-1">
                                    {mensagensDoContato.map((mensagem, index) => (
                                        <div key={index} className={`flex ${mensagem.remetente === 'Você' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`px-4 py-2 rounded-lg max-w-xs text-sm ${mensagem.remetente === 'Você' ? 'bg-emerald-500 text-white' : 'bg-zinc-600 text-white'}`}>
                                                <p className={`${mensagem.texto === '' ? 'flex aspect-square items-center' : ''}`}>{mensagem.texto === '' ? 'FIGURINHA/IMAGEM' : mensagem.texto}</p>
                                                <p className='text-xs text-white/50 text-right'>{mensagem.horario}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="sticky bottom-2 rounded-full mx-2 bg-zinc-700 px-4 py-3">
                                <input type="text" placeholder='Digite uma mensagem' className='w-full h-full outline-none' />
                            </div>
                        </div>
                    );
                })}

        </div >
    );
};

export default ChatView;
