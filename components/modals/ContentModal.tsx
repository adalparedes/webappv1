import React, { useState } from 'react';
import ModalContainer from './ModalContainer';

interface ContentItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  icon: string;
  date: string;
  videoUrl?: string;
}

const DATA: Record<string, ContentItem[]> = {
  news: [
    { 
      id: 1, 
      title: 'La nueva magia de NVIDIA: DLSS 4.5 convierte 240p en una experiencia 4K nítida', 
      excerpt: 'NVIDIA anuncia DLSS 4.5, una IA que reconstruye imágenes 4K desde resoluciones tan bajas como 240p.', 
      content: `Durante el CES 2026, NVIDIA anunció DLSS 4.5, una actualización importante de su tecnología de escalado basada en inteligencia artificial. Esta versión incorpora un modelo de IA de segunda generación capaz de reconstruir imágenes partiendo de resoluciones extremadamente bajas, incluso desde 240p, y todo ello con una carga de procesamiento hasta cinco veces superior a la de versiones anteriores.
[IMAGE:https://res.cloudinary.com/dv1yofc8f/image/upload/v1768487471/nividai_dls_1_h4ibzb.png]
DLSS 4.5 fue uno de los anuncios estrella de la compañía en la feria. El sistema utiliza un nuevo modelo de transformación que mejora notablemente la calidad final de imagen tras el proceso de reescalado, reduciendo aún más artefactos como ghosting o shimmering —problemas ya mitigados con DLSS 4, pero que ahora se minimizan todavía más.
Además, esta versión también pule el suavizado de bordes y logra mejores resultados incluso cuando la resolución de partida es muy limitada. Esto se traduce en que es posible usar modos de calidad más agresivos, mantener o mejorar la fidelidad visual y, al mismo tiempo, reducir el impacto en el rendimiento.
[IMAGE:https://res.cloudinary.com/dv1yofc8f/image/upload/v1768487523/dlss_4_5_nvidia_2_p510ew.png]
### Recomendaciones clásicas de uso de DLSS
Para obtener buenos resultados, normalmente se sugiere usar estos modos según la resolución final deseada:
- 1080p o menos: modo calidad
- 1440p: modo equilibrado
- 2160p (4K): modo rendimiento
- 4320p (8K): modo ultra rendimiento
Estas configuraciones suelen ser las ideales, pero DLSS 4.5 ha demostrado que incluso en escenarios poco recomendables —como resoluciones base extremadamente bajas— puede ofrecer resultados sorprendentes.
### DLSS 4.5 puede generar millones de píxeles desde una base mínima
Gracias al nuevo modelo de IA, NVIDIA ha conseguido que jugar con resoluciones de salida como 240p o 360p ya no sea una locura. De hecho, en pruebas internas se ha visto que la tecnología es capaz de reconstruir escenas completas con una nitidez inesperada.
[IMAGE:https://res.cloudinary.com/dv1yofc8f/image/upload/v1768487579/dlss_4_nvidia_rnvyxf.png]
Por ejemplo, ejecutar un juego a 720p y activar DLSS 4.5 en modo ultra rendimiento implica trabajar con una resolución interna de apenas 240p, lo que equivale a solo 76.800 píxeles renderizados. Aun así, el objetivo —921.600 píxeles de un 720p completo— se alcanza generando más de 844.000 píxeles mediante IA.
DLSS 4.5 usa información detallada de cada fotograma: iluminación, geometría, vectores de movimiento, alineación y corrección de errores. Esto permite que incluso elementos que no se distinguen en la resolución original aparezcan perfectamente formados en pantalla.
[IMAGE:https://res.cloudinary.com/dv1yofc8f/image/upload/v1768487579/dlss_4_nvidia_rnvyxf.png]
[IMAGE:https://res.cloudinary.com/dv1yofc8f/image/upload/v1768487646/dls_3_mahrzc.png]
En resolución 1080p ocurre algo similar. Al utilizar el mismo modo ultra rendimiento, únicamente se renderiza el 33% de la imagen. El resto —más de 1,7 millones de píxeles por fotograma— se reconstruye mediante el modelo de IA.
Cuando el objetivo es 4K, la brecha es todavía mayor:
- 921.600 píxeles renderizados
- 8,29 millones de píxeles mostrados en pantalla
Aun así, las pruebas —como las mostradas en Senua’s Saga: Hellblade II— dejan claro que DLSS 4.5 es capaz de llevar esta reconstrucción a un nivel impresionante.
### DLSS 4.5: el nuevo estándar en reescalado por IA
Con esta versión, DLSS vuelve a consolidarse como la solución más avanzada para reconstrucción y escalado de imagen en videojuegos. Su importancia es cada vez mayor, especialmente como herramienta para ampliar la vida útil de las GPU y compensar los límites físicos del silicio.
[IMAGE:https://res.cloudinary.com/dv1yofc8f/image/upload/v1768487707/dls_nivida_avl2nn.png]
Es cierto que en tarjetas como las RTX 20 y RTX 30 el coste de rendimiento es superior, pero el aumento en calidad visual compensa, y permite usar modos de rendimiento inferiores con resultados que igualan —o incluso superan— a los modos de calidad más altos sin perder fluidez.`, 
      icon: '🌐', 
      date: 'Hace 2 horas' 
    },
    { id: 2, title: 'DeepSeek v3: Eficiencia extrema', excerpt: 'El nuevo estándar en modelos de código abierto para desarrolladores.', content: 'DeepSeek se ha posicionado como el modelo preferido para tareas de programación pesada por su bajo costo y alta fidelidad en lenguajes como Python y TypeScript.', icon: '⚡', date: 'Ayer' },
    { id: 3, title: 'Nvidia Blackwell: Poder de cómputo masivo', excerpt: 'Los nuevos chips que alimentarán la siguiente generación de IA.', content: 'La arquitectura Blackwell promete reducir el consumo energético de los centros de datos mientras multiplica por 10 el rendimiento de entrenamiento de LLMs.', icon: '🦾', date: 'Hace 3 días' },
  ],
  crypto: [
    { id: 30, title: 'Bitcoin en territorio inexplorado', excerpt: 'La barrera de los 100k se siente más cerca que nunca.', content: 'El sentimiento del mercado es ultra alcista. Con la adopción masiva y el suministro limitado, Bitcoin sigue demostrando ser el activo de refugio digital definitivo.', icon: '₿', date: 'Hace 1 hora' },
    { id: 31, title: 'Pectra Update: El futuro de Ethereum', excerpt: 'Mejoras críticas en escalabilidad para el ecosistema DeFi.', content: 'La actualización Pectra busca optimizar el manejo de cuentas y reducir costos de gas significativamente.', icon: 'Ξ', date: 'Ayer' },
    { id: 32, title: 'Solana Mobile: El teléfono web3 evoluciona', excerpt: 'Se anuncian nuevas funciones para el ecosistema Saga.', content: 'El nuevo dispositivo permitirá una integración nativa con dApps y wallets sin fricción para el usuario común.', icon: '◎', date: 'Hace 3 días' },
  ],
  tutorials: [
    { id: 10, title: 'Blindaje de Wallets 101', excerpt: 'Aprende a no ser la siguiente víctima de phishing.', content: 'En este tutorial cubrimos el uso de Hardware Wallets, firmas de mensajes seguras y cómo identificar contratos maliciosos.', icon: '🛡️', date: 'Nivel: Básico' },
    { id: 11, title: 'React Server Components Masterclass', excerpt: 'Dominando el nuevo paradigma de Next.js.', content: 'Aprende a separar la lógica de servidor y cliente para aplicaciones que cargan en milisegundos.', icon: '⚛️', date: 'Nivel: Avanzado' },
  ],
  humor: [
    { 
      id: 20, 
      title: 'MarketingFallido 😂', 
      excerpt: 'Videos de marketing muy malos', 
      content: 'A veces el presupuesto no garantiza la calidad. Aquí una recopilación de lo que NO debes hacer en tu próxima campaña viral.', 
      icon: '🎬', 
      date: 'VIRAL',
      videoUrl: 'https://www.youtube.com/embed/cSbY0ketUe8?autoplay=1'
    },
    { 
      id: 21, 
      title: 'Bromitas suaves y pesaditas 😳😅🤣', 
      excerpt: 'En este video te traigo una recopilación épica de bromas pesadas', 
      content: '¿Crees que tus amigos son pesados? Prepárate para ver niveles de maldad que no conocías. Solo para estómagos fuertes.', 
      icon: '🤡', 
      date: 'Trending',
      videoUrl: 'https://www.youtube.com/embed/R3Hl8ZshSQk?autoplay=1'
    },
    {
      id: 22,
      title: 'Animales en Modo Payaso 😹🐶🦜',
      excerpt: 'Perfecto para levantar el ánimo, compartir con amigos o simplemente pasar un buen rato.',
      content: 'La compilación más graciosa del día. Perfecto para levantar el ánimo, compartir con amigos o simplemente pasar un buen rato con las ocurrencias de estas mascotas.',
      icon: '🐈',
      date: 'NUEVO',
      videoUrl: 'https://www.youtube.com/embed/RJqNwd62T9U?autoplay=1'
    }
  ]
};

const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  const contentElements = lines.map((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('[IMAGE:')) {
      const url = trimmedLine.substring(7, trimmedLine.length - 1);
      return (
        <img 
          key={index}
          src={url} 
          alt={`Imagen de la noticia ${index}`}
          className="w-full h-auto rounded-xl my-4 border border-white/10 shadow-lg"
        />
      );
    }
    if (trimmedLine.startsWith('### ')) {
      return (
        <h3 key={index} className="text-lg font-orbitron font-bold text-[#00d2ff] uppercase tracking-wider pt-6 pb-2 border-b border-white/10 mt-4">
          {trimmedLine.substring(4)}
        </h3>
      );
    }
    if (trimmedLine.startsWith('- ')) {
      return (
          <li key={index} className="text-gray-400 flex items-start gap-3">
              <span className="text-[#00ff88] pt-1.5 leading-none">•</span>
              <span>{trimmedLine.substring(2)}</span>
          </li>
      );
    }
    if (trimmedLine === '') {
      return null;
    }
    return (
      <p key={index} className="text-gray-400 leading-relaxed font-sans text-base">
        {trimmedLine}
      </p>
    );
  }).filter(Boolean);
  
  const groupedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  contentElements.forEach((el, i) => {
    if (React.isValidElement(el) && el.type === 'li') {
      currentList.push(el);
    } else {
      if (currentList.length > 0) {
        groupedElements.push(<ul key={`ul-${i}`} className="space-y-2 my-4">{currentList}</ul>);
        currentList = [];
      }
      groupedElements.push(el);
    }
  });

  if (currentList.length > 0) {
    groupedElements.push(<ul key="ul-last" className="space-y-2 my-4">{currentList}</ul>);
  }

  return <div className="space-y-4">{groupedElements}</div>;
};

const SocialShare: React.FC = () => {
  const socialLinks = [
    { name: 'X', url: 'https://x.com/AdalParedes1', icon: '𝕏', color: '#ffffff' },
    { name: 'YouTube', url: 'https://www.youtube.com/@adalparedes1', icon: '📺', color: '#ff0000' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@adalparedes1', icon: '📱', color: '#00f2ea' }
  ];
  return (
    <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
      <h4 className="text-center text-xs font-orbitron font-bold text-gray-400 uppercase tracking-[0.2em]">Comenta en Redes Sociales</h4>
      <div className="flex justify-center gap-4">
        {socialLinks.map(link => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 hover:border-current group/social active:scale-90"
            style={{ color: link.color }}
            title={link.name}
          >
            <span className="group-hover/social:drop-shadow-[0_0_15px_currentColor] transition-all">{link.icon}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

const ContentModal: React.FC<{ type: string, onClose: () => void }> = ({ type, onClose }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  
  const items = DATA[type] || [];
  const selectedItem = items.find(i => i.id === selectedId);

  const titles: Record<string, string> = { 
    news: 'Noticias Tech', 
    crypto: 'Noticias Crypto', 
    tutorials: 'Tutoriales Master', 
    humor: 'Humor & Relax' 
  };

  const handleBack = () => {
    setSelectedId(null);
    setShowVideo(false);
  };

  return (
    <ModalContainer title={titles[type] || 'Contenido'} onClose={onClose}>
      {!selectedId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {items.map(item => (
            <div 
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#00d2ff]/40 transition-all cursor-pointer flex flex-col h-full hover:shadow-[0_0_20px_rgba(0,210,255,0.05)]"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-tight leading-tight line-clamp-2">{item.title}</h3>
              <p className="text-[10px] text-gray-500 font-mono mb-4 flex-1 leading-relaxed uppercase">{item.excerpt}</p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-[9px] text-[#00d2ff] font-bold uppercase tracking-widest">{item.date}</span>
                <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-tighter">VER ›</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-in slide-in-from-right duration-300 space-y-6">
          <button onClick={handleBack} className="text-[10px] font-mono text-[#00d2ff] uppercase hover:underline mb-4 flex items-center gap-2">
            ← Volver a la Lista
          </button>
          
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-[150px] pointer-events-none select-none">{selectedItem?.icon}</div>
            <div className="relative z-10">
              <span className="text-[10px] font-mono text-[#00ff88] uppercase tracking-[0.3em] mb-3 block">{selectedItem?.date}</span>
              <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-6 uppercase leading-tight border-b border-white/5 pb-4">{selectedItem?.title}</h2>
              
              <div className="mb-8">
                {selectedItem && <ContentRenderer content={selectedItem.content} />}
              </div>

              {selectedItem?.videoUrl && (
                <div className="space-y-4">
                  {!showVideo ? (
                    <button 
                      onClick={() => setShowVideo(true)}
                      className="group relative flex items-center gap-4 px-8 py-4 bg-[#ff3131] text-white font-orbitron font-bold text-xs rounded-xl shadow-[0_0_30px_rgba(255,49,49,0.3)] hover:scale-105 transition-all uppercase tracking-[0.2em]"
                    >
                      <span className="text-xl">▶</span>
                      Ver Video
                    </button>
                  ) : (
                    <div className="aspect-[9/16] max-w-[320px] mx-auto bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in duration-500">
                      <iframe 
                        className="w-full h-full"
                        src={selectedItem.videoUrl} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              )}
              <SocialShare />
            </div>
          </div>
        </div>
      )}
    </ModalContainer>
  );
};

export default ContentModal;
