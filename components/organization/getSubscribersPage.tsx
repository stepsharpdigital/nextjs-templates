import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Crown, Star } from "lucide-react"


export default function SubscriberPage() {

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3 mb-3">
            <Crown className="h-8 w-8 text-amber-500" />
            Exclusive Subscriber Area
            <Crown className="h-8 w-8 text-amber-500" />
          </h1>
          <p className="text-slate-600 text-lg">
            Welcome to our premium content. Thank you for your support!
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-slate-200">
          <CardHeader className="text-center bg-linear-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b">
            <CardTitle className="text-3xl flex items-center justify-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              Access Granted
              <CheckCircle className="h-8 w-8 text-green-600" />
            </CardTitle>
            <CardDescription className="text-lg text-slate-700">
              You are seeing this because you have an active subscription
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="text-center py-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                  Thank You for Subscribing! 🙏
                </h2>
                <p className="text-slate-700 text-lg max-w-2xl mx-auto">
                  Your subscription allows us to continue creating high-quality content and services.
                  We truly appreciate your support and trust in our organization.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-3 gap-6 py-6">
                <div className="text-center p-6 bg-white rounded-lg border shadow-sm">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Premium Access</h3>
                  <p className="text-slate-600">
                    Enjoy exclusive content and features not available to regular users
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg border shadow-sm">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Ad-Free Experience</h3>
                  <p className="text-slate-600">
                    Browse without interruptions with our ad-free platform
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg border shadow-sm">
                  <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Priority Support</h3>
                  <p className="text-slate-600">
                    Get faster responses and dedicated support from our team
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="bg-linear-to-r from-slate-50 to-blue-50 p-8 rounded-xl border text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
                  <span className="text-2xl font-bold text-white">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  You&apos;re Part of Something Special
                </h3>
                <p className="text-slate-700 text-lg max-w-2xl mx-auto mb-8">
                  As a subscriber, you&apos;re helping us build a sustainable future for our services.
                  Your contribution directly supports innovation and quality improvement.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Explore Premium Features
                  </Button>
                  <Button variant="outline">
                    Manage Subscription
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="pt-8 border-t text-center">
                <p className="text-slate-500 italic">
                  Thank you for being one of our valued subscribers. 
                  Your support makes all the difference!
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    Subscription Status: Active
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>
            Need help? Contact our support team at support@organization.com
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Organization Name. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}