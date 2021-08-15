# 타입스크립트 가이드라인: 소개

본 타입스크립트 가이드라인은 타입스크립트와 자바스크립트의 이점을 모두 제공하기 위해 타입스크립트로 작성된 서비스 어플리케이션을 대상으로 하는 클라이언트 라이브러리 디자이너를 위한 문서입니다.

## 디자인 원칙

Azure SDK는 Azure 서비스에 연결하는 개발자의 생산성을 증대시켜야 합니다. 완성도, 확장성, 성능과 같은 부분들도 중요하지만 부수적인 것이며, 생산성은 다음과 같은 원칙들을 적용함으로서 이룰 수 있습니다:

### 관습적으로

- SDK는 해당 언어의 규칙과 일반적인 디자인 가이드라인을 따라야 합니다. 해당 언어의 개발자가 자연스럽게 받아들일 수 있게 해야 합니다.
- 우리는 그 생태계의 장단점을 감수해야 합니다.
- 우리는 모든 개발자를 위해 생태계와 협력해 개선합니다.

### 일관성 있게

- 클라이언트 라이브러리는 언어와, 다른 언어와, 서비스 모두에 대해 일관적이어야 합니다. 충돌이 일어날 것을 생각해 언어의 일관성은 가장 높은 우선순위를 가져야 하며, 다른 언어와의 일관성은 비교적 가장 낮은 우선순위를 가집니다.
- 로깅, HTTP 통신, 에러 핸들링과 같은 서비스와 관련없는 개념들도 일관적이어야 합니다. 개발자가 다른 클라이언트 라이브러리 간 이동할 때 이러한 개념들을 다시 학습할 필요가 없게 해야 합니다.
- 클라리언트 라이브러리와 그 서비스 간 용어의 일관성은 진단하는 데 도움을 주는 좋은 것입니다.
- 서비스와 클라이언트 라이브러리 간 모든 차이점들은 일시적인 이유가 아니라 기존의 관습적인 사용을 기반으로 합당한 이유가 있어야할 것입니다.
- 각각 언어의 Azure SDK은 한 팀에서 하나의 제품이 나오는 것처럼 느껴져야 합니다.
- 해당 언어 간 동일한 기능이 있어야 합니다. 서비스의 동일한 기능보다 더 중요한 부분입니다.

### 접근하기 쉽게

- 우리는 지원하는 기술의 전문가입니다. 그래서 우리의 고객인 개발자들은 전문적일 필요까지 없게 해야합니다.
- 개발자들이 튜토리얼, 예제, 아티클, API 문서 등 양질의 문서를 찾아볼 수 있게 해야합니다. 그래서 Azure 서비스를 쉽게 성공할 수 있어야 합니다.
- 베스트 프랙티스를 적용할 수 있는 예측 가능한 기본값들을 사용해 쉽게 시작할 수 있어야 합니다. 점진적으로 개념을 소개할 수 있게 생각해보세요.
- SDK는 해당 언어와 생태계의 가장 일반적인 매커니즘을 통해 쉽게 얻을 수 있어야 합니다.
- 개발자들이 새로운 서비스 개념을 배우는 데 사로잡힐 수 있게 해야 합니다. 핵심 사용 사례를 발견할 수 있어야 합니다.

### 분석 가능하게

- 개발자가 어떻게 돌아가는지 쉽게 이해할 수 있게 해야합니다.
- 어느 상황에서 네트워크 호출이 이루어지는지 인지할 수 있어야 합니다.
- 기본값들을 알 수 있어야 하며 그 의도 또한 명확해야 합니다.
- 노깅, 추적, 예외처리는 기본적이며, 신중해야 합니다.
- 에러 메시지는 간결하고, 서비스과 연관있어야 하고, 이용할 수 있어야 하며 사람이 읽을 수 있게 해야합니다.
- 해당 언어의 선호되는 디버거들과의 통합이 쉬워야 합니다.

### 믿음직하게

- 갑작스러운 변화는 대부분의 새로운 기능보다 사용자 경험에 좋지 않으며 개선사항이 유익합니다.
- 매우 합당한 이유와 리뷰 없이 호환성을 깨버려서는 안됩니다. 의도적으로라도 이를 막아야 합니다.
- 호환성에 영향을 줄 수 있는 디펜던시에 의존해서는 안됩니다.

## 일반적인 가이드라인

✅ **DO:** [일반적인 Azure SDK 가이드라인](https://azure.github.io/azure-sdk/general_introduction.html)을 따르세요.
✅ **DO:** [azure/azure-sdk-for-js](https://github.com/azure/azure-sdk-for-js) 깃헙 레포지토리에 모든 소스 코드를 넣으세요.
✅ **DO:** [azure/azure-sdk-for-js](https://github.com/azure/azure-sdk-for-js) 깃험 레포지토리가 동작하기 위해 Azure SDK 엔지니어링 시스템 가이드라인을 따르세요.
✅ **DO:** `@azure` 스코프를 npm에서 이용한 당신의 클라이언트 라이브러리를 출판할 때 이 가이드라인을 따르세요.
☑️ **SHOULD:** `@azure` 스코프를 이용하지 않은 Azure 라이브러리를 출판할 때에도 이 가이드라인을 따르기 위해 노력해주세요.

## 용어

- **AMD Module**
  - [RequireJS](https://requirejs.org/)에서 적용된 예처럼 브라우저에서 사용하는 모듈 포맷

- **[CommonJS](https://nodejs.org/api/modules.html)(CJS)**
  - (`require`, `module.exports`)와 같은 Node.js 모듈 포맷

- **[ECMAScript Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) (ES Module or ESM)**
  - ECMAScript6+ 에서 정의된 표준 import/export 문법