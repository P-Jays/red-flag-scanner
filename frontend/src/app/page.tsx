import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center space-y-6">
      <h1 className="text-4xl font-bold">🚩 Red Flag Scanner</h1>
      <p className="text-muted-foreground">
        Instantly detect red flags in any crypto project — before you invest.
      </p>

      <Button asChild className="text-base">
        <a href="/scanner">🔍 Scan a Token</a>
      </Button>

      <div className="mt-10 border rounded-xl p-6 bg-muted/50 shadow-sm space-y-4">
        <p className="text-sm text-muted-foreground">
          💬 <span className="font-medium">Want to give feedback or collaborate?</span><br />
          DM me on{" "}
          <a
            href="https://twitter.com/pjonchain"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Twitter
          </a>{" "}
          or{" "}
          <a
            href="https://linkedin.com/in/kelvin-prajnawi-7b5851177"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            LinkedIn
          </a>
          .
        </p>

        <Button
          asChild
          variant="default"
          className="w-full"
        >
          <a href="https://twitter.com/pjonchain" target="_blank" rel="noopener noreferrer">
            ✉️ Send Feedback
          </a>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        MVP — Fake data. Real logic. Feedback welcome.
      </p>
    </div>
  )
}