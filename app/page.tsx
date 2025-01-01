import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full border-b bg-white/75 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Company Name */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">DCC</span>
            </div>

            {/* Navigation Links */}
            <NavigationMenu>
              <NavigationMenuList className="hidden md:flex space-x-8">
                <NavigationMenuItem>
                  <NavigationMenuLink className="text-sm font-medium text-gray-700 hover:text-blue-600" href="#features">
                    Features
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="text-sm font-medium text-gray-700 hover:text-blue-600" href="/coaches">
                    Coaches
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="text-sm font-medium text-gray-700 hover:text-blue-600" href="#pricing">
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="text-sm font-medium text-gray-700 hover:text-blue-600" href="/ai-receptionist">
                    AI Receptionist
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {!userId ? (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">
                      Get Started
                    </Button>
                  </SignUpButton>
                </>
              ) : (
                <UserButton afterSignOutUrl="/" />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Dental Coaching Collective
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Empowering dental practices with expert coaching and AI-powered learning
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <SignUpButton mode="modal">
                <Button size="lg">
                  Start your journey
                </Button>
              </SignUpButton>
              <Button variant="outline" size="lg">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Live Coaching</CardTitle>
                <CardDescription>Connect with expert dental coaches in personalized 1-on-1 sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Personalized guidance</li>
                  <li>Flexible scheduling</li>
                  <li>Expert feedback</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Auto-Coaching</CardTitle>
                <CardDescription>24/7 access to AI-powered coaching and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Instant answers</li>
                  <li>Practice scenarios</li>
                  <li>Continuous learning</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Library</CardTitle>
                <CardDescription>Comprehensive collection of dental practice resources</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Templates & guides</li>
                  <li>Best practices</li>
                  <li>Training materials</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Ready to transform your dental practice?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join dental professionals who are already benefiting from our platform.
          </p>
          <div className="mt-8">
            <SignUpButton mode="modal">
              <Button size="lg">
                Get started today
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>
    </div>
  );
}