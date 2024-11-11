import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getTokenData } from './authUtils';
import styled from 'styled-components';
import whatsapp from '../assets/whatsapp.jpeg';
// Styled Components for ChatSpace
const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 80vh;
    max-width: 600px;
    margin: 0 auto;
    background-image: url(${whatsapp});
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;


    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    font-family: Arial, sans-serif;
    position: relative;


    @media (max-width: 768px) {
        max-width: 100%;
        height: 100vh;
    }
`;


const Messages = styled.div`
    flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
    scroll-behavior: smooth;
`;

const DateGroup = styled.div`
    text-align: center;
    margin: 8px 0;
`;

const Date = styled.div`
    display: inline-block;
    padding: 4px 8px;
    background-color: #d3d3d3;
    border-radius: 12px;
    color: #555;
    font-size: 11px;
`;

const MessageBubble = styled.div`
    display: block;
    max-width: 75%;
    padding: 8px 10px;
    margin: 4px 0;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.4;
    clear: both;
    background-color: ${props => (props.sent ? '#dcf8c6' : '#ffffff')};
    align-self: ${props => (props.sent ? 'flex-end' : 'flex-start')};
    text-align: ${props => (props.sent ? 'left' : 'left')};
    border-bottom-${props => (props.sent ? 'left' : 'right')}-radius: 2px;
`;

const SenderInfo = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #555;
`;

const ChatForm = styled.form`
    display: flex;
    align-items: center;
    padding: 8px;
    border-top: 1px solid #ddd;
    background-color: #f0f0f0;
`;

const ChatInput = styled.input`
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 20px;
    background-color: #fff;
    min-width:30%;
    outline: none;
    font-size: 13px;
`;

const SendButton = styled.button`
    padding: 6px 12px;
    background-color: #25d366;
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    outline: none;
    font-size: 13px;
`;

function ChatSpace() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAtBottom, setIsAtBottom] = useState(true);
    const tokenData = getTokenData();
    const department = tokenData ? tokenData.department : '';
    const messagesEndRef = useRef(null); // To scroll to the bottom when a new message is sent
    const messagesContainerRef = useRef(null); // To detect whether the user has scrolled up

    useEffect(() => {
        // Fetch messages on page load
        axios.get('http://localhost:3000/chat/messages')
            .then(response => setMessages(response.data))
            .catch(error => console.error(error));

        // Polling for real-time updates
        const interval = setInterval(() => {
            axios.get('http://localhost:3000/chat/messages')
                .then(response => setMessages(response.data))
                .catch(error => console.error(error));
        }, 1000); // Poll every 2 seconds

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            // Add the new message to the backend
            await axios.post('http://localhost:3000/chat/addMessage', { sender: department, message: newMessage });
            // Clear the message input and add the message to the UI
            setNewMessage('');
            setMessages([...messages, { sender: department, message: newMessage, date: new Date().toISOString(), time: new Date().toLocaleTimeString() }]);
            setIsAtBottom(true); // Ensure we scroll down after sending a message
            scrollToBottom(); // Scroll immediately after sending
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // Scroll to bottom only on load or when a new message is added
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [messages]); // Trigger scroll whenever the messages change

    // Detect if the user has scrolled up or is at the bottom
    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (container) {
            const isUserAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 5;
            setIsAtBottom(isUserAtBottom);
        }
    };

    const groupedMessages = messages.reduce((acc, message) => {
        const date = message.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(message);
        return acc;
    }, {});

    function formatDateToDDMMYYYY(dateString) {
        // Slice the string to get the date part (YYYY-MM-DD)
        const datePart = dateString.slice(0, 10);
        
        // Split the date into [YYYY, MM, DD]
        const [year, month, day] = datePart.split('-');
        
        // Return the formatted string in DD-MM-YYYY format
        return `${day}-${month}-${year}`;
    }
    function formattime(time) {
        // Slice the string to get the date part (YYYY-MM-DD)
        const datePart = time.slice(0, 5);
        // Return the formatted string in DD-MM-YYYY format
        return datePart;
    }

    return (
        <ChatContainer>
            <Messages ref={messagesContainerRef} onScroll={handleScroll}>
                {Object.keys(groupedMessages).map(date => (
                    <DateGroup key={date}>
                        <Date>{formatDateToDDMMYYYY(date)}</Date>
                        {groupedMessages[date].map((msg, index) => (
                            <MessageBubble key={index} sent={msg.sender === department}>
                                <SenderInfo>
                                    <span>{msg.sender}</span>
                                    <small>{formattime(msg.time)}</small>
                                </SenderInfo>
                                <p>{msg.message}</p>
                            </MessageBubble>
                        ))}
                    </DateGroup>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll marker */}
            </Messages>
            <ChatForm onSubmit={handleSubmit}>
                <ChatInput
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    required
                />
                <SendButton type="submit">Send</SendButton>
            </ChatForm>
        </ChatContainer>
    );
}

export default ChatSpace;
