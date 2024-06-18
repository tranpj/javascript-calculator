import { createSlice } from '@reduxjs/toolkit';

//enums for input statemachine states
const INPUT_CLEAR = 0;
const INPUT_OP = 1;
const INPUT_DEC = 2;
const INPUT_NUM = 3;
const INPUT_CALC = 4;
// INPUT_NEG used to handle when subtraction operation entered after another operation. Used to set next number to be negative
const INPUT_NEG = 5;

//number types. Used to keep track of if decimal button was pressed
const NUM_INT = 0;
const NUM_FLOAT = 1;

//initial values for store
const initialState = {
    inputSequence: [],
    curInput: '',
    curNum: null,
    curNumType: NUM_INT,
    prevInput: INPUT_CLEAR,
    output: 0,
    //formula logic if true, immediate execution logic if false
    calcModeFL: true
}

// use regex to determine if the input is a number
const isNum = (input) => {
    let regex = /[0-9]/;
    return regex.test(input);
}

// set the state machine back to its initial state. Used when clearing
const setInitialState = (state) => {
    // clear input sequence
    state.inputSequence.length = 0;

    state.curInput = initialState.curInput;
    state.curNum = initialState.curNum;
    state.curNumType = initialState.curNumType;
    state.prevInput = initialState.prevInput;
    state.output = initialState.output;
}

// state machine function for when any operation button pressed and it needs to be added to the sequence
const addCurOpToSequence = (state, input) => {
    state.curInput = input;
    state.inputSequence.push(state.curInput);

    state.output = state.curInput;
    state.prevInput = INPUT_OP;
}

// state machine function for when any operation button consecutively replace current operation in sequence
const replaceCurOpInSequence = (state, input) => {
    if (input == '-') {
        // current operation subtraction which is used to enter the next number as a negative
        state.output = state.curInput;
        state.prevInput = INPUT_NEG;
    }
    else {
        // current operation to replace previous operation
        state.inputSequence.pop();
        state.curInput = input;
        state.inputSequence.push(state.curInput);

        state.output = state.curInput;
        state.prevInput = INPUT_OP;
    }
}

// state machine function when any number button is pressed and a number is to be added to the sequence
const addNumToSequence = (state, num) => {
    state.curInput = num;
    state.curNumType = NUM_INT;

    state.curNum = parseInt(state.curInput);
    state.curInput = state.curNum.toString();
    state.inputSequence.push(state.curInput);

    state.output = state.curInput;
    state.prevInput = INPUT_NUM;
}

// state machine function when any number button pressed after the number is being added to the sequence. Updates the current number in the sequence. Occurs for multiple digit or decimal numbers.
const updateCurNumInSequence = (state, input) => {
    state.curInput = (state.inputSequence.pop().toString()).concat(input.toString());

    if (state.curNumType == NUM_FLOAT) {
        state.curNum = parseFloat(state.curInput);
    }
    else {
        state.curNum = parseInt(state.curInput);
        state.curInput = state.curNum.toString();
    }

    state.inputSequence.push(state.curInput);

    state.output = state.curInput;
    state.prevInput = INPUT_NUM;
}

// state machine function when invert button pressed
const invertCurNumInSequence = (state) => {
    state.curInput = state.inputSequence.pop();
    state.curNum = -state.curNum;
    state.curInput = state.curNum.toString();

    state.inputSequence.push(state.curInput);
    state.output = state.curInput;
    state.prevInput = INPUT_NUM;
}

// state machine function when decimal button pressed when entering a number into the sequence
const addDecimalToSequence = (state, input) => {
    state.curInput = (state.inputSequence.pop().toString()).concat(input.toString());
    state.curNumType = NUM_FLOAT;

    state.inputSequence.push(state.curInput);

    state.output = state.curInput;
    state.prevInput = INPUT_DEC;
}

// state machine function when decimal button is the last button pressed before an operation or calculation button. Just removes the decimal from the sequence
const removeDecimalFromCurNum = (state) => {
    state.curInput = (state.inputSequence.pop().toString()).replace('.', '');
    state.curNumType = NUM_INT;
    state.curNum = parseInt(state.curInput);
    state.curInput = state.curNum.toString();
    state.inputSequence.push(state.curInput);

    // Update output to reflect decimal removed
    state.output = state.curInput;
    // Set previous state as actions for current state has been completed
    state.prevInput = INPUT_NUM;
}

// state machine function when equals button pressed. Calculates the result of the sequence. Calculations performed depends on the mode, either formula logic or immediate execution logic.
const calculateResult = (state) => {
    let result = 0;

    //split input sequence into operations sequence and number sequence
    let opSequence = state.inputSequence.filter(a => !(isNum(a)));
    let numSequence = state.inputSequence.filter(a => isNum(a)).map(num => parseFloat(num));

    // calculate using formula logic
    if (state.calcModeFL) {
        let index = 0;
        let regex;
        let value = 0;

        // loop through and continue calculate until all operations performed
        while (index > -1) {
            // perform multiplication and division first
            regex = /[\*\/]/;
            index = opSequence.findIndex(op => regex.test(op));
            value = 0;

            if (index <= -1) {
                // multiplication and division done. Now do addition and subtractions
                regex = /[\+-]/;
                index = opSequence.findIndex(op => regex.test(op));
            }

            // if index not -1 indicating there are no operations left to perform. Perform the operation
            if (index > -1) {
                switch (opSequence[index]) {
                    case '+':
                        value = numSequence[index] + numSequence[index + 1];
                        break;
                    case '-':
                        value = numSequence[index] - numSequence[index + 1];
                        break;
                    case '*':
                        value = numSequence[index] * numSequence[index + 1];
                        break;
                    case '/':
                        value = numSequence[index] / numSequence[index + 1];
                        break;
                }

                // Remove the operation performed from operation sequence
                opSequence = [...opSequence.slice(0, index), ...opSequence.slice(index + 1)];
                // Update the number sequence with the value calculated by the operation
                numSequence = [...numSequence.slice(0, index), value, ...numSequence.slice(index + 2)];
            }
        }

        // save result
        result = numSequence[0];
    }
    // calculate using immediate execution logic
    else {
        // set initial result to first number in sequence
        result = numSequence[0];

        // loop through and perform all operations in a immediate execution fashion
        for (let i = 0; i < opSequence.length; i++) {
            switch (opSequence[i]) {
                case '+':
                    result += numSequence[i + 1];
                    break;
                case '-':
                    result -= numSequence[i + 1];
                    break;
                case '*':
                    result *= numSequence[i + 1];
                    break;
                case '/':
                    result /= numSequence[i + 1];
                    break;
            }
        }
    }

    // Update output with result
    state.output = result.toString();

    // Update input sequence to include result
    state.inputSequence.push('=');
    state.inputSequence.push(state.output);

    // Set previous state as actions for current state has been completed
    state.prevInput = INPUT_CALC;
}

export const calculatorSlice = createSlice({
    name: 'calculator',
    initialState,
    reducers: {
        // occurs when any operations button pressed
        enterOperation: (state, action) => {
            switch (state.prevInput) {
                default:
                case INPUT_CLEAR:
                    addNumToSequence(state, 0);
                    addCurOpToSequence(state, action.payload);
                    break;
                case INPUT_OP:
                    replaceCurOpInSequence(state, action.payload);
                    break;
                case INPUT_DEC:
                    removeDecimalFromCurNum(state);
                    addCurOpToSequence(state, action.payload);
                    break;
                case INPUT_NUM:
                    addCurOpToSequence(state, action.payload);
                    break;
                case INPUT_CALC:
                    let output = state.output;
                    setInitialState(state);
                    addNumToSequence(state, output);
                    addCurOpToSequence(state, action.payload);
                    break;
                case INPUT_NEG:
                    replaceCurOpInSequence(state, action.payload);
                    break;
            };
        },
        // occurs when decimal button pressed
        enterDecimal: (state) => {
            switch (state.prevInput) {
                default:
                case INPUT_CLEAR:
                    addNumToSequence(state, 0);
                    addDecimalToSequence(state, '.');
                    break;
                case INPUT_OP:
                    addNumToSequence(state, 0);
                    addDecimalToSequence(state, '.');
                    break;
                case INPUT_DEC:
                    break;
                case INPUT_NUM:
                    if (state.curNumType == NUM_INT) {
                        addDecimalToSequence(state, '.');
                    }
                    break;
                case INPUT_CALC:
                    setInitialState(state);
                    addNumToSequence(state, 0);
                    addDecimalToSequence(state, '.');
                    break;
                case INPUT_NEG:
                    break;
            };
        },
        // occurs when any number button pressed
        enterNumber: (state, action) => {
            switch (state.prevInput) {
                default:
                case INPUT_CLEAR:
                    addNumToSequence(state, action.payload);
                    break;
                case INPUT_OP:
                    addNumToSequence(state, action.payload);
                    break;
                case INPUT_DEC:
                    updateCurNumInSequence(state, action.payload);
                    break;
                case INPUT_NUM:
                    updateCurNumInSequence(state, action.payload);
                    break;
                case INPUT_CALC:
                    setInitialState(state);
                    addNumToSequence(state, action.payload);
                    break;
                case INPUT_NEG:
                    addNumToSequence(state, action.payload);
                    invertCurNumInSequence(state);
                    break;
            };
        },
        // occurs when invert button pressed
        invert: (state) => {
            switch (state.prevInput) {
                default:
                case INPUT_CLEAR:
                    break;
                case INPUT_OP:
                    break;
                case INPUT_DEC:
                    removeDecimalFromCurNum(state);
                    invertCurNumInSequence(state);
                case INPUT_NUM:
                    invertCurNumInSequence(state);
                    break;
                case INPUT_CALC:
                    break;
                case INPUT_NEG:
                    break;
            };
        },
        // occurs when equals button pressed
        calculate: (state) => {
            switch (state.prevInput) {
                default:
                case INPUT_CLEAR:
                    addNumToSequence(state, 0);
                    break;
                case INPUT_OP:
                    //remove last operation as there is nothing following it
                    state.inputSequence.pop();
                    break;
                case INPUT_DEC:
                    removeDecimalFromCurNum(state);
                    break;
                case INPUT_NUM:
                    break;
                case INPUT_CALC:
                    setInitialState(state);
                    addNumToSequence(state, 0);
                    break;
                case INPUT_NEG:
                    //remove last operation as there is nothing following it
                    state.inputSequence.pop();
                    break;
            };

            calculateResult(state);
        },
        // occurs when clear button pressed
        clear: (state) => {
            setInitialState(state);
        },
        // occurs when logic mode button pressed
        toggleMode: (state) => {
            setInitialState(state);
            state.calcModeFL = !state.calcModeFL;
        }
    }
});

//export action so Calculator can use them
export const { enterOperation, enterDecimal, enterNumber, invert, calculate, clear, toggleMode } = calculatorSlice.actions;

//export selectors so Calculator can use them
export const selectDisplay = (state) => state.calculator.output;
export const selectInput = (state) => state.calculator.inputSequence;
export const selectMode = (state) => state.calculator.calcModeFL ? 'Formula Logic' : 'Immediate Execution Logic';

//export reduces so Calculator can use them
export default calculatorSlice.reducer;
