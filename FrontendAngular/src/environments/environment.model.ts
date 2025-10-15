
export interface Environment {
  production: boolean;
  apiUrl: string;
  firebase?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  features?: {
    enableDebug: boolean;
    enableExperimentalFeatures: boolean;
  };
  sentryDsn?: string;
  googleMapsApiKey?: string;
}