### String Literals

StringLiteral ::
  - " DoubleStringCharactersopt "
  - ' SingleStringCharactersopt '

DoubleStringCharacters ::
  - DoubleStringCharacter DoubleStringCharactersopt

SingleStringCharacters ::
  - SingleStringCharacter SingleStringCharactersopt

DoubleStringCharacter ::
  - SourceCharacter but not one of " or \ or LineTerminator
  - \<LS\> 
  - \<PS\> 
  - \ EscapeSequence
  - LineContinuation

SingleStringCharacter ::
  - SourceCharacter but not one of ' or \ or LineTerminator
  - \<LS\>
  - \<PS\>
  - \ EscapeSequence
  - LineContinuation

LineContinuation ::
  - \ LineTerminatorSequence

```js
/['"\\bfnrtvnr\u2028\u2029]|(?<!\d)0|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|u\{(10|0?[0-9a-fA-F])[0-9a-fA-F]{0,4}\}/
```
EscapeSequence ::
  - CharacterEscapeSequence
  - 0 [lookahead ∉ DecimalDigit]
  - HexEscapeSequence
  - UnicodeEscapeSequence

```js
// 简化处理，Unicode码点应在 (U+0000 to U+10FFFF)
/^[^\n\r\u2028\u2029\dxu]$/
```
CharacterEscapeSequence ::
  - SingleEscapeCharacter
  - NonEscapeCharacter

```js
// 简化处理，Unicode码点应在 (U+0000 to U+10FFFF)
/^[^\n\r\u2028\u2029'"\\bfnrtv\dxu]$/
```
NonEscapeCharacter ::
  - SourceCharacter but not one of EscapeCharacter or LineTerminator


```js
/^[\u{0}-\u{10ffff}]$/
```
SourceCharacter ::
  - any Unicode code point (U+0000 to U+10FFFF)


```js
/^[\n\r\u2028\u2029]$/
```
LineTerminator ::
  - <LF> U+000A LINE FEED (LF)
  - <CR> U+000D CARRIAGE RETURN (CR)
  - <LS> U+2028 LINE SEPARATOR
  - <PS> U+2029 PARAGRAPH SEPARATOR


```js
/^['"\\bfnrtv\dxu]$/
```
EscapeCharacter ::
  - SingleEscapeCharacter
  - DecimalDigit
  - x 
  - u

```js
/^['"\\bfnrtv]$/
```
SingleEscapeCharacter :: one of
  - ' " \ b f n r t v


```js
/^\d$/
```
DecimalDigit :: one of
  - 0 1 2 3 4 5 6 7 8 9


```js
/^x[0-9a-fA-F]{2}$/
```
HexEscapeSequence ::
  - x HexDigit HexDigit


```js
/^u[0-9a-fA-F]{4}$|^u\{(10|0?[0-9a-fA-F])[0-9a-fA-F]{0,4}\}$/
```
UnicodeEscapeSequence ::
  - u Hex4Digits
  - u{ CodePoint }


```js
/^[0-9a-fA-F]{4}$/
```
Hex4Digits ::
  - HexDigit HexDigit HexDigit HexDigit


```js
/^\u{0}-\u{10FFFF}$/
```
CodePoint ::
  - HexDigits but only if MV of HexDigits ≤ 0x10FFFF


```js
/^[0-9a-fA-F]+$/
```
HexDigits ::
  - HexDigit
  - HexDigits HexDigit


```js
/^[0-9a-fA-F]$/
```
HexDigit :: one of
  - 0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F
