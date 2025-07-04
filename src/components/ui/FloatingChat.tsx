'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Phone, Mail } from 'lucide-react'

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '¡Hola! 👋 Soy el asistente virtual de A&A+ Seguros. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Predefined responses
  const responses = {
    cotizar: '¡Perfecto! Te ayudo a cotizar tu seguro. ¿Qué tipo de seguro necesitas? 🚗 Auto, 🏠 Hogar, ❤️ Vida, 🏥 Salud, ✈️ Viaje o 🏢 Empresarial',
    auto: 'Excelente elección. Para cotizar tu seguro automotriz necesito algunos datos. ¿Cuál es la marca y modelo de tu vehículo?',
    hogar: 'Te ayudo con tu seguro de hogar. ¿Cuál es el valor aproximado de tu propiedad?',
    vida: 'El seguro de vida es muy importante. ¿Qué monto de cobertura te interesa?',
    salud: 'Para el seguro de salud, ¿cuántas personas incluirías en la póliza?',
    viaje: '¿A qué destino planeas viajar y por cuántos días?',
    empresarial: 'Para tu seguro empresarial, ¿cuál es el giro de tu empresa?',
    contacto: 'Puedes contactarnos por: 📞 600 123 4567 | 📧 contacto@segurosayamas.cl | 🕒 Lun-Vie 8:00-18:00',
    horario: 'Nuestro horario de atención es de Lunes a Viernes de 8:00 a 18:00 hrs. ¡Pero este chat está disponible 24/7!',
    precio: 'Los precios varían según el tipo de seguro y cobertura. ¿Qué seguro te interesa para darte un rango de precios?',
    default: 'Gracias por tu mensaje. Te conectaré con uno de nuestros asesores especializados. También puedes llamarnos al 600 123 4567 📞'
  }

  const quickReplies = [
    { text: 'Cotizar seguro', value: 'cotizar' },
    { text: 'Contacto', value: 'contacto' },
    { text: 'Horarios', value: 'horario' },
    { text: 'Precios', value: 'precio' },
  ]

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          text: '¿Te puedo ayudar con algo específico? Puedes usar los botones de acceso rápido 👇',
          timestamp: new Date(),
        }])
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate bot response
    const botResponse = {
      id: Date.now() + 1,
      type: 'bot',
      text: generateResponse(messageText),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, botResponse])
    setIsTyping(false)
  }

  const generateResponse = (message: string) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('cotizar') || lowerMessage.includes('cotización')) {
      return responses.cotizar
    }
    if (lowerMessage.includes('auto') || lowerMessage.includes('carro') || lowerMessage.includes('vehículo')) {
      return responses.auto
    }
    if (lowerMessage.includes('hogar') || lowerMessage.includes('casa')) {
      return responses.hogar
    }
    if (lowerMessage.includes('vida')) {
      return responses.vida
    }
    if (lowerMessage.includes('salud')) {
      return responses.salud
    }
    if (lowerMessage.includes('viaje')) {
      return responses.viaje
    }
    if (lowerMessage.includes('empresa') || lowerMessage.includes('comercial')) {
      return responses.empresarial
    }
    if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('llamar')) {
      return responses.contacto
    }
    if (lowerMessage.includes('horario') || lowerMessage.includes('hora')) {
      return responses.horario
    }
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto')) {
      return responses.precio
    }

    return responses.default
  }

  const handleQuickReply = (value: string) => {
    handleSendMessage(responses[value as keyof typeof responses])
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${isOpen
          ? 'bg-neutral-600 hover:bg-neutral-700'
          : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 animate-bounce-light'
          }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Chat A&A+ Seguros</h3>
                <p className="text-sm opacity-90">Asistente Virtual</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs">En línea</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                    }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${message.type === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-800'
                    }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-neutral-600" />
                  </div>
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce animation-delay-200"></div>
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce animation-delay-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t border-neutral-200">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply.value}
                  onClick={() => handleQuickReply(reply.value)}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs hover:bg-neutral-200 transition-colors"
                >
                  {reply.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-full focus:outline-none focus:border-primary-500 text-sm"
              />
              <button
                onClick={() => handleSendMessage(newMessage)}
                className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Options */}
            <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-neutral-600">
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>600 123 4567</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>contacto@segurosayamas.cl</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingChat
