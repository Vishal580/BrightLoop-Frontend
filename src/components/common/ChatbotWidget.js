import React, { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { chatAPI } from "../../services/api"
import * as LoadingIcons from 'react-loading-icons'
import "../../styles/chatbot.css"

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const windowRef = useRef(null)
    const pos = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0, dragging: false })

    const toggleChat = () => setIsOpen(prev => !prev)
    const closeChat = () => setIsOpen(false)

    const handleSend = async e => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage = { type: "user", text: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")

        setMessages(prev => [...prev, { type: "loading", isLoading: true }]);

        try {
            const res = await chatAPI.chat(input)
            const cleanedText = res.data.reply.replace(/\[\d+\]/g, "")
            const primarySource = res.data.search_results?.[0]

            const aiMessage = {
                type: "ai",
                text: cleanedText || "No response from AI! Please try again.",
                sourceUrl: primarySource?.url || null,
            }

            setMessages(prev =>
                [...prev.filter(msg => !msg.isLoading), aiMessage]
            );
        } catch (err) {
            setMessages(prev =>
                [...prev.filter(msg => !msg.isLoading), { type: "ai", text: "Error getting response." }]
            );
        }
    }


    // Drag functionality
    useEffect(() => {
        const header = windowRef.current?.querySelector("#chatbot-header")

        const onMouseDown = e => {
            pos.current.dragging = true
            pos.current.offsetX = e.clientX - windowRef.current.offsetLeft
            pos.current.offsetY = e.clientY - windowRef.current.offsetTop
            document.addEventListener("mousemove", onMouseMove)
            document.addEventListener("mouseup", onMouseUp)
        }

        const onMouseMove = e => {
            if (!pos.current.dragging) return
            let x = e.clientX - pos.current.offsetX
            let y = e.clientY - pos.current.offsetY

            const maxX = window.innerWidth - windowRef.current.offsetWidth
            const maxY = window.innerHeight - windowRef.current.offsetHeight
            x = Math.max(0, Math.min(x, maxX))
            y = Math.max(0, Math.min(y, maxY))

            windowRef.current.style.left = `${x}px`
            windowRef.current.style.top = `${y}px`
        }

        const onMouseUp = () => {
            pos.current.dragging = false
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)
        }

        if (header) header.addEventListener("mousedown", onMouseDown)
        return () => header?.removeEventListener("mousedown", onMouseDown)
    }, [isOpen])

    return (
        <div id="chatbot-widget">
            <button id="chatbot-toggle" title="AI Assistant" onClick={toggleChat}>
                💬
            </button>

            {isOpen && (
                <div
                    id="chatbot-window"
                    ref={windowRef}
                    style={{ left: "unset", top: "unset" }}
                >
                    <div id="chatbot-header">
                        AI Assistant
                        <button id="chatbot-close" onClick={closeChat}>
                            ×
                        </button>
                    </div>

                    <div id="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chatbot-message ${msg.type}`}>
                                <div className="chat-markdown">
                                    {msg.type === "loading" ? (
                                        <div className="loading-dots-wrapper">
                                            <LoadingIcons.ThreeDots />
                                        </div>
                                    ) : (
                                        <>
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            {msg.type === "ai" && msg.sourceUrl && (
                                                <a
                                                    href={msg.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="source-link"
                                                >
                                                    Read More →
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form id="chatbot-form" onSubmit={handleSend}>
                        <input
                            id="chatbot-input"
                            type="text"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default ChatbotWidget
