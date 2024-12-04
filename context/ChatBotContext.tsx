"use client";
import { BACKEND_URL } from "@/app/config/config";
import { createContext, useContext, useState } from "react";

interface Message {
  user: string;
  bot: string;
}

interface ChatbotContextValue {
  messages: Message[];
  userInput: string;
  botResponse: string;
  handleUserInput: (input: string) => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextValue | undefined>(
  undefined
);

interface ChatbotProps {
  children: React.ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [botResponse, setBotResponse] = useState<string>("");

  const handleUserInput = async (input: string) => {
    setUserInput(input);
    // Call API or logic to get bot response
    const response = await getBotResponse(input);
    setBotResponse(response);
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: input, bot: response },
    ]);
  };

  const getBotResponse = async (input: string): Promise<string> => {
    const apiEndpoint = `${BACKEND_URL}/api/chat`;
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ input });

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers,
        body,
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        userInput,
        botResponse,
        handleUserInput,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextValue => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
