import { createSlice } from '@reduxjs/toolkit';

const INPUT_CLEAR = 0;
const INPUT_OP = 1;
const INPUT_DEC = 2;
const INPUT_NUM = 3;
const INPUT_CALC = 4;
const INPUT_NEG = 5;

const NUM_INT = 0;
const NUM_FLOAT = 1;

const initialState = {
    inputSequence: [],
    curInput: '',
    curNum: null,
    curNumType: NUM_INT,
    prevInput: INPUT_CLEAR,
    output: 0
}

const isNum = (input) => {
    let regex = /[0-9]/;
    return regex.test(input);
}

const setInitialState = (state) => {
    state.inputSequence.length = 0;

    state.curInput = initialState.curInput;
    state.curNum = initialState.curNum;
    state.curNumType = initialState.curNumType;
    state.prevInput = initialState.prevInput;
    state.output = initialState.output;
}

const addCurOpToSequence = (state, input) => {
    state.curInput = input;
    state.inputSequence.push(state.curInput);

    state.output = state.curInput;
    state.prevInput = INPUT_OP;
}

const replaceCurOpInSequence = (state, input) => {
    if(input == '-'){
        state.output = state.curInput;
        state.prevInput = INPUT_NEG;
    }
    else{
        state.inputSequence.pop();
        state.curInput = input;
        state.inputSequence.push(state.curInput);

        state.output = state.curInput;
        state.prevInput = INPUT_OP;
    }
}

const addNumToSequence = (state, num) => {
    state.curInput = num;
    state.curNumType = NUM_INT;

    state.curNum = parseInt(state.curInput);
    state.curInput = state.curNum.toString();
    state.inputSequence.push(state.curInput);

    state.output = state.curInput;
    state.prevInput = INPUT_NUM;
}

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

const invertCurNumInSequence = (state) => {
    state.curInput = state.inputSequence.pop();
    state.curNum = -state.curNum;
    state.curInput = state.curNum.toString();

    state.inputSequence.push(state.curInput);
    state.output = state.curInput;
    state.prevInput = INPUT_NUM;
}

const addDecimalToSequence = (state, input) => {
    state.curInput = (state.inputSequence.pop().toString()).concat(input.toString());
    state.curNumType = NUM_FLOAT;

    state.inputSequence.push(state.curInput);

    state.output = state.curInput;
    state.prevInput = INPUT_DEC;
}

const removeDecimalFromCurNum = (state) => {
    state.curInput = (state.inputSequence.pop().toString()).replace('.', '');
    state.curNumType = NUM_INT;
    state.curNum = parseInt(state.curInput);
    state.curInput = state.curNum.toString();
    state.inputSequence.push(state.curInput);

    state.output = state.curInput;
    state.prevInput = INPUT_NUM;
}

const calculateResult = (state) => {
    let result = 0;

    console.log(state.inputSequence.join(',').toString());

    let opSequence = state.inputSequence.filter(a => !(isNum(a)));
    let numSequence = state.inputSequence.filter(a => isNum(a)).map(num => parseFloat(num));

    console.log(opSequence.join(',').toString());
    console.log(numSequence.join(',').toString());

    for (let i = 0; i < opSequence.length; i++) {
        if (i === 0) {
            result = numSequence[i]
        }

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

    state.output = result.toString();

    state.inputSequence.push('=');
    state.inputSequence.push(state.output);

    state.prevInput = INPUT_CALC;
}

export const calculatorSlice = createSlice({
    name: 'calculator',
    initialState,
    reducers: {
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
        clear: (state) => {
            setInitialState(state);
        }
    }
})

export const { enterOperation, enterDecimal, enterNumber, invert, calculate, clear } = calculatorSlice.actions;

export const selectDisplay = (state) => state.calculator.output;
export const selectInput = (state) => state.calculator.inputSequence;

export default calculatorSlice.reducer;