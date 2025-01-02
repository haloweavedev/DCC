// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Start your journey with AI Compass
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-primary hover:bg-primary/90 text-white",
              footerActionLink: "text-primary hover:text-primary/90",
              card: "shadow-none",
            },
          }}
        />
      </div>
    </div>
  )
}