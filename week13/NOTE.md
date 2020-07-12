### 对象与组件
#### 对象
- Properties
- Methods
- Inherit
#### 组件
- Properties
- Methods
- Inherit
- Attribute
- Config
- State
- Event
- Lifecycle
- Children

#### Attribute & Property
- Attribute
  - 强调描述性
  - eg: \<my-component attr-key="attrValue" /\>
- Property
  - 强调从属关系
  - eg: myComponent.propKey = "propValue"


#### 如何设计组件状态

| |Markup set| Js set| JS Change| User Input Change|
|:---:|:---:|:---:|:---:|:---:|
|property| N | Y | Y | ? |
|attribute| Y | Y | Y | ? |
|state| N | N | N | Y |
|config| N | Y | N | N |