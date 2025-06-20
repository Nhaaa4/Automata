import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Minimize2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ConvertMinimize({ automaton, results, convertToDFA, minimizeDFA, renderAutomaton }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Convert & Minimize</CardTitle>
          <CardDescription>Convert NFA to DFA and minimize DFA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={convertToDFA} disabled={!automaton}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Convert to DFA
            </Button>

            <Button onClick={minimizeDFA} disabled={!automaton}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Minimize DFA
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.convertedDFA && typeof results.convertedDFA === "string" && (
        <Alert className="mt-4">
          <Info className="w-4 h-4" />
          <AlertDescription>{results.convertedDFA}</AlertDescription>
        </Alert>
      )}

      {results.convertedDFA &&
        typeof results.convertedDFA !== "string" &&
        renderAutomaton(results.convertedDFA, "Converted DFA")}
      {results.minimizedDFA && renderAutomaton(results.minimizedDFA, "Minimized DFA")}
    </div>
  )
}
