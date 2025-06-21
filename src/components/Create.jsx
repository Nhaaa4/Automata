import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

export default function Create({
  inputStates,
  setInputStates,
  inputAlphabet,
  setInputAlphabet,
  inputStartState,
  setInputStartState,
  inputFinalStates,
  setInputFinalStates,
  transitionRows,
  setTransitionRows,
  automaton,
  createAutomaton,
  renderAutomaton,
}) {
  const getStatesList = () => {
    return inputStates
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)
  }

  const getSymbolsList = () => {
    const symbols = inputAlphabet
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)
    return [...symbols, "epsilon"] // Always include epsilon
  }

  const addTransitionRow = () => {
    const newRow = {
      id: Date.now().toString(),
      fromState: "",
      symbol: "",
      toStates: [],
    }
    setTransitionRows([...transitionRows, newRow])
  }

  const removeTransitionRow = (id) => {
    setTransitionRows(transitionRows.filter((row) => row.id !== id))
  }

  const updateTransitionRow = (id, field, value) => {
    setTransitionRows(transitionRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Finite Automaton</CardTitle>
          <CardDescription>Define your finite automaton with table-based transitions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="states">States (comma-separated)</Label>
              <Input
                id="states"
                placeholder="q0, q1, q2"
                value={inputStates}
                onChange={(e) => setInputStates(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="alphabet">Alphabet (comma-separated)</Label>
              <Input
                id="alphabet"
                placeholder="a, b"
                value={inputAlphabet}
                onChange={(e) => setInputAlphabet(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Epsilon transitions are automatically available</p>
            </div>

            <div>
              <Label htmlFor="startState">Start State</Label>
              <Select value={inputStartState} onValueChange={setInputStartState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select start state" />
                </SelectTrigger>
                <SelectContent>
                  {getStatesList().map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Final States</Label>
              <div className="flex flex-wrap gap-2 mt-2 p-2 border rounded">
                {getStatesList().map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={`final-${state}`}
                      checked={inputFinalStates.includes(state)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setInputFinalStates([...inputFinalStates, state])
                        } else {
                          setInputFinalStates(inputFinalStates.filter((s) => s !== state))
                        }
                      }}
                    />
                    <Label htmlFor={`final-${state}`} className="text-sm">
                      {state}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-medium">Transitions</Label>
              <Button onClick={addTransitionRow} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Transition
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From State</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>To States</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transitionRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Select
                        value={row.fromState}
                        onValueChange={(value) => updateTransitionRow(row.id, "fromState", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                          {getStatesList().map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.symbol}
                        onValueChange={(value) => updateTransitionRow(row.id, "symbol", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Symbol" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSymbolsList().map((symbol) => (
                            <SelectItem key={symbol} value={symbol}>
                              {symbol === "epsilon" ? "ε" : symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getStatesList().map((state) => (
                          <div key={state} className="flex items-center space-x-1">
                            <Checkbox
                              id={`${row.id}-${state}`}
                              checked={row.toStates.includes(state)}
                              onCheckedChange={(checked) => {
                                const newToStates = checked
                                  ? [...row.toStates, state]
                                  : row.toStates.filter((s) => s !== state)
                                updateTransitionRow(row.id, "toStates", newToStates)
                              }}
                            />
                            <Label htmlFor={`${row.id}-${state}`} className="text-xs">
                              {state}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => removeTransitionRow(row.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button onClick={createAutomaton} className="w-full">
            Create Automaton
          </Button>
        </CardContent>
      </Card>

      {automaton && renderAutomaton(automaton, "Current Automaton")}
    </div>
  )
}
