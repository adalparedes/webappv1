import React, { ReactNode, ErrorInfo } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  // Fix: Use class property syntax to initialize state. This is a more modern
  // approach for React class components and resolves the TypeScript errors
  // where 'state' and 'props' were not being correctly inferred on the component instance.
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[CRITICAL_UI_ERROR]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-black text-white font-mono p-6 text-center z-[10000]">
          <div className="absolute inset-0 bg-red-950/20 opacity-30"></div>
          <div className="relative border border-red-500/30 bg-black/80 backdrop-blur-md p-10 rounded-2xl max-w-lg">
            <div className="text-5xl mb-6 animate-pulse">⚠️</div>
            <h1 className="text-2xl font-orbitron text-red-500 mb-4 uppercase tracking-widest">Error Crítico del Núcleo</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Ha ocurrido un fallo inesperado en la interfaz del sistema. Por favor, refresca la página para reiniciar el protocolo de comunicación. Si el problema persiste, contacta a soporte.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-10 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors uppercase font-orbitron tracking-wider"
            >
              Reiniciar Interfaz
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
