import { Stack } from "expo-router";
import "../global.css";
import {MutationCache, QueryCache, QueryClient,QueryClientProvider} from "@tanstack/react-query"
import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
//const queryClient = new QueryClient();
import * as Sentry from '@sentry/react-native';
import { StripeProvider } from "@stripe/stripe-react-native";
Sentry.init({
  dsn: 'https://e0a6d2e5bec13101ed96417305e9db52@o4511460154605568.ingest.de.sentry.io/4511493644877904',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});


const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error:any,query)=>{
      Sentry.captureException(error, {
        tags:{
          type: "react-query-error",
          queryKey: query.queryKey[0]?.toString() || "unknown"
        }
      })
    }
  }),
  mutationCache: new MutationCache({
    onError: (error: any)=>{
      Sentry.captureException(error,{
        tags:{type:"react-query-mutation-error"},
        extra:{
          errorMessage: error.message,
          statusCode: error.response?.status,
        },
      });
    },
  }),
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}
export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider  tokenCache={tokenCache} publishableKey={publishableKey}>
    <QueryClientProvider client={queryClient}>
      <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
      <Stack screenOptions={{headerShown:false}}/>
      </StripeProvider>
    </QueryClientProvider>
    </ClerkProvider>
  )
});