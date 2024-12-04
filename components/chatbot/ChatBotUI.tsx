"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import { useChatbot } from "@/context/ChatBotContext";
import Loader from "../Loader";

const ChatFlow = () => {
  const { messages, userInput, handleUserInput, loading } = useChatbot();
  const [inputValue, setInputValue] = useState(userInput);
  const [dragging, setDragging] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatbotRef = useRef<HTMLDivElement | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const lastTap = useRef<number>(0);
  const initialPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const applyInitialPosition = () => {
      if (chatbotRef.current) {
        const rect = chatbotRef.current.getBoundingClientRect();
        const margin = 10; // Margin from screen edges

        // Calculate initial position
        initialPosition.current = {
          x: Math.min(window.innerWidth - rect.width - margin, margin),
          y: Math.min(
            (window.innerHeight - rect.height) / 2,
            window.innerHeight - rect.height - margin
          ),
        };

        // Apply position
        chatbotRef.current.style.transform = `translate(${initialPosition.current.x}px, ${initialPosition.current.y}px)`;
      }
    };

    applyInitialPosition();

    // Adjust on window resize
    const handleResize = () => {
      if (chatbotRef.current) {
        const rect = chatbotRef.current.getBoundingClientRect();
        const margin = 10;

        const newLeft = Math.min(
          Math.max(0, rect.left),
          window.innerWidth - rect.width - margin
        );
        const newTop = Math.min(
          Math.max(0, rect.top),
          window.innerHeight - rect.height - margin
        );

        chatbotRef.current.style.transform = `translate(${newLeft}px, ${newTop}px)`;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isChatbotVisible]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleDoubleTapToDrag = (event: React.TouchEvent<HTMLDivElement>) => {
    const currentTime = new Date().getTime();
    const tapInterval = currentTime - lastTap.current;

    if (tapInterval < 300 && chatbotRef.current) {
      const rect = chatbotRef.current.getBoundingClientRect();
      dragOffset.current.x = event.touches[0].clientX - rect.left;
      dragOffset.current.y = event.touches[0].clientY - rect.top;
      setDragging(true);
    }
    lastTap.current = currentTime;
  };

  const handleMouseDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    if (chatbotRef.current) {
      const rect = chatbotRef.current.getBoundingClientRect();
      dragOffset.current.x = event.clientX - rect.left;
      dragOffset.current.y = event.clientY - rect.top;
      setDragging(true);
      document.body.style.overflow = "hidden"; // Prevent scrolling when dragging
      document.body.style.touchAction = "none"; // Prevent dragging of the body
      document.addEventListener("selectstart", handleSelectStart, true);
    }
  };

  const handleDragMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!dragging || !chatbotRef.current) return;

      const clientX =
        "touches" in event
          ? event.touches[0].clientX
          : (event as MouseEvent).clientX;
      const clientY =
        "touches" in event
          ? event.touches[0].clientY
          : (event as MouseEvent).clientY;

      // Calculate new position while ensuring the chatbot stays within the viewport boundaries
      const rect = chatbotRef.current.getBoundingClientRect();
      const margin = 10; // Margin from screen edges

      // Get the new positions, ensuring boundaries
      const newX = Math.min(
        Math.max(0, clientX - dragOffset.current.x),
        window.innerWidth - rect.width - margin
      );
      const newY = Math.min(
        Math.max(0, clientY - dragOffset.current.y),
        window.innerHeight - rect.height - margin
      );

      // Update position directly
      if (chatbotRef.current) {
        chatbotRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }

      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    },
    [dragging]
  );

  const handleDragEnd = useCallback(() => {
    setDragging(false);
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    document.removeEventListener("selectstart", handleSelectStart, true);
  }, []);

  const handleSelectStart = (event: Event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => handleDragMove(event);
    const handleGlobalTouchMove = (event: TouchEvent) => handleDragMove(event);

    const handleGlobalMouseUp = () => handleDragEnd();
    const handleGlobalTouchEnd = () => handleDragEnd();

    if (dragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("touchmove", handleGlobalTouchMove);
      window.addEventListener("touchend", handleGlobalTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [dragging, handleDragMove, handleDragEnd]);

  const toggleChatbotVisibility = () => {
    setIsChatbotVisible((prevState) => !prevState);
    if (!isChatbotVisible) {
      document.body.style.touchAction = "none";
    } else {
      document.body.style.touchAction = "";
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUserInput(inputValue);
    setInputValue("");
  };

  // Prevent scroll behavior while dragging
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (dragging) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [dragging]);

  return (
    <>
      <div
        onClick={toggleChatbotVisibility}
        className="fixed bottom-4 right-4 p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg cursor-pointer z-50 transition-transform transform hover:scale-110 focus:scale-110"
      >
        <FaRobot size={28} />
      </div>

      {isChatbotVisible && (
        <div
          ref={chatbotRef}
          className="chatbot-ui min-w-fit max-w-md mx-auto p-4 bg-gradient-to-b from-white to-pink-50 rounded-lg shadow-xl z-40"
          style={{
            position: "absolute",
            cursor: dragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDragStart}
          onTouchStart={handleDoubleTapToDrag}
        >
          <h1 className="text-2xl font-bold text-center mb-4 text-pink-600">
            ChatFlow
          </h1>

          <div
            className="chat-container mb-4 overflow-y-auto max-h-64 p-2 bg-white shadow-inner rounded-lg"
            ref={chatContainerRef}
          >
            <ul className="list-none">
              {loading && <Loader />}
              {messages &&
                messages.map((message, index) => (
                  <li key={index} className="mb-2 flex flex-col space-y-1">
                    <div
                      className={`message self-end p-2 rounded-lg max-w-xs ${
                        message.user
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : ""
                      }`}
                    >
                      {message.user}
                    </div>
                    <div
                      className={`message self-start p-2 rounded-lg max-w-xs ${
                        message.bot
                          ? "bg-gradient-to-l from-purple-500 to-pink-500 text-white"
                          : ""
                      }`}
                    >
                      {message.bot}
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-2 mt-2 rounded-md border bg-white text-pink-600 shadow-md"
              placeholder="Type a message..."
            />
          </form>
        </div>
      )}
    </>
  );
};

export default ChatFlow;
