import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle } from "lucide-react"
import { FiniteAutomata } from "../lib/automata"
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
  const [isLoaded, setIsLoaded] = useState(false)
  const [results, setResults] = useState({
    isDFA: null,
    stringAccepted: null,
    convertedDFA: null,
    minimizedDFA: null,
    error: null,
  })

  // Load saved state on component mount
  useEffect(() => {
    loadSavedState()
  }, [])

 // Save state whenever inputs change (but only after initial load)
  useEffect(() => {
    const saveState = () => {
    try {
      const state = {
        inputStates,
        inputAlphabet,
        inputStartState,
        inputFinalStates,
        transitionRows,
        testInput,
        timestamp: Date.now(),
      }
      localStorage.setItem("finite-automata-state", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving state:", error)
    }
  }
    if (isLoaded) {
      saveState()
    }
  }, [inputStates, inputAlphabet, inputStartState, inputFinalStates, transitionRows, testInput, isLoaded])

  

  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem("finite-automata-state")

      if (saved) {
        const state = JSON.parse(saved)

        setInputStates(state.inputStates || "")
        setInputAlphabet(state.inputAlphabet || "")
        setInputStartState(state.inputStartState || "")
        setInputFinalStates(state.inputFinalStates || [])
        setTransitionRows(state.transitionRows || [])
        setTestInput(state.testInput || "")

        console.log("State loaded successfully")
      } else {
        console.log("No saved state found")
      }
    } catch (error) {
      console.error("Error loading saved state:", error)
    } finally {
      setIsLoaded(true)
    }
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
