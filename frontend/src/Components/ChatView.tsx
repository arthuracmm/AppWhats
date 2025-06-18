import textimg from '../assets/text-messages.png'

type ChatViewProps = {
    contato: string | null;
};

const ChatView = ({ contato }: ChatViewProps) => {
    if (!contato) {
        return (
            <div className="flex flex-1 justify-center items-center">
                <div className="flex flex-col items-center">
                    <img src={textimg} className='w-150 object-cover'/>
                    <h1 className='text-4xl'>Selecione um contato</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-">
            <h2>Conversa com {contato}</h2>
            {/* Renderize aqui as mensagens do contato selecionado */}
        </div>
    );
};

export default ChatView;
