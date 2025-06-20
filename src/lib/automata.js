export class FiniteAutomata {
  constructor(states, symbols, startState, finalState, transitions = {}) {
    this.states = states
    this.symbols = symbols
    this.startState = startState
    this.finalState = finalState
    this.transitions = {}

    this.#initializeTransitions(transitions)
  }

  #initializeTransitions(transitions) {
    for (const [state, symbols] of Object.entries(transitions)) {
      for (const [symbol, nextStates] of Object.entries(symbols)) {
        for (const nextState of nextStates) {
          this.addTransition(state, symbol, nextState)
        }
      }
    }
  }

  addTransition(state, symbol, nextState) {
    if (!this.transitions[state]) 
      this.transitions[state] = {}
    if (!this.transitions[state][symbol]) 
      this.transitions[state][symbol] = []

    if (!this.transitions[state][symbol].includes(nextState))
      this.transitions[state][symbol].push(nextState)
    return this.transitions
  }

  getNextState(state, symbol) {
    return this.transitions[state]?.[symbol] || []
  }

  isDFA() {
    for (const state of this.states) {
      if (this.getNextState(state, 'epsilon').length > 0) return false
      for (const symbol of this.symbols) {
        if (this.getNextState(state, symbol).length !== 1) return false
      }
    }
    return true
  }

  accepts(inputString) {
    if (this.isDFA()) {
      let currentState = this.startState
      for (const char of inputString) {
        if (!this.symbols.includes(char)) return false
        currentState = this.getNextState(currentState, char)[0]
      }
      return this.finalState.includes(currentState)
    } else {
      const queue = [[this.startState, 0]]

      while (queue.length > 0) {
        const [state, index] = queue.pop()
        // epsilon-transition
        const epsilontransition = this.getNextState(state, 'epsilon')
        for (const nextState of epsilontransition) {
          queue.push([nextState, index])
        }

        if (index === inputString.length) {
          if (this.finalState.includes(state)) return true
          continue
        }

        const symbol = inputString[index]
        const nextStates = this.getNextState(state, symbol)
        for (const nextState of nextStates) {
          queue.push([nextState, index + 1])
        }
      }
      return false
    }
  } 

  epsilonClosure(states) {
    if (!this.isDFA()) {
      const stack = [...states]
      const closure = new Set(states)
      
      while(stack.length) {
        const state = stack.pop()
        const epsilontransition = this.getNextState(state, 'epsilon')
        for (const nextState of epsilontransition) {
          closure.add(nextState)
          stack.push(nextState)
        }
      }
      return Array.from(closure)
    }
  }

  move(states, symbol) {
    if (!this.isDFA()) {
      const result = new Set()
      for (const state of states) {
        const nextStates = this.getNextState(state, symbol)
        for (const nextState of nextStates) {
          result.add(nextState)
        }
      }
      return Array.from(result)
    }
  }

  #simplifiyDfaStates(dfa) {
    const stateMap = {}
    const simplifiedTransitions = {}
    let index = 0

    for (const state of dfa.states) {
      if (!stateMap[state]) {
        stateMap[state] = `Q${index++}`
      }
    }

    for (const [fromState, trans] of Object.entries(dfa.transitions)) {
      const fromLetter = stateMap[fromState]
      if (!simplifiedTransitions[fromLetter]) {
        simplifiedTransitions[fromLetter] = {}
      }

      for (const [symbol, toState] of Object.entries(trans)) {
        simplifiedTransitions[fromLetter][symbol] = [stateMap[toState]]
      }
    }

    const startState = stateMap[dfa.startState]
    const finalState = dfa.finalState.map(s => stateMap[s])
    const states = Object.values(stateMap)

    return new FiniteAutomata(states, dfa.symbols, startState, finalState, simplifiedTransitions)
  }
    
  convertNFAtoDFA() {
    if (this.isDFA()) return "It is already DFA."
    
    const dfaStates = []
    const dfaTransitons = {}
    
    const visited = new Set()
    const queue = []

    const startStateClosure = this.epsilonClosure([this.startState])
    const startStateKey = startStateClosure.sort().join(',')

    queue.push(startStateClosure)
    visited.add(startStateKey)
    dfaStates.push(startStateKey)
    dfaTransitons[startStateKey] = {}

    while (queue.length > 0) {
      const currentDfaState = queue.shift()
      const currentDfaStateKey = currentDfaState.sort().join(',')

      dfaTransitons[currentDfaStateKey] = {}

      for (const symbol of this.symbols) {
        const moveResult = this.move(currentDfaState, symbol)
        const closureResult = this.epsilonClosure(moveResult)
        const closureKey = closureResult.sort().join(',')

        if (closureResult.length === 0) continue

        dfaTransitons[currentDfaStateKey][symbol] = [closureKey]

        if (!visited.has(closureKey)) {
          visited.add(closureKey)
          dfaStates.push(closureKey)
          queue.push(closureResult)
        }
      }
    }
    const dfaFinalStates = dfaStates.filter(dfaStateKey =>
      dfaStateKey.split(',').some(nfaState => this.finalState.includes(nfaState))
    )

    const newDfa =  new FiniteAutomata(dfaStates, this.symbols, startStateKey, dfaFinalStates, dfaTransitons)

    return this.#simplifiyDfaStates(newDfa)
  }

  minimizeDFA() {
    if (!this.isDFA()) {
      return this.convertNFAtoDFA().minimizeDFA()
    }

    const isAccepting = new Set(this.finalState)
    const pairs = {}
    const statesLength = this.states.length

    const pairKey = (a, b) => (a < b) ? `${a},${b}` : `${b},${a}`

    for (let i = 0; i < statesLength; i++) {
      for (let j = i + 1; j < statesLength; j++) {
        const a = this.states[i]
        const b = this.states[j]
        const aAccept = isAccepting.has(a)
        const bAccept = isAccepting.has(b)
        pairs[pairKey(a, b)] = (aAccept !== bAccept)
      }
    }

    let changed;
    do {
      changed = false;

      for (let i = 0; i < statesLength; i++) {
        for (let j = i + 1; j < statesLength; j++) {
          const a = this.states[i]
          const b = this.states[j]
          const key = pairKey(a, b)
          if (pairs[key]) continue

          for (const symbol of this.symbols) {
            const aTarget = this.getNextState(a, symbol)[0]
            const bTarget = this.getNextState(b, symbol)[0]

            if (!aTarget || !bTarget) continue

            const targetKey = pairKey(aTarget, bTarget)
            if (pairs[targetKey]) {
              pairs[key] = true
              changed = true
              break
            }
          }
        }
      }
    } while(changed)

    const groups = []
    const stateGroup = {}

    for (const state of this.states) {
      let found = false
      for (let g = 0; g < groups.length; g++) {
        const rep = groups[g][0] // representative state of group
        if (!pairs[pairKey(state, rep)]) {
          groups[g].push(state)
          stateGroup[state] = g
          found = true
          break
        }
      }
      if (!found) {
        groups.push([state]) 
        stateGroup[state] = groups.length - 1
      }
    }

    const newStates = groups.map((_, i) => `Q${i}`);
    const newStart = `Q${stateGroup[this.startState]}`;
    const newFinal = new Set();
    const newTransitions = {};

    for (let i = 0; i < groups.length; i++) {
      const groupName = `Q${i}`;
      const repState = groups[i][0]; // representative state of group

      if (this.finalState.includes(repState)) {
        newFinal.add(groupName);
      }

      newTransitions[groupName] = {};
      for (const symbol of this.symbols) {
        const target = this.getNextState(repState, symbol)[0];
        if (target !== undefined) {
          const targetGroup = stateGroup[target];
          const nameTargetGroup = `Q${targetGroup}`;
          newTransitions[groupName][symbol] = [nameTargetGroup]
        }
      }
    }

    return new FiniteAutomata(newStates, this.symbols, newStart, Array.from(newFinal), newTransitions)
  }
}