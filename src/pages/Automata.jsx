import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle } from "lucide-react"
import { FiniteAutomata } from "../lib/automata.js"
import Create from "../components/Create"
import Analyze from "../components/Analyze"
import Accepted from "../components/Accepted"
import ConvertMinimize from "../components/ConvertMinimize"
import Renderer from "../components/Renderer"

export default function Automata() {
  const [automaton, setAutomaton] = useState(null)
  const [inputStates, setInputStates] = useState("")
  const [inputAlphabet, setInputAlphabet] = useState("")
  const [inputStartState, setInputStartState] = useState("")
  const [inputFinalStates, setInputFinalStates] = useState([])
  const [transitionRows, setTransitionRows] = useState([])
  const [testInput, setTestInput] = useState("")
  const [results, setResults] = useState({
    isDFA: null,
    stringAccepted: null,
    convertedDFA: null,
    minimizedDFA: null,
    error: null,
  })

  useEffect(() => {
    initializeWithSample()
  }, [])

  const initializeWithSample = () => {
    setInputStates("q0, q1, q2, q3")
    setInputAlphabet("a, b")
    setInputStartState("q0")
    setInputFinalStates(["q3"])

    const sampleRows = [
      { id: "1", fromState: "q0", symbol: "a", toStates: ["q0", "q1"] },
      { id: "2", fromState: "q0", symbol: "b", toStates: ["q0"] },
      { id: "3", fromState: "q1", symbol: "b", toStates: ["q2"] },
      { id: "4", fromState: "q2", symbol: "b", toStates: ["q3"] },
      { id: "5", fromState: "q3", symbol: "a", toStates: ["q3"] },
      { id: "6", fromState: "q3", symbol: "b", toStates: ["q3"] },
    ]
    setTransitionRows(sampleRows)

    // Create the sample automaton
    const states = ["q0", "q1", "q2", "q3"]
    const symbols = ["a", "b"]
    const startState = "q0"
    const finalStates = ["q3"]
    const transitions = {
      q0: { a: ["q0", "q1"], b: ["q0"] },
      q1: { b: ["q2"] },
      q2: { b: ["q3"] },
      q3: { a: ["q3"], b: ["q3"] },
    }

    const nfa = new FiniteAutomata(states, symbols, startState, finalStates, transitions)
    setAutomaton(nfa)
    setResults({
      isDFA: null,
      stringAccepted: null,
      convertedDFA: null,
      minimizedDFA: null,
      error: null,
    })
  }

  const createAutomaton = () => {
    try {
      const states = inputStates
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
      const symbols = inputAlphabet
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)

      if (states.length === 0 || symbols.length === 0) {
        setResults((prev) => ({ ...prev, error: "States and alphabet cannot be empty" }))
        return
      }

      // Build transitions object from table
      const transitions = {}
      transitionRows.forEach((row) => {
        if (row.fromState && row.symbol && row.toStates.length > 0) {
          if (!transitions[row.fromState]) {
            transitions[row.fromState] = {}
          }
          transitions[row.fromState][row.symbol] = row.toStates
        }
      })

      const newAutomaton = new FiniteAutomata(states, symbols, inputStartState, inputFinalStates, transitions)
      setAutomaton(newAutomaton)
      setResults((prev) => ({ ...prev, error: null }))
    } catch (error) {
      setResults((prev) => ({ ...prev, error: "Error creating automaton: " + error.message }))
    }
  }

  const testAutomatonType = () => {
    if (!automaton) return
    try {
      const result = automaton.isDFA()
      setResults((prev) => ({ ...prev, isDFA: result, error: null }))
    } catch (error) {
      setResults((prev) => ({ ...prev, error: "Error testing automaton type" }))
    }
  }

  const testStringAcceptance = () => {
    if (!automaton) return
    try {
      const accepted = automaton.accepts(testInput)
      setResults((prev) => ({ ...prev, stringAccepted: accepted, error: null }))
    } catch (error) {
      setResults((prev) => ({ ...prev, error: "Error testing string acceptance" }))
    }
  }

  const clearTestResults = () => {
    setResults((prev) => ({ ...prev, stringAccepted: null }))
  }

  const convertToDFA = () => {
    if (!automaton) return
    try {
      const result = automaton.convertNFAtoDFA()
      if (typeof result === "string") {
        setResults((prev) => ({ ...prev, convertedDFA: result, error: null }))
      } else {
        setResults((prev) => ({ ...prev, convertedDFA: result, error: null }))
      }
    } catch (error) {
      setResults((prev) => ({ ...prev, error: "Error converting to DFA" }))
    }
  }

  const minimizeDFA = () => {
    if (!automaton) return
    try {
      const minimized = automaton.minimizeDFA()
      setResults((prev) => ({ ...prev, minimizedDFA: minimized, error: null }))
    } catch (error) {
      setResults((prev) => ({ ...prev, error: error instanceof Error ? error.message : "Error minimizing DFA" }))
    }
  }

  const renderAutomaton = (fa, title) => {
    if (!fa) return null
    return <Renderer automaton={fa} title={title} />
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finite Automata Toolkit</h1>
        <p className="text-muted-foreground">
          Create, analyze, and manipulate finite automata with table-based transitions
        </p>
      </div>

      <div className="space-y-8">
        {/* Create Section */}
        <Create
          inputStates={inputStates}
          setInputStates={setInputStates}
          inputAlphabet={inputAlphabet}
          setInputAlphabet={setInputAlphabet}
          inputStartState={inputStartState}
          setInputStartState={setInputStartState}
          inputFinalStates={inputFinalStates}
          setInputFinalStates={setInputFinalStates}
          transitionRows={transitionRows}
          setTransitionRows={setTransitionRows}
          automaton={automaton}
          createAutomaton={createAutomaton}
          initializeWithSample={initializeWithSample}
          renderAutomaton={renderAutomaton}
        />

        {/* Analyze Section */}
        <Analyze automaton={automaton} results={results} testAutomatonType={testAutomatonType} />

        {/* Test String Section */}
        <Accepted
          automaton={automaton}
          testInput={testInput}
          setTestInput={setTestInput}
          results={results}
          testStringAcceptance={testStringAcceptance}
          clearTestResults={clearTestResults}
        />

        {/* Convert & Minimize Section */}
        <ConvertMinimize
          automaton={automaton}
          results={results}
          convertToDFA={convertToDFA}
          minimizeDFA={minimizeDFA}
          renderAutomaton={renderAutomaton}
        />

        {/* Error Display */}
        {results.error && (
          <Alert className="mt-4">
            <XCircle className="w-4 h-4" />
            <AlertDescription>{results.error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
