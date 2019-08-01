
// Elements

let viewElements = ['abs', 'and', 'annotation', 'annotation-xml', 'apply', 'approx', 'arccos', 'arccosh', 'arccot', 'arccoth', 'arccsc', 'arccsch', 'arcsec', 'arcsech', 'arcsin', 'arcsinh', 'arctan', 'arctanh', 'arg', 'bind', 'bvar', 'card', 'cartesianproduct', 'cbytes', 'ceiling', 'cerror', 'ci', 'cn', 'codomain', 'complexes', 'compose', 'condition', 'conjugate', 'cos', 'cosh', 'cot', 'coth', 'cs', 'csc', 'csch', 'csymbol', 'curl', 'declare', 'degree', 'determinant', 'diff', 'divergence', 'divide', 'domain', 'domainofapplication', 'emptyset', 'eq', 'equivalent', 'eulergamma', 'exists', 'exp', 'exponentiale', 'factorial', 'factorof', 'false', 'floor', 'fn', 'forall', 'gcd', 'geq', 'grad', 'gt', 'ident', 'image', 'imaginary', 'imaginaryi', 'implies', 'in', 'infinity', 'int', 'integers', 'intersect', 'interval', 'inverse', 'lambda', 'laplacian', 'lcm', 'leq', 'limit', 'list', 'ln', 'log', 'logbase', 'lowlimit', 'lt', 'maction', 'maligngroup', 'malignmark', 'matrix', 'matrixrow', 'max', 'mean', 'median', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'min', 'minus', 'mlabeledtr', 'mlongdiv', 'mmultiscripts', 'mn', 'mo', 'mode', 'moment', 'momentabout', 'mover', 'mpadded', 'mphantom', 'mprescripts', 'mroot', 'mrow', 'ms', 'mscarries', 'mscarry', 'msgroup', 'msline', 'mspace', 'msqrt', 'msrow', 'mstack', 'mstyle', 'msub', 'msubsup', 'msup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'naturalnumbers', 'neq', 'none', 'not', 'notanumber', 'notin', 'notprsubset', 'notsubset', 'or', 'otherwise', 'outerproduct', 'partialdiff', 'pi', 'piece', 'piecewise', 'plus', 'power', 'primes', 'product', 'prsubset', 'quotient', 'rationals', 'real', 'reals', 'reln', 'rem', 'root', 'scalarproduct', 'sdev', 'sec', 'sech', 'selector', 'semantics', 'sep', 'set', 'setdiff', 'share', 'sin', 'sinh', 'subset', 'sum', 'tan', 'tanh', 'tendsto', 'times', 'transpose', 'true', 'union', 'uplimit', 'variance', 'vector', 'vectorproduct', 'xor'];

// MathML's "image" element collides with CKeditor model's "image", so
// we add a "math-" prefix to all MathML elements to avoid any
// collisions altogether.
let viewMath = 'math';
let modelElements = new Map( [ ...viewElements, viewMath ].map( element => [ element, 'math-' + element ] ) );
let modelMath = modelElements.get( viewMath );

// Attributes

let attributes = ['columnalign', 'accentunder', /*'src',*/ 'subscriptshift', 'infixlinebreakstyle', 'mslinethickness', 'close', 'rightoverhang', 'longdivstyle', 'linebreak', 'bevelled', 'overflow', 'xml:lang', 'leftoverhang', 'columnwidth', 'equalcolumns', 'id', 'fontfamily', 'separators', 'minlabelspacing', 'scriptlevel', 'height', 'occurrence', 'stackalign', 'color', 'cdgroup', 'veryverythickmathspace', 'rowspacing', 'name', 'other', 'order', 'macros', 'veryverythinmathspace', 'notation', 'columnspan', 'fence', 'valign', 'maxsize', 'indentshiftfirst', 'lspace', 'lquote', 'position', 'crossout', 'equalrows', 'altimg-height', 'voffset', 'dir', 'frame', 'denomalign', '%XLINK.prefix;:href', 'actiontype', 'mode', 'display', 'linethickness', 'maxwidth', 'length', 'columnlines', 'movablelimits', 'lineleading', 'scriptsizemultiplier', 'linebreakstyle', 'charalign', 'charspacing', /*'alt',*/ /*'href',*/ 'rquote', 'altimg', 'verythinmathspace', 'rowlines', 'accent', 'groupalign', 'separator', 'mathbackground', 'nargs', 'indenttarget', 'verythickmathspace', 'mathsize', 'symmetric', 'edge', 'open', 'side', 'thinmathspace', 'fontstyle', 'encoding', 'selection', 'columnspacing', 'decimalpoint', /*'style',*/ 'stretchy', 'cd', 'scriptminsize', 'width', 'indentalignfirst', 'shift', 'index', 'linebreakmultchar', 'xml:space', 'scope', 'largeop', 'alttext', 'altimg-valign', 'base', 'closure', 'minsize', 'indentalign', 'framespacing', 'definitionURL', 'rspace', 'numalign', 'fontweight', 'class', 'rowalign', 'form', 'alignmentscope', 'align', '%XLINK.prefix;:type', 'depth', 'fontsize', 'type', 'background', 'displaystyle', 'superscriptshift', 'mediummathspace', 'rowspan', 'indentshiftlast', 'location', 'xref', 'altimg-width', 'thickmathspace', 'indentalignlast', 'mathcolor', 'indentshift', 'mathvariant', 'xmlns'];

// Schema

let schema = [

    // <math>
    {
        realName: viewMath,
        modelName: modelMath,
        definition: {
            allowWhere: [ '$block', '$inline', '$text' ],
            allowAttributes: attributes,
            isBlock: false,
            isLimit: true,
            isObject: true,
        },
        needsCasting: true,
        allowsText: true,
    },

    // The other elements
    ...viewElements.map( element => ( {
        realName: element,
        modelName: modelElements.get( element ),
        definition: {
            allowIn: [ ...modelElements.values(), modelElements.get( viewMath ) ],
            allowAttributes: attributes,
        },
        needsCasting: true,
        allowsText: true, // TODO change this so not all elements allow text inside
    } ) ),

];

export {
    schema, // Array of elements' data; one entry per element
    attributes, // Array of ALL attributes of all MathML elements
};
