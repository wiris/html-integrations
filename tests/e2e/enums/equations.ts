import type Equation from '../interfaces/equation'

const Equations: Record<string, Equation> = {
  singleNumber: {
    altText: '1',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn></math>'
  },
  styledSingleNumber: {
    altText: 'bold italic 1',
    mathml: '<math style="font-family:Arial" xmlns="http://www.w3.org/1998/Math/MathML"><mstyle mathsize="72px"><mn mathvariant="bold-italic" mathcolor="#FF0000">1</mn></mstyle></math>'

  },
  squareRootY: {
    altText: 'square root of y',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mi>y</mi></msqrt></math>',
    latex: '\\sqrt{y}'
  },
  squareRootYPlusFive: {
    altText: 'square root of y plus 5',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mi>y</mi></msqrt><mi>5</mi></math>',
    latex: '\\sqrt y+5'
  },
  OnePlusOne: {
    altText: '1 plus 1',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>+</mo><mn>1</mn></math>'
  },
  styledOnePlusOne: {
    altText: 'bold italic 1 bold italic plus bold italic 1',
    mathml: '<math style="font-family:Arial" xmlns="http://www.w3.org/1998/Math/MathML"><mstyle mathsize="72px"><mn mathvariant="bold-italic" mathcolor="#FF0000">1</mn><mo mathvariant="bold-italic" mathcolor="#FF0000">+</mo><mn mathvariant="bold-italic" mathcolor="#FF0000">1</mn></mstyle></math>'
  },
  specialCharacters: {
    altText: '« less than » greater than § & ¨ " apostrophe apostrophe',
    mathml: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mo>&#xAB;</mo><mo>&lt;</mo><mo>&#xBB;</mo><mo>&gt;</mo><mo>&#xA7;</mo><mo>&amp;</mo><mo>&#xA8;</mo><mo>&quot;</mo><mo>\'</mo><mo>\'</mo></math>'
  }
}

export default Equations