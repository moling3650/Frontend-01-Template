# 测试

## 两种开发测试模式
- 先开发后测试，不断丰富测试用例，最终使测试代码行数覆盖率达到90%以上。
- 边测试边开发，先写测试用例，然后才编写能通过测试的代码，反复快速迭代。

## 工具链
- mocha：编写测试用例的工具，生成测试用例报告
- nyc：生成测试代码覆盖率报告的工具。

### mocha
1. 安装
    `npm i -D mocha`
2. 编写测试用例
    ```JavaScript
    var assert = require('assert');
    describe('Array', function () {
      describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
          assert.equal([1, 2, 3].indexOf(4), -1);
        });
      });
    });
    ```
3. 执行
    `npm test`

### nyc
#### 配置
- babel项目，需要预配置`@istanbuljs/nyc-config-babel`
- ts项目，需要预配置`@istanbuljs/nyc-config-typescript`


#### .nycrc配置文件
```
{
  "extends": "@istanbuljs/nyc-config-typescript",
  "all": true,
  "check-coverage": true
}
```