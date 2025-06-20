import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Renderer({ automaton, title }) {
  if (!automaton) return null

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">States:</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {automaton.states.map((state) => (
              <Badge key={state} variant={state === automaton.startState ? "default" : "secondary"}>
                {state}
                {automaton.finalState.includes(state) && " (F)"}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Alphabet:</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {automaton.symbols.map((symbol) => (
              <Badge key={symbol} variant="outline">
                {symbol}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Transitions:</Label>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>From State</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>To States</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(automaton.transitions).map(([fromState, stateTransitions]) =>
                Object.entries(stateTransitions).map(([symbol, toStates]) => (
                  <TableRow key={`${fromState}-${symbol}`}>
                    <TableCell>
                      <Badge variant="secondary">{fromState}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{symbol}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {toStates.map((toState, index) => (
                          <Badge key={index} variant="secondary">
                            {toState}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
