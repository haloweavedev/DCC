"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold">DCC Admin</span>
            </div>
            <NavigationMenu>
              <NavigationMenuList className="hidden md:flex space-x-8">
                <NavigationMenuItem>
                  <Link href="/admin/knowledge" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium text-gray-700 hover:text-blue-600">
                      Knowledge Base
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/admin/resources" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium text-gray-700 hover:text-blue-600">
                      Resources
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/admin/users" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-medium text-gray-700 hover:text-blue-600">
                      Users
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-600">Manage your platform content and monitor user engagement.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-gray-600">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-gray-600">Premium users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-gray-600">Total documents</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.2k</div>
              <p className="text-xs text-gray-600">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/knowledge/add">
                <Button className="w-full mb-2">
                  Add Knowledge Base Entry
                </Button>
              </Link>
              <Link href="/admin/resources/add">
                <Button variant="outline" className="w-full">
                  Upload New Resource
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium">New knowledge base entry: "Front Office Best Practices"</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium">Resource updated: "Patient Communication Guide"</p>
                    <p className="text-sm text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium">New premium subscription</p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}