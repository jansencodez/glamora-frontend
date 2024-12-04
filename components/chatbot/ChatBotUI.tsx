"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import { useChatbot } from "@/context/ChatBotContext";

const ChatbotUI = () => {
  const { messages, userInput, handleUserInput } = useChatbot();
  const [inputValue, setInputValue] = useState(userInput);
  const [dragging, setDragging] = useState(false);
  const [doubleTapReady, setDoubleTapReady] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const chatbotRef = useRef<HTMLDivElement | null>(null);
  const doubleTapTimeout = useRef<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const initialPosition = useRef({ x: 0, y: 0 });

  // Adjust position logic

  useEffect(() => {
    if (chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      chatContainer.scrollTop = chatContainer?.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const applyInitialPosition = () => {
      if (chatbotRef.current) {
        const rect = chatbotRef.current.getBoundingClientRect();
        const margin = 10; // 10px margin from the edge
        initialPosition.current = {
          x: window.innerWidth - rect.width - margin, // Ensure it's not off the screen
          y: (window.innerHeight - rect.height) / 2, // Centered vertically
        };

        // Update position
        chatbotRef.current.style.transform = `translate(${initialPosition.current.x}px, ${initialPosition.current.y}px)`;
      }
    };

    // Apply the initial position
    applyInitialPosition();

    // Resize listener to adjust position dynamically
    const handleResize = () => {
      if (chatbotRef.current) {
        const rect = chatbotRef.current.getBoundingClientRect();
        const maxWidth = window.innerWidth - 20; // Leave 10px padding on each side

        // Calculate the new width, ensuring the chatbot stays within the viewport
        const newWidth = Math.min(rect.width, maxWidth);

        // Apply the updated width
        chatbotRef.current.style.width = `${newWidth}px`;
      }
    };

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isChatbotVisible]);

  // Prevent scrolling when dragging
  useEffect(() => {
    if (dragging) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = ""; // Reset on cleanup
    };
  }, [dragging]);

  const handleDoubleTap = useCallback(() => {
    setDoubleTapReady(true);
    if (doubleTapTimeout.current) {
      clearTimeout(doubleTapTimeout.current);
    }
    doubleTapTimeout.current = window.setTimeout(() => {
      setDoubleTapReady(false);
    }, 300); // Timeout for double-tap readiness
  }, []);

  const handleMouseDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    if (chatbotRef.current) {
      const rect = chatbotRef.current.getBoundingClientRect();
      dragOffset.current.x = event.clientX - rect.left;
      dragOffset.current.y = event.clientY - rect.top;
      setDragging(true);
    }
  };

  const handleTouchDragStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!doubleTapReady) return; // Allow drag only after double-tap

    if (chatbotRef.current) {
      const rect = chatbotRef.current.getBoundingClientRect();
      dragOffset.current.x = event.touches[0].clientX - rect.left;
      dragOffset.current.y = event.touches[0].clientY - rect.top;
      setDragging(true);
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

      const rect = chatbotRef.current.getBoundingClientRect();
      const newLeft = clientX - dragOffset.current.x;
      const newTop = clientY - dragOffset.current.y;

      // Restrict the chatbot's position within screen boundaries
      const clampedLeft = Math.max(
        0,
        Math.min(newLeft, window.innerWidth - rect.width)
      );
      const clampedTop = Math.max(
        0,
        Math.min(newTop, window.innerHeight - rect.height)
      );

      chatbotRef.current.style.transform = `translate(${clampedLeft}px, ${clampedTop}px)`;
    },
    [dragging]
  );

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

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

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleUserInput(inputValue);
      setInputValue("");
    },
    [handleUserInput, inputValue]
  );

  const toggleChatbotVisibility = () => {
    setIsChatbotVisible((prevState) => !prevState);
    if (!isChatbotVisible) {
      document.body.style.touchAction = "none";
    } else {
      document.body.style.touchAction = "";
    }
  };

  return (
    <>
      <div
        onClick={toggleChatbotVisibility}
        className="fixed bottom-4 right-4 p-4 bg-pink-500 text-white rounded-full shadow-lg cursor-pointer z-50"
      >
        <FaRobot size={24} />
      </div>

      {isChatbotVisible && (
        <div
          ref={chatbotRef}
          className="chatbot-ui max-w-md mx-auto p-4 bg-pink-100 rounded-lg shadow-lg z-40"
          style={{
            position: "absolute",
            cursor: dragging ? "grabbing" : "grab",
            width: "auto",
          }}
          onMouseDown={handleMouseDragStart}
          onTouchStart={(event) => {
            handleDoubleTap(); // Check for double-tap readiness
            handleTouchDragStart(event); // Initiate drag if ready
          }}
        >
          <h1 className="text-3xl font-semibold text-center mb-4 text-pink-700">
            Chatbot
          </h1>

          <div
            className="chat-container mb-4 overflow-y-auto max-h-60"
            ref={chatContainerRef}
          >
            <ul className="list-none">
              {messages.map((message, index) => (
                <li key={index} className="mb-3 flex flex-col space-y-2">
                  <div
                    className={`message self-end p-2 rounded-lg max-w-xs ${
                      message.user ? "bg-pink-500 text-white" : "bg-transparent"
                    }`}
                  >
                    {message.user}
                  </div>
                  <div
                    className={`message self-start p-2 rounded-lg max-w-xs ${
                      message.bot
                        ? "bg-pink-200 text-pink-700"
                        : "bg-transparent"
                    }`}
                  >
                    {message.bot}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="p-2 border-2 border-pink-500 rounded-md"
              placeholder="Type your message"
            />
            <button
              type="submit"
              className="p-2 bg-pink-500 text-white rounded-md"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotUI;
