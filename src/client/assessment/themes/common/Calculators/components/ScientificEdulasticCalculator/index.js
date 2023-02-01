import React, { useRef, useEffect } from 'react'
import { Container } from './styled-components'

export const ScientificEdulasticCalculator = () => {
  const calcRef = useRef()

  useEffect(() => {
    console.clear()
    if (window.jQuery && calcRef.current) {
      $(calcRef.current).showCalculator()
      $(calcRef.current).showCalculator.resetCalc()
      $(calcRef.current).showCalculator.initiateListeners()
    }
    return () => {
      $(calcRef.current).showCalculator.removeListeners()
    }
  }, [])

  return (
    <Container className="calc-main" ref={calcRef}>
      <div className="calc-display">
        <span>0</span>
        <div className="calc-rad">Rad</div>
        <div className="calc-hold" />
        <div className="calc-buttons">
          <div className="calc-info">?</div>
          <div className="calc-smaller">&gt;</div>
          <div className="calc-ln">.</div>
        </div>
      </div>
      <div className="calc-left">
        <div>
          <div>2nd</div>
        </div>
        <div>
          <div>(</div>
        </div>
        <div>
          <div>)</div>
        </div>
        <div>
          <div>%</div>
        </div>
        <div>
          <div>1/x</div>
        </div>
        <div>
          <div>
            x<sup>2</sup>
          </div>
        </div>
        <div>
          <div>
            x<sup>3</sup>
          </div>
        </div>
        <div>
          <div>
            y<sup>x</sup>
          </div>
        </div>
        <div>
          <div>x!</div>
        </div>
        <div>
          <div>&radic;</div>
        </div>
        <div>
          <div className="calc-radxy">
            <sup>x</sup>
            <em>&radic;</em>
            <span>y</span>
          </div>
        </div>
        <div>
          <div>log</div>
        </div>
        <div>
          <div>sin</div>
        </div>
        <div>
          <div>cos</div>
        </div>
        <div>
          <div>tan</div>
        </div>
        <div>
          <div>ln</div>
        </div>
        <div>
          <div>sinh</div>
        </div>
        <div>
          <div>cosh</div>
        </div>
        <div>
          <div>tanh</div>
        </div>
        <div>
          <div>
            e<sup>x</sup>
          </div>
        </div>
        <div>
          <div>Deg</div>
        </div>
        <div>
          <div>&pi;</div>
        </div>
        <div>
          <div>EE</div>
        </div>
        <div>
          <div>Rand</div>
        </div>
      </div>
      <div className="calc-right">
        <div>
          <div>mc</div>
        </div>
        <div>
          <div>m+</div>
        </div>
        <div>
          <div>m-</div>
        </div>
        <div>
          <div>mr</div>
        </div>
        <div className="calc-brown">
          <div>AC</div>
        </div>
        <div className="calc-brown">
          <div>+/&#8211;</div>
        </div>
        <div className="calc-brown calc-f19">
          <div>&divide;</div>
        </div>
        <div className="calc-brown calc-f21">
          <div>&times;</div>
        </div>
        <div className="calc-black">
          <div>7</div>
        </div>
        <div className="calc-black">
          <div>8</div>
        </div>
        <div className="calc-black">
          <div>9</div>
        </div>
        <div className="calc-brown calc-f18">
          <div>&#8211;</div>
        </div>
        <div className="calc-black">
          <div>4</div>
        </div>
        <div className="calc-black">
          <div>5</div>
        </div>
        <div className="calc-black">
          <div>6</div>
        </div>
        <div className="calc-brown calc-f18">
          <div>+</div>
        </div>
        <div className="calc-black">
          <div>1</div>
        </div>
        <div className="calc-black">
          <div>2</div>
        </div>
        <div className="calc-black">
          <div>3</div>
        </div>
        <div className="calc-blank">
          <textarea />
        </div>
        <div className="calc-orange calc-eq calc-f17">
          <div>
            <div className="calc-down">=</div>
          </div>
        </div>
        <div className="calc-black calc-zero">
          <div>
            <span>0</span>
          </div>
        </div>
        <div className="calc-black calc-f21">
          <div>.</div>
        </div>
      </div>
    </Container>
  )
}
