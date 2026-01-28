import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { User, Conversation, ChatMessage } from '../../types';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import SystemHUD from './SystemHUD';
import { useAuth } from '../../context/AuthContext';
import { chatService, getConversationLimit } from '../../lib/chatService';

// Performance Boost: Lazy load all modals to reduce initial bundle size.
const LoadBalance = lazy(() => import('../modals/LoadBalance'));
const OnlineStore = lazy(() => import('../modals/OnlineStore'));
const OtherServices = lazy(() => import('../modals/OtherServices'));
const UserProfile = lazy(() => import('../modals/UserProfile'));
const PersonalizationModal = lazy(() => import('../modals/PersonalizationModal'));
const SettingsModal = lazy(() => import('../modals/SettingsModal'));
const ContentModal = lazy(() => import('../modals/ContentModal'));
const MembershipModal = lazy(() => import('../modals/MembershipModal'));
const ToolsModal = lazy(() => import('../modals/ToolsModal'));
const VipVaultModal = lazy(() => import('../modals/VipVaultModal'));
const CoreHubModal = lazy(() => import('../modals/CoreHubModal'));
const NotificationsModal = lazy(() => import('../modals/NotificationsModal'));
const LogoutConfirm = lazy(() => import('../modals/LogoutConfirm'));

// --- Types (fix TS7006 + make config safe) ---
type ModelId = 'gemini' | 'openai' | 'deepseek';
type AiRole = 'Estilo Original del Modelo' | 'Hacker de élite' | 'Compañero creativo';

type AiConfig = {
  role: AiRole;
  emojis: boolean;
  nickname: string;
  timezone: string;
  enabledModels: ModelId[];
  language: string;
  selectedModel: ModelId;
};

// --- Model guard (Option B compatibility with ChatWindow's string props) ---
const MODEL_IDS = ['gemini', 'openai', 'deepseek'] as const;
const isModelId = (m: string): m is ModelId => (MODEL_IDS as readonly string[]).includes(m);

// Simple loader for Suspense fallback
const ModalLoader: React.FC = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

// Security Enhancement: Basic XSS prevention for AI-generated content.
const sanitizeText = (text: string): string => {
  if (!text) return '';
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const parseErrorMessage = (error: string, model: string): string => {
  const defaultMessage = `El nodo ${model.toUpperCase()} no responde. Verifica tu conexión o intenta más tarde.`;
  if (!error) return defaultMessage;

  const lowerError = error.toLowerCase();

  if (lowerError.includes('server_config_error')) {
    return `[FALLA DE INTEGRIDAD DEL SISTEMA]\nEl núcleo no puede comunicarse con los servicios de autenticación. Las credenciales del servidor parecen estar desconfiguradas. El administrador ha sido notificado para una recalibración inmediata.`;
  }
  if (lowerError.includes('failed to fetch')) {
    return `[ERROR DE RED]\nNo se pudo establecer conexión con el nodo ${model.toUpperCase()}. Tu conexión a internet parece inestable o el servidor no está accesible. Por favor, verifica tu red e inténtalo de nuevo.`;
  }
  if (lowerError.includes('sesión_expirada')) {
    return `[FALLA DE SEGURIDAD]\nTu sesión ha expirado. Por favor, refresca la página para volver a iniciar sesión.`;
  }
  if (lowerError.includes('fallo_integridad_usuario') || lowerError.includes('operación_no_autorizada')) {
    return `[FALLA DE SEGURIDAD]\nTu sesión parece ser inválida. Intenta refrescar la página o volver a iniciar sesión.`;
  }
  if (lowerError.includes('api_key_missing')) {
    return `[ERROR DE ENLACE SEGURO]\nLa clave de API para el nodo ${model.toUpperCase()} no está configurada en el servidor. El administrador del sistema ha sido notificado.`;
  }
  if (error.includes('429') || lowerError.includes('límite')) {
    return `[LÍMITE DE TASA EXCEDIDO]\nSe han enviado demasiadas solicitudes al nodo ${model.toUpperCase()}. Por favor, espera unos momentos antes de volver a intentarlo.`;
  }
  if (error.includes('500') || error.includes('502') || error.includes('503')) {
    return `[ERROR DEL NODO REMOTO]\nEl servidor de ${model.toUpperCase()} está experimentando problemas o está en mantenimiento. Intenta de nuevo más tarde.`;
  }
  if (error.includes('400')) {
    return `[SOLICITUD INVÁLIDA]\nEl comando enviado contiene un formato no válido o no pudo ser procesado por el modelo. Intenta reformular tu pregunta.`;
  }
  if (error.includes('401') || error.includes('403')) {
    return `[ERROR DE AUTENTICACIÓN]\nFallo de seguridad en la conexión con el servidor de ${model.toUpperCase()}. El administrador ha sido notificado.`;
  }

  const cleanedMessage = error.replace(/ERROR_NODO_[A-Z]+:/, '').trim();
  return `[ERROR INESPERADO]\n${cleanedMessage || defaultMessage}`;
};

// Helper to map UI language names to ISO codes for TTS
const getLanguageCode = (langName: string): string => {
  const map: Record<string, string> = {
    'Español (México)': 'es-MX',
    'English (US)': 'en-US',
    'French': 'fr-FR',
    'German': 'de-DE',
    'Italian': 'it-IT',
    'Portuguese': 'pt-BR',
    'Japanese': 'ja-JP',
    'Korean': 'ko-KR',
    'Chinese (Simplified)': 'zh-CN',
    'Russian': 'ru-RU',
    'Arabic': 'ar-SA',
    'Hindi': 'hi-IN',
  };
  return map[langName] || 'es-MX';
};

const getEndpointForModel = (model: string): string => {
  switch (model) {
    case 'gemini':
      return '/api/gemini';
    case 'openai':
      return '/api/openai';
    case 'deepseek':
      return '/api/deepseek';
    default:
      console.warn(`Unsupported model selected: ${model}. Defaulting to Gemini.`);
      return '/api/gemini';
  }
};

const Dashboard: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const { session, isAdmin, signOut, refreshProfile } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const AI_CONFIG_KEY = `ai_config_${session?.user?.id || 'guest'}`;

  const defaultAiConfig: AiConfig = {
    role: 'Estilo Original del Modelo',
    emojis: true,
    nickname: user.username,
    timezone: 'America/Mexico_City',
    enabledModels: ['gemini', 'openai', 'deepseek'],
    language: 'Español (México)',
    selectedModel: 'gemini',
  };

  const [aiConfig, setAiConfig] = useState<AiConfig>(() => {
    try {
      const storedConfig = localStorage.getItem(AI_CONFIG_KEY);
      if (storedConfig) {
        const parsed = JSON.parse(storedConfig) as Partial<AiConfig>;
        return { ...defaultAiConfig, ...parsed, nickname: user.username };
      }
    } catch {
      console.warn('Could not parse stored AI config.');
    }
    return defaultAiConfig;
  });

  // Ensure nickname follows user.username if it changes
  useEffect(() => {
    if (aiConfig.nickname !== user.username) {
      setAiConfig((prev: AiConfig) => ({ ...prev, nickname: user.username }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.username]);

  // Persist AI config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(aiConfig));
    } catch {
      console.warn('Could not save AI config to storage.');
    }
  }, [aiConfig, AI_CONFIG_KEY]);

  const lastMessageTime = useRef<number>(0);
  const MESSAGE_COOLDOWN_MS = 2500;

  const loadHistory = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const limit = getConversationLimit(user.membership, isAdmin);
      const convs = await chatService.fetchConversations(session.user.id, limit);
      const mappedConvs = convs.map((c: any) => ({
        id: c.id,
        title: c.title,
        messages: [], // Lazy load messages on selection
      }));
      setConversations(mappedConvs);
    } catch (e: any) {
      if (e.message?.includes('SESIÓN_EXPIRADA')) signOut();
    }
  }, [session?.user?.id, user.membership, isAdmin, signOut]);

  const handleSelectConv = useCallback(
    async (id: string) => {
      setActiveId(id);
      const targetConv = conversations.find((c) => c.id === id);

      if (targetConv && targetConv.messages.length === 0) {
        setIsLoadingMessages(true);
        try {
          const messages = await chatService.fetchMessages(id);
          setConversations((prev: Conversation[]) => prev.map((c) => (c.id === id ? { ...c, messages } : c)));
        } catch (e) {
          console.error('Failed to fetch messages:', e);
        } finally {
          setIsLoadingMessages(false);
        }
      }
    },
    [conversations]
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSendMessage = async (
    text: string,
    model: string,
    attachment?: { data: string; mimeType: string }
  ) => {
    if (!session?.user?.id || isTyping) return;

    const now = Date.now();
    if (now - lastMessageTime.current < MESSAGE_COOLDOWN_MS) {
      const errorMsg: ChatMessage = {
        id: `e_ratelimit_${Date.now()}`,
        role: 'assistant',
        content:
          `[NÚCLEO SOBRECARGADO]\nHas enviado comandos demasiado rápido. Por favor, espera un momento para permitir que el sistema se estabilice.`,
        timestamp: Date.now(),
        model: 'SYSTEM',
        isError: true,
      };

      const convId = activeId || `conv_error_${Date.now()}`;

      if (!activeId) {
        const newConv = { id: convId, title: 'Error de Sistema', messages: [] };
        setConversations((prev: Conversation[]) => [newConv, ...prev]);
        setActiveId(convId);
      }

      setConversations((prev: Conversation[]) =>
        prev.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, errorMsg] } : c))
      );
      return;
    }

    lastMessageTime.current = now;

    let currentConvId = activeId;

    let userText = text;
    if (!userText.trim() && attachment) {
      userText = `Analiza el archivo adjunto y describe su contenido en detalle, siguiendo todas las demás instrucciones del sistema.`;
    }

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: sanitizeText(text) + (attachment ? ' [ARCHIVO_ADJUNTO]' : ''),
      timestamp: Date.now(),
    };

    try {
      if (!session?.access_token) {
        throw new Error('SESIÓN_EXPIRADA: Tu sesión no es válida. Refresca la página.');
      }

      if (!currentConvId) {
        const newConvData = await chatService.createConversation(
          session.user.id,
          text || 'Nuevo Comando',
          user.membership,
          isAdmin
        );
        currentConvId = newConvData.id;

        setConversations((prev: Conversation[]) => [
          { id: newConvData.id, title: newConvData.title, messages: [] },
          ...prev,
        ]);
        setActiveId(currentConvId);
      }

      if (!currentConvId) throw new Error('Fallo al crear o identificar la conversación.');

      await chatService.saveMessage(session.user.id, currentConvId, { ...userMsg, content: text });
      setConversations((prev: Conversation[]) =>
        prev.map((c) => (c.id === currentConvId ? { ...c, messages: [...c.messages, userMsg] } : c))
      );

      setIsTyping(true);

      const assistantMsgId = `a_${Date.now()}`;
      const placeholderMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        model: model.toUpperCase(),
      };

      setConversations((prev: Conversation[]) =>
        prev.map((c) => (c.id === currentConvId ? { ...c, messages: [...c.messages, placeholderMsg] } : c))
      );

      const baseSystemInstruction =
        `Tu identidad principal: Eres un experto en tecnología de México. ` +
        `Tu lenguaje OBLIGATORIO Y ÚNICO es Español de México. ` +
        `TODAS tus respuestas deben ser en este idioma, sin excepciones. ` +
        `Si un usuario te habla en otro idioma, responde en Español de México que es tu único canal de comunicación. ` +
        `Mantén un tono profesional pero amigable. Ayuda al usuario '${aiConfig.nickname}'.`;

      let roleInstruction = '';
      switch (aiConfig.role) {
        case 'Hacker de élite':
          roleInstruction = `Actúa como un hacker de élite. Tu estilo es cyber-punk, directo, conciso y técnico. Usa jerga de hacking. ${
            aiConfig.emojis ? 'Usa emojis temáticos sutiles (💀, 🤖, ⚡).' : 'No uses emojis.'
          }`;
          break;
        case 'Compañero creativo':
          roleInstruction = `Actúa como un compañero creativo. Tu enfoque es el brainstorming y las ideas innovadoras. Sé inspirador. ${
            aiConfig.emojis ? 'Usa emojis para expresar creatividad (✨, 💡, 🚀).' : 'No uses emojis.'
          }`;
          break;
        default:
          roleInstruction = `Mantén tu estilo original, pero sé amigable y servicial. ${
            aiConfig.emojis ? 'Puedes usar emojis de forma sutil.' : 'No uses emojis.'
          }`;
          break;
      }

      const system = `${baseSystemInstruction} ${roleInstruction}`;
      let fullResponse = '';

      const endpoint = getEndpointForModel(model);
      const reinforcedUserContent = `(RESPUESTA OBLIGATORIA EN ESPAÑOL DE MÉXICO) ${userText}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          model,
          system,
          userContent: reinforcedUserContent,
          attachment,
          language: aiConfig.language,
        }),
      });

      if (!response.ok || !response.body) {
        let errorText = await response.text();
        try {
          errorText = JSON.parse(errorText).message || errorText;
        } catch {
          // ignore
        }
        throw new Error(`ERROR_NODO_${model.toUpperCase()}: ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += sanitizeText(chunk);

        setConversations((prev: Conversation[]) =>
          prev.map((conv) => {
            if (conv.id === currentConvId) {
              const newMessages = [...conv.messages];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.id === assistantMsgId) {
                lastMessage.content = fullResponse;
              }
              return { ...conv, messages: newMessages };
            }
            return conv;
          })
        );
      }

      const finalAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: fullResponse || 'Error de recepción en el núcleo.',
        timestamp: Date.now(),
        model: model.toUpperCase(),
      };

      await chatService.saveMessage(session.user.id, currentConvId, finalAssistantMsg);
      refreshProfile();
    } catch (e: any) {
      if (e.message?.includes('SESIÓN_EXPIRADA')) {
        signOut();
        window.location.reload();
        return;
      }

      const errorMessageContent = parseErrorMessage(e.message, model);
      const errorMsg: ChatMessage = {
        id: `e_${Date.now()}`,
        role: 'assistant',
        content: errorMessageContent,
        timestamp: Date.now(),
        model: model.toUpperCase(),
        isError: true,
      };

      if (currentConvId) {
        setConversations((prev: Conversation[]) =>
          prev.map((c) => (c.id === currentConvId ? { ...c, messages: [...c.messages, errorMsg] } : c))
        );
      }
    } finally {
      setIsTyping(false);
    }
  };

  // ✅ OPTION B: compatible with ChatWindowProps (expects (model: string) => void)
  const handleModelChange = (model: string) => {
    const safeModel: ModelId = isModelId(model) ? model : 'gemini';

    setAiConfig((prev: AiConfig) => {
      if (prev.selectedModel === safeModel) return prev;
      return { ...prev, selectedModel: safeModel };
    });
  };

  const activeConversation = conversations.find((c) => c.id === activeId);
  const lastMessageContent =
    activeConversation?.messages[activeConversation.messages.length - 1]?.content;

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden relative">
      <Sidebar
        user={user}
        conversations={conversations}
        activeId={activeId}
        onSelectConv={handleSelectConv}
        onOpenModal={setActiveModal}
        onSignOutRequest={() => setActiveModal('logout')}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onConversationDeleted={(id) => {
          setConversations((prev: Conversation[]) => prev.filter((c) => c.id !== id));
          if (activeId === id) setActiveId(null);
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          user={user}
          onOpenProfile={() => setActiveModal('profile')}
          onOpenBalance={() => setActiveModal('balance')}
          onOpenProductPayment={() => setActiveModal('store')}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          timezone={aiConfig.timezone}
        />

        <ChatWindow
          user={user}
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          enabledModels={aiConfig.enabledModels}
          isLoadingHistory={isLoadingMessages && !!activeId && (activeConversation?.messages.length === 0)}
          selectedModel={aiConfig.selectedModel}
          onSelectModel={handleModelChange}
          preferredLanguage={getLanguageCode(aiConfig.language)}
        />

        <SystemHUD />
        <BottomNav user={user} onOpenHistory={() => setIsSidebarOpen(true)} onOpenModal={setActiveModal} />
      </div>

      <Suspense fallback={<ModalLoader />}>
        {activeModal === 'logout' && <LogoutConfirm onConfirm={onLogout} onCancel={() => setActiveModal(null)} />}
        {activeModal === 'balance' && <LoadBalance onClose={() => setActiveModal(null)} />}
        {activeModal === 'store' && <OnlineStore onClose={() => setActiveModal(null)} />}
        {activeModal === 'services' && <OtherServices onClose={() => setActiveModal(null)} />}
        {activeModal === 'profile' && <UserProfile user={user} onClose={() => setActiveModal(null)} />}
        {activeModal === 'personalization' && (
          <PersonalizationModal config={aiConfig} onClose={() => setActiveModal(null)} onSave={setAiConfig} />
        )}
        {activeModal === 'settings' && <SettingsModal config={aiConfig} onClose={() => setActiveModal(null)} onSave={setAiConfig} />}
        {activeModal === 'membership' && <MembershipModal currentBalance={user.balance} onClose={() => setActiveModal(null)} />}
        {activeModal === 'tools' && <ToolsModal user={user} onClose={() => setActiveModal(null)} onUpgrade={() => setActiveModal('membership')} />}
        {activeModal === 'vip_vault' && <VipVaultModal user={user} onClose={() => setActiveModal(null)} onUpgrade={() => setActiveModal('membership')} />}
        {activeModal === 'core_hub' && (
          <CoreHubModal user={user} onClose={() => setActiveModal(null)} onOpenModal={setActiveModal} lastMessage={lastMessageContent} />
        )}
        {activeModal === 'notifications' && <NotificationsModal onClose={() => setActiveModal(null)} />}
        {['news', 'crypto', 'tutorials', 'humor'].includes(activeModal || '') && (
          <ContentModal type={activeModal!} onClose={() => setActiveModal(null)} />
        )}
      </Suspense>
    </div>
  );
};

export default Dashboard;
