import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Sparkles, FolderKanban, MessageSquare, Zap, ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2.5 font-bold text-base tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span>AI Workspace</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={buttonVariants({ variant: "ghost", size: "sm", className: "font-medium text-xs" })}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className={buttonVariants({ size: "sm", className: "font-medium text-xs rounded-xl" })}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Next-Generation AI Workspace Platform</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground max-w-3xl leading-[1.1]">
            Organize AI context, models, & conversations seamlessly.
          </h1>

          <p className="mt-6 text-base text-muted-foreground sm:text-lg max-w-2xl leading-relaxed">
            A unified SaaS workspace designed for knowledge workers and developers. Connect custom document context, toggle multiple LLMs, and manage project conversations in one polished hub.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className={buttonVariants({ size: "lg", className: "h-11 px-8 rounded-xl font-semibold gap-2 w-full sm:w-auto" })}
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-8 rounded-xl font-semibold w-full sm:w-auto border-border/80" })}
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="border-t border-border/60 bg-card/40 py-20 px-6">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Engineered for productivity
              </h2>
              <p className="text-sm text-muted-foreground">
                Everything you need to manage your personal or team AI workflows.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-base text-foreground">Structured Workspaces</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Group chats, prompt templates, and custom knowledge context by project with distinct color accents.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-base text-foreground">Multi-Model Streaming</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Instant token-by-token streaming responses across Llama 3.3, DeepSeek R1, and Mixtral models.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-base text-foreground">RAG Document Preparation</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Attach PDFs, CSVs, and markdown text directly to workspaces for document context retrieval.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 px-6 text-center text-xs text-muted-foreground">
        <p>© 2026 AI Workspace. Built with Next.js & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
