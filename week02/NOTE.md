# ECMAScript Language

### 一般命令式编程语言构成
  1. Atom
     - Identifier
     - Literal
  2. Expression
     - Atom
     - Operator
     - Punctuator
  3. Statement
     - Expression
     - Keyword
     - Punctuator
  4. Structure
     - Function
     - Class
     - Process
     - Namespace
  5. Program
     - Program
     - Mould
     - Package
     - Library

#### Atom Identifier & Literal

  - WhiteSpace
    - \<TAB\>：`\t`
    - \<VT\>： `\v`
    - \<FF\>：`\f` 
    - \<SP\>：`\s`
    - \<NBSP\>：NO-BREAK SPACE
    - \<ZWNBSP\>：ZERO WIDTH NO-BREAK SPACE
    - \<USP\>
  - LineTerminator
    - \<LF\>：`\n`
    - \<CR\>：`\r`
    - \<LS\>
    - \<PS\>
  - Comment
    - // comment
    - /* comment */
  - CommonToken
    - IdentifierName
    - Punctuator
    - [NumericLiteral](https://github.com/moling3650/Frontend-01-Template/blob/master/week02/01.Numeric%20Literals.md)
    - [StringLiteral](https://github.com/moling3650/Frontend-01-Template/blob/master/week02/03.String%20Literals.md)
    - Template

#### 基本类型
- Type
  - Number
    - 浮点数比较: Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON
  - String
    - 支持码点: U+0000 ~ U+10FFFF， 但推荐只使用 U+0000 ~ U+FFFF （BMP）
      - UCS-2 用 2 个字节表示 BMP 的码点
      - UCS-4 用 4 个字节表示码点`'\u{10000}'.length // 2`
    - 存储方式: [UTF8](https://tools.ietf.org/html/rfc3629)/UTF16
  - Boolean
  - Null
  - Undifined
  - Symbol
