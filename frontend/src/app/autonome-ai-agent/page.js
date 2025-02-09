"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScaleLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const typeMessage = (text, callback) => {
    let index = 0;
    let currentText = "";
    const interval = setInterval(() => {
      if (index < text.length) {
        currentText += text.charAt(index);
        callback(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://autonome.alt.technology/mentor-ygeoaz/c17e7c31-e9a8-0470-af0e-5e014e2b84bd/message",
        { text: input },
        {
          auth: {
            username: "mentor",
            password: "clyrcpCHRW",
          },
        }
      );

      console.log("Full API Response:", response.data);

      if (!response.data || response.data.length === 0 || !response.data[0].text) {
        console.error("API returned an invalid response:", response.data);
        toast.error("Invalid response from API. Please try again.");
        return;
      }

      const formattedText = response.data[0].text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      let botMessage = { role: "bot", text: "" };
      setMessages((prev) => [...prev, botMessage]);
      typeMessage(formattedText, (updatedText) => {
        setMessages((prev) => {
          let updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = { role: "bot", text: updatedText };
          return updatedMessages;
        });
      });
    } catch (error) {
      console.error("Error fetching response:", error.response ? error.response.data : error.message);
      toast.error(`Error: ${error.response?.status} - ${error.response?.data?.message || "Failed to fetch response."}`);
    }
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gradient-to-r from-gray-900 via-purple-900 to-black p-4">
      <header className="shadow-sm py-4">
        <h1 className="text-2xl font-bold text-center text-white">Ask any AI-Blockchain related doubts 🤖💡</h1>
      </header>
      <div className="flex-1 overflow-auto" ref={chatContainerRef}>
        <Card className="w-[90%] mx-auto h-[65vh] overflow-y-auto bg-gray-800 border border-purple-500 shadow-lg rounded-lg">
          <CardContent className="h-full p-4 border text-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 my-2 rounded-lg max-w-[60%] ${
                  msg.role === "user" ? "bg-purple-600 text-white ml-auto" : "bg-gray-700 text-white"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ))}
            {loading && <div className="text-gray-400"><ScaleLoader color="#A855F7" height={15} /></div>}
          </CardContent>
        </Card>
      </div>
      <div className="w-full flex items-center p-4 bg-gray-900 border-t border-purple-500 sticky bottom-0">
        <div className="w-full max-w-2xl mx-auto flex items-center">
          <Input
            className="flex-1 px-4 py-2 border rounded-l-md bg-gray-700 text-white border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 ml-[10px] rounded-r-md" onClick={sendMessage} disabled={loading}>
            {loading ? <ScaleLoader color="#fff" height={15} /> : "Send"}
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
