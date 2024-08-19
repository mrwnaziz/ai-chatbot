// components/CloseButton.tsx
'use client';

import { useEffect, useState } from 'react';
import { IconClose } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';

export function CloseButton() {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    setIsEmbedded(window.parent !== window);
  }, []);

  const handleClose = () => {
    if (window.parent !== window) {
      window.parent.postMessage('closeChatWidget', '*');
    }
  };

  if (!isEmbedded) return null;

  return (
    <Button variant="ghost" size="icon" onClick={handleClose}>
      <IconClose className="size-4" />
    </Button>
  );
}