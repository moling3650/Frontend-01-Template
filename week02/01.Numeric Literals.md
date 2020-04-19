### Numeric Literals

```js
/^(\.\d+|(0|[1-9]\d*)\.?\d*?)([eE][-\+]?\d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/
```
NumericLiteral :
  - DecimalLiteral
  - BinaryIntegerLiteral
  - OctalIntegerLiteral
  - HexIntegerLiteral

```js
/^(\.\d+|(0|[1-9]\d*)\.?\d*?)([eE][-\+]?\d+)?$/
```
DecimalLiteral ::
  - DecimalIntegerLiteral . DecimalDigits(opt) ExponentPart(opt)
  - . DecimalDigits ExponentPart(opt)
  - DecimalIntegerLiteral ExponentPart 

```js
/^0|[1-9]\d*$/
```
DecimalIntegerLiteral ::
  - 0
  - NonZeroDigit DecimalDigits(opt)

```js
/^\d+$/
```
DecimalDigits ::
  - DecimalDigit
  - DecimalDigits DecimalDigit

```js
/^\d$/
```
DecimalDigit :: one of
  - 0 1 2 3 4 5 6 7 8 9

```js
/^[1-9]$/
```
NonZeroDigit :: one of
  - 1 2 3 4 5 6 7 8 9

```js
/^[eE][-\+]?\d+$/
```
ExponentPart ::
  - ExponentIndicator SignedInteger

```js
/^[eE]$/
```
ExponentIndicator :: one of  
  - e E

```js
/^[-\+]?\d+$/
```
SignedInteger ::
  - DecimalDigits
  - + DecimalDigits
  - - DecimalDigits

```js
/^0[bB][01]+$/
```
BinaryIntegerLiteral ::
  - 0b BinaryDigits
  - 0B BinaryDigits

```js
/^[01]+$/
```
BinaryDigits ::
  - BinaryDigit
  - BinaryDigits BinaryDigit

```js
/^[01]$/
```
BinaryDigit :: one of
  - 0 1

```js
/^0[oO][0-7]+$/
```
OctalIntegerLiteral ::
  - 0o OctalDigits
  - 0O OctalDigits

```js
/^[0-7]+$/
```
OctalDigits ::
  - OctalDigit
  - OctalDigits OctalDigit

```js
/^[0-7]$/
```
OctalDigit :: one of
  - 0 1 2 3 4 5 6 7

```js
/^0[xX][0-9a-fA-F]+$/
```
HexIntegerLiteral ::
  - 0x HexDigits
  - 0X HexDigits

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
