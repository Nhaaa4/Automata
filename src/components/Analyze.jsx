import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Info } from "lucide-react"

export default function Analyze({ automaton, results, testAutomatonType }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Automaton</CardTitle>
          <CardDescription>Determine if your automaton is a DFA or NFA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAutomatonType} disabled={!automaton}>
            <Info className="w-4 h-4 mr-2" />
            Test DFA/NFA
          </Button>

          {results.isDFA !== null && (
            <Alert>
              <AlertDescription className="flex items-center gap-2">
                {results.isDFA ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    This is a Deterministic Finite Automaton (DFA)
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-orange-500" />
                    This is a Non-deterministic Finite Automaton (NFA)
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
