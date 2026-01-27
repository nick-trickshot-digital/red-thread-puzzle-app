'use client';

import { useState } from 'react';

interface VaultSceneProps {
  onLoad?: () => void;
  autoOpen?: boolean;
}

export default function VaultScene({ onLoad, autoOpen = false }: VaultSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Try different URL parameters that might enable autoplay
  const baseUrl = 'https://my.spline.design/vaultcopy-zEvM9eQqUVntlswuShUXflI8/';
  const url = autoOpen ? `${baseUrl}?autostart=true` : baseUrl;

  return (
    <div
      className="absolute inset-0"
      style={{
        touchAction: 'manipulation',
        background: '#141226',
      }}
    >
      <iframe
        src={url}
        frameBorder="0"
        width="100%"
        height="100%"
        onLoad={handleLoad}
        title="3D Vault"
        style={{
          border: 'none',
          background: 'transparent',
          touchAction: 'manipulation',
          pointerEvents: 'auto',
          position: 'absolute',
          top: '-5%',
          left: 0,
          width: '100%',
          height: '70%',
        }}
        allow="autoplay; fullscreen"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#141226]">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
