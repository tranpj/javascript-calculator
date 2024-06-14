import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { enterOperation, enterDecimal, enterNumber, invert, calculate, clear, selectInput, selectDisplay } from './calculatorSlice';
import styles from './Calculator.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export function Calculator() {
    const display = useSelector(selectDisplay);
    const input = useSelector(selectInput);
    const dispatch = useDispatch();

    return (
        <div id="calculator" className='container themed-container'>
            <div className='row'>
                <span id="input" className='col-12 themed-grid-col displaySpan'>{input.join('')}</span>
                <span id="display" className='col-12 themed-grid-col displaySpan'>{display}</span>
            </div>
            <div className='row'>
                <button id="seven" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(7))}>7</button>
                <button id="eight" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(8))}>8</button>
                <button id="nine" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(9))}>9</button>
                <button id="add" className='col-3 themed-grid-col' onClick={() => dispatch(enterOperation('+'))}><i className="bi bi-plus"></i></button>
            </div>
            <div className='row'>
                <button id="four" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(4))}>4</button>
                <button id="five" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(5))}>5</button>
                <button id="six" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(6))}>6</button>
                <button id="subtract" className='col-3 themed-grid-col' onClick={() => dispatch(enterOperation('-'))}><i className="bi bi-dash"></i></button>
            </div>
            <div className='row'>
                <button id="one" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(1))}>1</button>
                <button id="two" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(2))}>2</button>
                <button id="three" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(3))}>3</button>
                <button id="multiply" className='col-3 themed-grid-col' onClick={() => dispatch(enterOperation('*'))}><i className="bi bi-x"></i></button>
            </div>
            <div className='row'>
                <button id="decimal" className='col-3 themed-grid-col' onClick={() => dispatch(enterDecimal())}>.</button>
                <button id="zero" className='col-3 themed-grid-col' onClick={() => dispatch(enterNumber(0))}>0</button>
                <button id="invert" className='col-3 themed-grid-col' onClick={() => dispatch(invert())}><i className="bi bi-plus-slash-minus"></i></button>
                <button id="divide" className='col-3 themed-grid-col' onClick={() => dispatch(enterOperation('/'))}><i className="bi bi-slash"></i></button>
            </div>
            <div className='row'>
                <button id="clear" className='col-6 themed-grid-col' onClick={() => dispatch(clear())}>C</button>
                <button id="equals" className='col-6 themed-grid-col' onClick={() => dispatch(calculate())}>=</button>
            </div>
        </div>
    );
}
