import toast from 'react-hot-toast';

/**
 * Hook personalizado para manejar notificaciones toast con la estética de Shadcn/UI
 */
export const useToast = () => {
  /**
   * Muestra un toast de éxito
   * @param message - El mensaje a mostrar en el toast
   */
  const success = (message: string) => {
    toast.success(message, {
        icon: '✅',
    });
  };

  /**
   * Muestra un toast de error
   * @param message - El mensaje a mostrar en el toast
   */
  const error = (message: string) => {
    toast.error(message, {
        icon: '❌',
    });
  };

  /**
   * Muestra un toast informativo
   * @param message - El mensaje a mostrar en el toast
   */
  const info = (message: string) => {
    toast(message, {
      className: '!bg-popover !text-popover-foreground border-l-4 !border-l-blue-500 border border-border shadow-lg rounded-lg',
      icon: '️ℹ️',
    });
  };

  /**
   * Muestra un toast de advertencia
   * @param message - El mensaje a mostrar en el toast
   */
  const warning = (message: string) => {
    toast(message, {
      className: '!bg-popover !text-popover-foreground border-l-4 !border-l-yellow-500 border border-border shadow-lg rounded-lg',
      icon: '⚠️',
    });
  };

  /**
   * Muestra un toast con un mensaje de carga
   * @param message - El mensaje a mostrar en el toast
   * @returns ID del toast, útil para actualizar el toast posteriormente
   */
  const loading = (message: string) => {
    return toast.loading(message);
  };

  /**
   * Actualiza un toast existente
   * @param id - ID del toast a actualizar
   * @param message - Nuevo mensaje
   * @param type - Tipo de toast ('success', 'error', etc.)
   */
  const update = (id: string, message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        toast.success(message, { 
            id,
            icon: '✅',
        });
        break;
      case 'error':
        toast.error(message, { 
            id,
            icon: '❌',
        });
        break;
      case 'info':
        toast(message, {
          id,
          className: '!bg-popover !text-popover-foreground border-l-4 !border-l-blue-500 border border-border shadow-lg rounded-lg',
          icon: 'ℹ️',
        });
        break;
      case 'warning':
        toast(message, {
          id,
          className: '!bg-popover !text-popover-foreground border-l-4 !border-l-yellow-500 border border-border shadow-lg rounded-lg',
          icon: '⚠️',
        });
        break;
    }
  };

  /**
   * Desecha un toast activo
   * @param id - ID del toast a desechar
   */
  const dismiss = (id?: string) => {
    toast.dismiss(id);
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    update,
    dismiss,
  };
};
