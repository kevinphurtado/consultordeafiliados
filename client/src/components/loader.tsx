interface LoaderProps {
  visible: boolean;
  message?: string;
}

export function Loader({ visible, message = "Procesando archivo..." }: LoaderProps) {
  if (!visible) return null;

  return (
    <div 
      className="absolute inset-0 bg-white bg-opacity-95 z-50 flex flex-col items-center justify-center transition-opacity duration-300"
      data-testid="loader-overlay"
    >
      <div 
        className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"
        data-testid="loader-spinner"
      />
      <p 
        className="mt-4 text-primary-dark font-medium"
        data-testid="loader-message"
      >
        {message}
      </p>
    </div>
  );
}
