"use client";
import { ArrowUpIcon, X, BotMessageSquare } from "lucide-react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast";
import { MessageContent } from "./message-content";
import { Button } from "./ui/button";


interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

export function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const toast = useToast();

    // Function to scroll to the bottom of the messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-focus for textarea when chat is opened
    useEffect(() => {
        if (open) {
            textareaRef.current?.focus();
        }
    }, [open]);

    // Persist messages in Session Storage
    useEffect(() => {
        if (open) {
            const savedMessages = sessionStorage.getItem("chat-messages");
            if (savedMessages) {
                try {
                    setMessages(JSON.parse(savedMessages));
                } catch (error) {
                    console.error("Error parsing saved messages:", error);
                }
            }
        }
    }, [open]);

    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem("chat-messages", JSON.stringify(messages));
        }
    }, [messages]);

    const clearHistory = () => {
        setMessages([]);
        sessionStorage.removeItem("chat-messages");
    }

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/chatbot/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    conversationHistory: messages.slice(-6), // Last 6 messages
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            toast.error("Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
            const errorMessage: Message = {
                role: 'assistant',
                content: "Lo siento, ha ocurrido un error al procesar tu solicitud.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    const randomChatName = () => {
        const names = ["Cabezón", "A.Abejita", "BlackHill", "Tomatitos", "EEEEste CUUURSO", "Batman", "Asistente Heurístico", "Alexelcapo", "Comepalomas", "Chiwawa", "Jordaneza"];

        return names[Math.floor(Math.random() * names.length)];
    }

    const chatName = randomChatName();

    return (
        <div className="flex align-end justify-end w-full max-w-sm gap-6 z-50 fixed bottom-4 right-4 max-h-[80vh]">
            {open ? (
                <div className="flex flex-col bg-background border rounded-lg shadow-xl w-full max-w-md h-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <BotMessageSquare className="w-5 h-5" />
                            <h3 className="font-semibold">{chatName}</h3>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-full p-1 hover:bg-primary-foreground/20 transition-colors hover:cursor-pointer"
                            aria-label="Cerrar chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                <BotMessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">
                                    ¡Hola! Soy tu asistente virtual.
                                    <br />
                                    ¿En qué puedo ayudarte hoy?
                                </p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-foreground'
                                            }`}
                                    >
                                        <MessageContent content={msg.content} />
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted rounded-lg px-4 py-2">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t p-4">
                        <InputGroup>
                            <InputGroupAddon align="block-start">
                                <InputGroupTextarea
                                    ref={textareaRef}
                                    placeholder="Escribe tu mensaje..."
                                    rows={1}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={isLoading}
                                    className="resize-none"
                                />
                            </InputGroupAddon>
                            <InputGroupAddon align="block-end" className="flex justify-end">
                                {/* Limpiar historial */}
                                <Button
                                    variant="destructive"
                                    className="rounded-full hover:cursor-pointer ml-2 h-8"
                                    onClick={clearHistory}
                                    disabled={messages.length === 0}
                                    aria-label="Limpiar historial de chat"
                                >
                                    Limpiar mensajes
                                </Button>
                                <InputGroupButton
                                    variant="default"
                                    className="rounded-full hover:cursor-pointer h-8 w-8"
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                >
                                    <ArrowUpIcon />
                                    <span className="sr-only">Enviar</span>
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>
            ) : (
                <button
                    className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:cursor-pointer"
                    onClick={() => setOpen(true)}
                    aria-label="Abrir chat"
                >
                    <BotMessageSquare className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}