'use client'
import { useAuth, useUser } from '@clerk/nextjs'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    })
  }, [])

  return (  
    <PHProvider client={posthog}>
      <PostHogAuthWrapper>
        {children}
      </PostHogAuthWrapper>
    </PHProvider>
  )
}

function PostHogAuthWrapper({ children }) {
  const auth = useAuth();
  const userInfo = useUser();

  useEffect(() => {
    if (userInfo.user) {
      posthog.identify(userInfo.user.id, {email: userInfo.user.emailAddresses[0].emailAddress,
        name: userInfo.user.fullName,
      });
    } else if (!auth.isSignedIn) {
      posthog.reset();
    }
  }, [auth, userInfo]); 

  return children;
}
