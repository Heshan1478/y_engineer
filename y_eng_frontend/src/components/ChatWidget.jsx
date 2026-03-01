// src/components/ChatWidget.jsx
import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setMessages([{
        id: Date.now(),
        type: 'bot',
        text: "Hi! 👋 I'm your product assistant. Ask me anything about our water pumps, motors, and equipment!",
        timestamp: new Date()
      }]);
      
      // Load suggestions
      loadSuggestions();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSuggestions = async () => {
    try {
      const response = await chatAPI.getSuggestions();
      setSuggestions(response.data.suggestions || []);
    } catch (err) {
      console.error('Error loading suggestions:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.query(messageText);
      const { message, products, count } = response.data;

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: message,
        products: products || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error('Chat error:', err);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={styles.floatingButton}>
          <span style={styles.chatIcon}>💬</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <span style={styles.headerIcon}>🤖</span>
              <div>
                <h3 style={styles.headerTitle}>Product Assistant</h3>
                <p style={styles.headerSubtitle}>Online now</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeButton}>
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((msg) => (
              <div key={msg.id} style={styles.messageWrapper}>
                <div style={msg.type === 'user' ? styles.userMessage : styles.botMessage}>
                  <p style={styles.messageText}>{msg.text}</p>
                  
                  {/* Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div style={styles.productsGrid}>
                      {msg.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={styles.messageWrapper}>
                <div style={styles.botMessage}>
                  <div style={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {messages.length === 1 && suggestions.length > 0 && (
              <div style={styles.suggestionsContainer}>
                <p style={styles.suggestionsLabel}>Try asking:</p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(suggestion)}
                    style={styles.suggestionButton}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about products..."
              style={styles.input}
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={styles.sendButton}
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}

// Product Card Component
function ProductCard({ product }) {
  const handleClick = () => {
    window.location.href = `/products/${product.id}`;
  };

  return (
    <div style={styles.productCard} onClick={handleClick}>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} style={styles.productImage} />
      )}
      <div style={styles.productInfo}>
        <h4 style={styles.productName}>{product.name}</h4>
        <p style={styles.productPrice}>Rs. {Number(product.price).toLocaleString()}</p>
        {product.stockQty > 0 ? (
          <span style={styles.inStock}>✓ In Stock</span>
        ) : (
          <span style={styles.outOfStock}>Out of Stock</span>
        )}
      </div>
    </div>
  );
}

const styles = {
  floatingButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: '50%',
    backgroundColor: '#E65C00',
    border: 'none',
    boxShadow: '0 4px 12px rgba(230, 92, 0, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'transform 0.2s',
  },
  chatIcon: {
    fontSize: 28,
  },
  chatWindow: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    width: 380,
    height: 600,
    backgroundColor: 'white',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#E65C00',
    color: 'white',
    padding: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: 12,
    margin: 0,
    opacity: 0.9,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: 32,
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E65C00',
    color: 'white',
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: 12,
    borderRadius: 12,
    maxWidth: '85%',
  },
  messageText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.5,
  },
  productsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    display: 'flex',
    gap: 12,
    cursor: 'pointer',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  productImage: {
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: 6,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#1a1a2e',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65C00',
    margin: '0 0 4px 0',
  },
  inStock: {
    fontSize: 12,
    color: '#4CAF50',
  },
  outOfStock: {
    fontSize: 12,
    color: '#F44336',
  },
  typingIndicator: {
    display: 'flex',
    gap: 4,
  },
  suggestionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
  },
  suggestionsLabel: {
    fontSize: 12,
    color: '#666',
    margin: 0,
  },
  suggestionButton: {
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'left',
    color: '#E65C00',
    transition: 'background-color 0.2s',
  },
  inputContainer: {
    padding: 16,
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: 14,
    border: '2px solid #e0e0e0',
    borderRadius: 24,
    outline: 'none',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: '#E65C00',
    border: 'none',
    color: 'white',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};