
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.01b5692222e24b15806a9ef715fccf75',
  appName: 'tag-whisperer-ntags-app',
  webDir: 'dist',
  server: {
    url: 'https://01b56922-22e2-4b15-806a-9ef715fccf75.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
