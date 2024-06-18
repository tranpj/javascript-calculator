import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { enterOperation, enterDecimal, enterNumber, invert, calculate, clear, toggleMode, selectInput, selectDisplay, selectMode } from './calculatorSlice';
// import bootstrap to handle grid layout and card/container styles
import 'bootstrap/dist/css/bootstrap.min.css';
// import icons from bootstrap to used for the operations
import 'bootstrap-icons/font/bootstrap-icons.css';

// React component which comprises the calculator
export function Calculator() {
    const display = useSelector(selectDisplay);
    const input = useSelector(selectInput);
    const mode = useSelector(selectMode);
    const dispatch = useDispatch();

    // Return JSX to render the  calculator
    return (
        <div id='vertical-center'>
            <div id="calculator" className='card container'>
                <div className='row'>
                    <span id="input" className='displaySpan'>{input.join('')}</span>
                    <span id="display" className='displaySpan'>{display}</span>
                </div>
                <div className='row'>
                    <button id="mode-button" className='col-6 themed-grid-col' onClick={() => dispatch(toggleMode())}>Logic Mode</button>
                    <span id="mode-display" className='col-6 themed-grid-col displaySpan'>{mode}</span>
                </div>
                <div className='row'>
                    <button id="seven" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(7))}>7</button>
                    <button id="eight" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(8))}>8</button>
                    <button id="nine" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(9))}>9</button>
                    <button id="add" className='col-3 themed-grid-col op-button' onClick={() => dispatch(enterOperation('+'))}><i className="bi bi-plus"></i></button>
                </div>
                <div className='row'>
                    <button id="four" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(4))}>4</button>
                    <button id="five" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(5))}>5</button>
                    <button id="six" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(6))}>6</button>
                    <button id="subtract" className='col-3 themed-grid-col op-button' onClick={() => dispatch(enterOperation('-'))}><i className="bi bi-dash"></i></button>
                </div>
                <div className='row'>
                    <button id="one" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(1))}>1</button>
                    <button id="two" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(2))}>2</button>
                    <button id="three" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(3))}>3</button>
                    <button id="multiply" className='col-3 themed-grid-col op-button' onClick={() => dispatch(enterOperation('*'))}><i className="bi bi-x"></i></button>
                </div>
                <div className='row'>
                    <button id="decimal" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterDecimal())}>.</button>
                    <button id="zero" className='col-3 themed-grid-col num-button' onClick={() => dispatch(enterNumber(0))}>0</button>
                    <button id="invert" className='col-3 themed-grid-col num-button' onClick={() => dispatch(invert())}><i className="bi bi-plus-slash-minus"></i></button>
                    <button id="divide" className='col-3 themed-grid-col op-button' onClick={() => dispatch(enterOperation('/'))}><i className="bi bi-slash"></i></button>
                </div>
                <div className='row'>
                    <button id="clear" className='col-6 themed-grid-col' onClick={() => dispatch(clear())}>C</button>
                    <button id="equals" className='col-6 themed-grid-col' onClick={() => dispatch(calculate())}>=</button>
                </div>
            </div>
        </div>
    );
}
