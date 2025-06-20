import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Play } from "lucide-react"

export default function Test({
  automaton,
  testInput,
  setTestInput,
  results,
  testStringAcceptance,
  clearTestResults,
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test String Acceptance</CardTitle>
          <CardDescription>Test whether a string is accepted by your automaton</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testString">Test String</Label>
            <Input
              id="testString"
              placeholder="abb"
              value={testInput}
              onChange={(e) => {
                setTestInput(e.target.value)
                clearTestResults()
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testStringAcceptance} disabled={!automaton}>
              <Play className="w-4 h-4 mr-2" />
              Test String
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setTestInput("abb")
                clearTestResults()
              }}
            >
              Test "abb"
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTestInput("abba")
                clearTestResults()
              }}
            >
              Test "abba"
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTestInput("aaa")
                clearTestResults()
              }}
            >
              Test "aaa"
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTestInput("bb")
                clearTestResults()
              }}
            >
              Test "bb"
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.stringAccepted !== null && (
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            {results.stringAccepted ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                String "{testInput}" is ACCEPTED
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                String "{testInput}" is REJECTED
              </>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
