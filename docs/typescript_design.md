# 타입스크립트 가이드라인: API 디자인

클라이언트 라이브러리의 API 단은 소비자가 당신의 서비스와 주요한 상호 작용을 하는 부분이기 때문에 가장 먼저 고려되어야할 사항일 것입니다.

## 플랫폼 지원

✅ **DO:** 가장 최신 릴리즈를 포함해 [모든 Node의 LTS 버전](https://github.com/nodejs/Release#release-schedule)과 이후 버전을 지원해야 합니다.
✅ **DO:** 다음 브라우저와 버전을 지원해야 합니다:
    - 애플 사파리: 최신 두 버전
    - 구글 크롬: 최신 두 버전
    - 마이크로소프트 엣지: 모든 버전
    - 모질라 파이어폭스: 최신 두 버전
[caniuse.com](https://caniuse.com/)을 이용해 당신이 지원하는 런타임 버전을 주어진 플랫폼 기능에 이용할 수 있을지 결정하십시오. 문법 지원은 타입스크립트가 제공합니다.
⚠️ **SHOULD NOT:** IE 11을 지원하지 마세요. IE11 지원에 대한 비즈니스 근거가 있다면 [아키텍처 보드](https://github.com/azure/azure-sdk/issues)에 연락하세요.
✅ **DO:** 3.1 버전 이상의 타입스크립트 모두를 에러 없이 컴파일하세요.
타입스크립트의 새 버전을 소비자들은 빠르게 채택하고 있지만, Angular 7이 이용하는 3.1 버전은 아직 널리 이용됩니다. 이 이전의 타입스크립트 버전을 지원하는 것이 도전과제가 될 수 있습니다. 두 가지 접근 방법이 있는데:
    1. 새로운 기능을 사용하지 마세요.
    2. `typesVersions`를 이용하세요. 이전 버전을 지원하면서 새로운 타이핑을 기반으로 하는 타이핑을 제공하기 위해서는 수작업의 노력이 요구될 것입니다.
✅ **DO:** 필수적인 지원 상목이 아니더라도 지원 중지 시 [아키텍처 보드](https://github.com/azure/azure-sdk/issues)에서 승인을 받으십시오. (IE 11 및 Node 6 제외)

## 네임스페이스, NPM 스코프, 배포 태그

✅ **DO:** `@azure` npm 스코프에 당신의 라이브러리를 출판하세요.
✅ **DO:** 서비스가 이용되는 네임스페이스에 소비자가 묶일 수 있도록 패키지 이름을 정하세요. 기본적으로, 네임스페이스 뒤에 축약형의 서비스 이름을 이용합니다. 제품의 브랜딩 변화가 있을 때 네임스페이스는 **변하지 않습니다.** 변할 수 있는 마케팅 이름을 피하세요.
✅ **DO:** `next` npm 배포 태그를 이용해 베타 패키지를 태그하세요. 이 패키지에서 일반적으로 가능한 릴리즈가 없을 때 `latest` 태그 또한 붙어야 합니다.
✅ **DO:** 일반적으로 사용 가능한 npm 패키지에 `latest` 태그를 붙이세요. 가장 최근 베타 버전에서 변경 사항이 있다면 이 패키지들에 `next` 태그 또한 붙어있을 수 있습니다.
✅ **DO:** 데이터 단의 패키지 이름은 다음 네임스페이스 표를 이용해 케밥케이스(kebab-case) 형채로 붙이십시오.

| Namespace Group | Functional Area |
| --- | --- |
| ai | Artificial intelligence, including machine learning |
| analytics | Gathering data for metrics or usage |
| containers | Services related to containers |
| communication | Communication services |
| data | Dealing with structured data stores like databases |
| diagnostics | Gathering data for diagnosing issues |
| digitaltwins | Digital Twins, digital representations of physical spaces and  |IoT devices
| identity | Authentication and authorization |
| iot | Internet of things |
| management | Control Plane (Azure Resource Manager) |
| media | Audio and video technologies |
| messaging | Messaging services, like push notifications or pub-sub |
| mixedreality | Mixed reality technologies |
| monitor | Services that are offered by Azure Monitor |
| quantum | Quantum computing technologies |
| search | Search technologies |
| security | Security and cryptography |
| storage | Storage of unstructured data |

다음 패키지 이름은 가이드라인을 준수한 예입니다:

- `@azure/cosmos`
- `@azure/storage-blob`
- `@azure/digital-twins-core`

다음 패키지 이름은 가이드라인을 준수하지 못한 예입니다:

- `@microsoft/cosmos` (`@azure` 스코프가 아님)
- `@azure/digitaltwins` (케밥케이스가 아님)

☑️ **SHOULD:** `@azure` npm 스코프에서 릴리즈 된 기존 GA 패키지의 케이스 규칙을 따라야 합니다. 네이밍 규칙을 따르기 위해 다른 이름을 사용할 필요까지는 없습니다.

## 클라이언트 API

당신의 API 단은 소비자가 당신의 서비스에 연결하기 위해 인스턴스화할 하나 이상의 _서비스 클라이언트와_ _지원 타입들을_ 포함할 것입니다. 자바스크립트 서비스 클라이언트의 기본 형태는 다음 예시에서 볼 수 있습니다:

```typescript
export class ServiceClient {
  // client constructors have overloads for handling different
  // authentication schemes.
  constructor(connectionString: string, options?: ServiceClientOptions);
  constructor(host: string, credential: TokenCredential, options?: ServiceClientOptions);
  constructor(...) { }

  // Service methods. Options take at least an abortSignal.
  async createItem(options?: CreateItemOptions): CreateItemResponse;
  async deleteItem(options?: DeleteItemOptions): DeleteItemResponse;

  // Simple paginated API
  listItems(): PagedAsyncIterableIterator<Item, ItemPage> { }

  // Clients for sub-resources
  getItemClient(itemName: string) { }
}
```

### 클라이언트 생성자 및 팩토리

✅ **DO:** 소비자가 당신 라이브러리에서 탑 레벨로 export할 것 같은 서비스 클라이언트 타입들을 놓으세요.
✅ **DO:** 서비스에 연결하고 인증할 수 있는 최소한의 정보로 소비자가 서비스를 생성할 수 있게 하세요.
✅ **DO:** 서비스의 클라이언트 라이브러리 세트 내에서 동사 접두어/접미어들을 표준화하세요. ([공인된 동사](https://azure.github.io/azure-sdk/typescript_design.html#ts-approved-verbs) 페이지를 참고하세요.)
서비스는 특정 동작을 문서, 블로그, 공식 연설과 같은 외부 자산을 이용해 크로스랭귀지 방식을 설명합니다. 다른 언어에서 다른 동사를 이용해 동일 방식을 설명한다면 서비스는 언어 간 일관적이지 못할 것입니다.
✅ **DO:** Azure 서비스 클라이언트 라이브러리가 제시한 100% 모든 기능을 제공하세요.
기능 상의 차이는 개발자 간 혼란과 실망을 야기할 수 있습니다. 플랫폼이 지원하지 않는다면 기능을 생략할 수 있습니다. 예를 들어, 로컬 파일 시스템에 의존하는 라이브러리는 브라우저에서 작동하지 않을 수도 있습니다.
☑️ **SHOULD:** 모든 클라이언트 생성 시나리오에 대해 오버로드된 생성자를 제공할 수 있습니다..
오버로드가 모호하지 않다면 클라이언트를 생성하는 데 정적인 메소드를 사용하지 마세요. 정적 생성자가 필요하다면 `from` 접두어를 정적 메소드에 붙이세요.
☑️ **SHOULD:** 다음과 같은 경우에 유니온(Union) 간 오버로드를 이용하세요:

  1. 사용자들이 전달한 인자들을 정렬하기 위해 예시, 시그니처 등의 문서를 보고싶어할 것입니다. 또는
  1. 복수의 인자들이 연관되어 있을 것입니다.

다음 조건이 충족되지 못할 때 유니온을 이용할 수 있을 것입니다. 두 개의 넘버 또는 두 개의 문자열을 가지고 있지만 동시에 가지지 못하는 API가 있다고 합시다. 이 경우에 인자들은 연관되어있을 것입니다. 우리는 다음과 같은 코드에서 유니온을 사용한 타입을 적용한다고 했을 때,

```typescript
function foo(a: string | number, b: string | number): void {}
```

우리는 `foo(number, string)`과 `foo(string, number)`와 같은 형태로 유효하지 않은 인자들을 의도치 않게 허용할 수 있습니다. 오버로드들은 다른과 같은 상관관계로 표현할 수 있습니다:

```typescript
function foo(a: string, b: string): void;
function foo(a: number, b: number): void;
function foo(a: string | number, b: string | number): void {}
```

다음 오버로드 접근 방법은 각각의 오버로드에 대해 문서를 붙일 수 있습니다:

```typescript
// bad example
class ExampleClient {
  constructor (connectionString: string, options: ExampleClientOptions);
  constructor (url: string, options: ExampleClientOptions);
  constructor (urlOrCS: string, options: ExampleClientOptions) {
    // have to dig into the first parameter to see whether its
    // a url or a connection string. Not ideal.
  }
}

// better example
class ExampleClient {
  constructor (url: string, options: ExampleClientOptions) {

  }

  static fromConnectionString(connectionString: string, options: ExampleClientOptions) {

  }
}
```

### 서비스 버전

✅ **DO:** 기본적으로 가장 최신의 지원 서비스 API를 호출합니다.
✅ **DO:** 복수 서비스 버전을 지원한다고 하면 클라이언트를 인스턴스화했을 때 소비자가 지원되는 서비스 API 버전을 명시하여 선택할 수 있게 하세요.
✅ **DO:** 서비스 버전 제공할 때 클라이언트 생성자의 옵션 공간에서 `serviceVersion`을 제공하세요. 지원 서비스 버전과 함께 문자열 열거형을 제공할 수도 있습니다.

### 옵션

본 섹션의 가이드라인은 메소드 또는 생성자에 관계 없이 옵션 공간을 통해 클라이언트들에게 옵션을 적용할 수 있습니다. 옵션 이름을 인용할 때, 객체 유저들의 키는 매소드 또는 생성자에 옵션을 전달하는 옵션을 특정하기 위해 사용되어야 한다는 것을 의미합니다.

✅ **DO:** `<클래스 이름>Options`과 `<메소드 이름>Options`과 같은 옵션 공간의 타입 이름을 각각 지정하세요.
✅ **DO:** `abortSignal` 시그널 취소 옵션 이름을 지정하세요.
✅ **DO:** `In<단위>` 접미어를 이용하십시오. 단위는 밀리세컨드 `ms`를 이용하고, 그렇지 않으면 그 단위 이름을 적어주세요. 예제는 `timeoutInMs`와 `delayInSeconds`를 포함합니다.

### Retry 특정 옵션

다수의 서비스는 재시도 관례와 이를 설정할 수 있는 다양한 방법을 가지고 있습니다.

✅ **DO:** 다음 표에서 제시된 옵션 이름을 참고하세요

| Option | Values | Usage | Other Names (informational) |
| --- | --- | --- | --- |
| retryMode | ‘fixed’, ‘linear’, ‘exponential’ | Used to specify the retry strategy |   |
| maxRetries | number >= 0 | Number of times to retry. 0 effectively disables retrying. |   |
| retryDelayInMs | number > 0 | Delay between retries. For linear and exponential strategies, this is the initial retry delay and increases thereafter based on | the strategy used. |   |
| maxRetryDelayInMs | number > 0 | Maximum delay between retries. For linear and exponential strategies, this effectively clamps the maximum amount of time between retries. |   |
| tryTimeoutInMs | number > 0 | How long to wait for a particular retry to complete before giving up |  |

TODO: Please add a code sample showing how these fit into a track 2 JS/TS library.

✅ **DO:** 다음 재시도 전략을 지원해야 합니다:

- `fixed`: 절대 변하지 않는 주기 이후에 시도한다.
- `exponential`: 매 시도마다 지수적으로 증가하는 주기 이후에 시도한다.

TODO: Are these implemented by default in Azure Core or does the API designer need to implement these? If there is no action for the API Designer, let’s take this out.
