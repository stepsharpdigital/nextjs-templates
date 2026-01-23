"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Brain, Code, Palette, ArrowRight, Sparkles,  } from "lucide-react";
export default function HomePage() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Solutions",
      description: "Intelligent systems that learn and adapt to your needs.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Development",
      description: "Modern web applications built with cutting-edge technology.",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Design",
      description: "Beautiful, user-centered interfaces that drive engagement.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            
            <span className="text-xl font-bold">Stepsharp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            AI + Development + Design
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Build the Future with{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stepsharp
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            We combine artificial intelligence, modern development practices, and exceptional design to create 
            solutions that propel your business forward.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                Start Building <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold">One Platform, Three Pillars</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            We bring together the best of AI, development, and design in a single, cohesive platform.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-blue-600 dark:text-blue-400">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold">How Stepsharp Works</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold">Share Your Vision</h3>
              <p className="text-muted-foreground">
                Tell us about your project, goals, and challenges. Our AI analyzes your requirements.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-semibold">We Build & Design</h3>
              <p className="text-muted-foreground">
                Our team creates intelligent solutions with beautiful interfaces and robust architecture.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-semibold">Launch & Grow</h3>
              <p className="text-muted-foreground">
                Deploy your solution and watch it evolve with continuous AI-driven improvements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-2xl border-2">
          <CardContent className="pt-12 text-center">
            <h2 className="text-3xl font-bold">Ready to Transform Your Ideas?</h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Join hundreds of innovators who have built their future with Stepsharp.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="px-8">
                  Start Your Project Today <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
             
              <span className="font-semibold">Stepsharp</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                About
              </Link>
              <Link href="#" className="hover:text-foreground">
                Contact
              </Link>
              <Link href="#" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground">
                Terms
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Stepsharp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}