# 타입스크립트 가이드라인: 적용

만족스로운 API 디자인을 끝냈다면, 서비스 클라이언트 적용을 시작할 수 있습니다.

☑️ **SHOULD:** [타입스크립트 클라이언트 라이브러리 템플릿](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/template/template)을 사용하세요.

TODO: Please add a discussion of how to use the Http Pipeline to implement a service method, if relevant, and on creating and adding custom policies to the pipeline.

## 구성

당신의 클라이언트 라이브러리를 구성할 때, 당신의 클라이언트 라이브러리가 (소비자가 사용하고 있는 다른 클라이언트 라이브러리과 함께) 전역적, 한정적으로 Azure 서비스 연결을 올바르게 구성했는지 확실하게 할 필요가 있습니다.

✅ **DO:** `@azure/core-configuration` 패키지를 이용하십시오. `@azure/core-configuration` 패키지는 구성에 있어서 일반적인 가이드라인을 따르고 있습니다. 특히:
    - 환경 설정과 관련된 모든 것들을 가져옵니다.
    - 소비자 코드의 전역 설정과 관련된 모든 것들을 가져옵니다.

### 클라이언트 구성

✅ **DO:** 사용자로부터 명시적으로 요청된 것이거나 기본값으로부터 가져온 전역 구성 설정을 이용하세요. 구성 개체를 클라이언트 생성자에게 전달하는 것이 예입니다.
✅ **DO:** 다른 구성을 사용하기 위해 동일한 타입의 다른 클라이언트를 허용하세요.
✅ **DO:** 당신의 서비스 클라이언트의 소비자가 한 번에 모든 전역 구성 설정을 선택 해제할 수 있도록 허용하세요.
✅ **DO:** 클라이언트가 제공한 옵션에 의해 모든 전역 구성 설정이 오버라이드 될 수 있게 허용하세요. 이 옵션들의 이름은 사용자 대상 전역 구성 키들과 일치해야 합니다.
⛔️ **DO NOT:** 클라이언트가 생성된 이후에 일어나는 구성 설정 때문에 행동을 바꾸지 마세요. 클라이언트들의 계층 구조들이 명시적으로 바뀌거나 오버라이드 되지 않는 한 부모 클라이언트의 구성 설정을 상속하세요. 다음과 같은 상황에서 이 요구사항은 예외입니다:
    1. Azure SDK 간 즉시 반영되는 로그 레벨
    1. Azure SDK 간 즉시 반영되는 추적 켜기/끄기

### 서비스 특정 환경변수

✅ **DO:** Azure에 특정된 환경변수에는 `AZURE_` 접두어를 붙이세요.
✔️ **MAY:** 당신의 클라이언트 라이브러리에 인자로서 제공된 포탈 구성 설정을 위한 클라이언트 라이브러리 특정 환경 변수를 이용할 수 있습니다. 커넥션 세부 항목이나 인증 정보가 보통 여기에 포함됩니다. 예를 들어, 서비스 버스는 다음과 같은 환경 변수를 지원할 수 있습니다:
    - `AZURE_SERVICEBUS_CONNECTION_STRING`
    - `AZURE_SERVICEBUS_NAMESPACE`
    - `AZURE_SERVICEBUS_ISSUER`
    - `AZURE_SERVICEBUS_ACCESS_KEY`
스토리지는 다음 변수들을 이용할 수 있습니다:
    - `AZURE_STORAGE_ACCOUNT`
    - `AZURE_STORAGE_ACCESS_KEY`
    - `AZURE_STORAGE_DNS_SUFFIX`
    - `AZURE_STORAGE_CONNECTION_STRING`
✅ **DO:** 매 새로운 환경 변수에 대해 [아키텍처 보드](https://github.com/azure/azure-sdk/issues)에 승인을 받으세요.
✅ **DO:** 특정 Azure 서비스에 대새 다음과 같은 환경 변수 문법을 이용하세요:
    - `AZURE_<서비스이름>_<구성키>`
_서비스이름_ 은 공백없이 정해진 약어이고, _구성키_ 는 클라이언트 라이브러리를 위한 중첩되지 않은 구성 키입니다.

⛔️ **DO NOT:** 당신의 환경변수 이름에 `_`를 제외한 특수문자를 사용하지 마세요. 이 규칙은 전반적인 상호운용성을 보증합니다.

## 파라미터 검증

서비스에서 요청을 수행하기 위해 서비스 클라이언트는 몇 개의 메소드를 가지고 있습니다. _서비스 파라미터_ 는 Azure 서비스 간 직접적으로 전달됩니다. _클라이언트 파라미터_ 는 서비스에 직접적으로 전달되지는 않으나 요청을 처리하기 위해 클라이언트 라이브러리 내부적으로 이용하는 것들입니다. URI를 생성하기 위해 이용되는 값들이나 스토리지에 업로드하기 위한 파일들이 클라이언트 파라미터의 예시라 할 수 있습니다.

✅ **DO:** 클라이언트 파라미터를 검증하세요.
⛔️ **DO NOT:** 서비스 파라미터는 검증하지 마세요. null 값, 빈 문자열, 그리고 보통의 검증 조건 확인 등을 포함하는 말입니다. 모든 요청 파라이머에 대해 서비스가 검증하게 하세요.
✅ **DO:** 서비스 파라미터가 서비스에 의해 생성된 적절한 메시지인지 확실치 않을 때 개발자 경험을 검증하세요. 만약 서버사이드의 에러 메시지에 의해 개발자 경험이 제대로 이루어지지 못했을 때, 릴리즈 전에 서비스 팀과 혐력하여 고치세요.

## 네트워크 요청

각 지원 언어는 HTTP 요청 수행이나 구성과 같은 걱정을 덜기 위한 일반적인 매커니즘이 포함된 Azure 코어 라이브러리가 있습니다.

✅ **DO:** `@azure/core-http` 패키지 내부에 있는 서비스 REST 엔트 포인트와 통신하기 위한 HTTP 파이프라인 컴포넌트를 이용하세요.

HTTP 파이프라인은 복수 정책을 래핑한 HTTP 전송 등이 포함되어 있습니다. 각 정책은 파이츠라인이 요청이나 응답에 의해 수정할 수 있는 동안 제어 포인트가 될 것입니다. 우리는 Azure 서비스와 상호작용할 수 있게 기본 정책 값들을 표준화하여 정해두었습니다. 리스트의 순서는 적용에 있어 가장 예민한 부분입니다.

✅ **DO:** HTTP 파이프라인에서 다음 정책을 적용하십시오.
    - Telemetry
    - Unique Request ID
    - Retry
    - Authentication
    - Response downloader
    - Distributed tracing
    - Logging
    - TODO: If these policies are already implemented in Azure Core, does the library developer need to do this? If not, please remove this guidance.

☑️ **SHOULD:** 가능할 때마다 Azure 코어의 정책 적용을 이용하세요. 당신 서비스에서 특별한 것이 없다면 "write your own" 정책을 시도하지 마세요. 기존 정책에서 필요한 다른 옵션이 있다면, [아키텍처 보드](https://github.com/azure/azure-sdk/issues)와 협력해 옵션을 추가하세요.

## 인증

인증을 적용할 때, PII(Personaly Identifable Information) 유출이나 인증 정보 유출과 같은 보안 허점을 소비자에게 공개하지 마세요. 인증 정보는 보통 시간 제한과 함께 발급되고, 기대한 기능처럼 지속적으로 서비스 연결이 보증될 수 있도록 주기적으로 갱신해야 합니다.당신의 클라이언트 라이브러리가 모든 현재 보안 권고사항들을 따르고 있는지 확인하고, 잠재적인 보안 문제를 소비자에게 알리지 않게 클라이언트 라이브러리 자체 보안 리뷰를 받는 것을 고려해보세요.

⛔️ **DO NOT:** 보안 인증정보를 재사용하거나, 캐시하거나, 유지하지 마세요. 보안 인증정보는 보안 우려와 인증정보 갱신 등을 위해 단기간 유효해야 합니다.

만약 표준적이지 않은 인증 시스템을 당신의 서비스에 적용했을 때 (Azure 코어에서 제공하지 않는 인증 정보를 당신의 서비스에 적용했을 때) 클라리언트 라이브러리에 의해 제공된 대안 인증 타입 요청을 인증하는 HTTP 파이프라인의 인증 정책을 제공해야 합니다.

✅ **DO:** 표준적이지 않은 인증정보를 이용했을 때 HTTP 파이프라인의 HTTP 요청을 인증하는 적절한 인증 정책을 제공하세요. 가능하다면 관용적인 커넥션 문자열을 포함하세요.

TODO: Would a code sample be helpful here?

## 네이티브 코드

일부 언어는 플랫폼 특정 네이티브 코드 플러그인 개발을 지원합니다. 이것들은 호환성 이슈를 발생하거나 다른 추가 조사를 요할 수 있습니다. C와 C++ 같은 기계 친화적인 코드 형태로 컴파일되는 언어가 있는 반면 대다수의 최신 언어들은 크로스플랫폼 지원을 돕기 위한 중간 포맷 형태로 컴파일되는 방식을 채택하고 있습니다.

☑️ **SHOULD:** 기계 친화적인 포맷으로 컴파일되지 않는 한 플랫폼 특정 / 네이티브 코드를 작성하세요.

## 에러 처리

에러 처리는 클라이언트 라이브러리 적용에 있어 중요한 부분입니다. 문제점들이 소비자로 전달되기 위한 기본적인 수단입니다. 에러들이 소비자에게 보고되기 위해 두 가지 방법이 있습니다. 예외 처리를 하는 방법이거나, 소비자가 확인해야 하는 에러 코드를 반환값으로 제공하는 방법입니다. 에러값을 반환하든 예외 처리를 하든 지 간에 우리는 "에러 발생"이라는 표현을 사용하겠습니다. 그리고 "에러"는 에러 값이나 예외 개체입니다.

☑️ **SHOULD:** 에러를 발생할 때 에러 값을 반환하는 데 있어 예외 처리를 선호해야 합니다.
✅ **DO:** 모든 HTTP 요청이 성공적인 상태 코드로서 서비스/Swagger에 의한 HTTP 상태코드가 정해져있지 않아 실패했다면 에러를 발생시키세요.
✅ **DO:** 상태 코드와 헤더 등을 포함한 HTTP 응답과 URL, 쿼리 파라미터, 헤더 등을 포함한 기존 HTTP 요청을 에러에 포함해야 합니다.

복수 HTTP 요청이 발생되는 고차원 메소드를 위해 마지막 예외나 모든 실패 사항들에 대한 예외 묶음을 제공해야 합니다.

✅ **DO:** (응답 헤더나 본문을 통해) 에러 정보에 대한 많은 정보를 서비스에서 반환하고 있다면 서비스 특정 속성이나 필드에서 그 정보를 볼 수 있게 해야 합니다.
⚠️ **SHOULD NOT:** 개발자각 에러를 처리할 수 있는 다른 대안이 없어 새로운 에러 타입을 만들어서는 안됩니다. 에러 타입들은 Azure 코어 패키지에서 제시된 기존 에러 타입을 기반으로 해야 합니다.
⛔️ **DO NOT:** 특정 언어의 에러 타입으로 충분하다면 새로운 에러 타입을 만들어서는 안 됩니다. 검증을 위해 시스템 제공 에러 타입을 이용하세요.
✅ **DO:** 적당하다면 검증 실패 시 ECMAScript 빌트인 에러 타입을 이용하세요. 특히:
    - 문자열이 들어갈 부분에 개체가 들어가는 것과 같은 타입 전달 관련 에러는 `TypeError`를 이용하세요.
    - 0보다 큰 숫자에 0을 넣는 것과 같이 허용 범위 초과와 같은 에러는 `RangeError`를 이용하세요.
    - 모든 다른 실패 시 `Error`를 이용하세요.
✅ **DO:** 각 메소드에서 제공하는 에러들을 문서화하세요. (해당 언어에서 잘 문서화되지 않은 에러들에 대한 예외처리와 같은 메소드에서)
☑️ **SHOULD:** `instanceof`를 사용하는 것보다 catch 구문에서 이름 속성을 확인해야 합니다.

## 의존성

종속성은 종종 종속성을 피함으로써 쉽게 피할 수 있는 많은 고려 사항을 가져옵니다.

**버전 관리**: 많은 프로그래밍 언어에서는 소비자가 동일한 패키지의 여러 버전을 로드할 수 없습니다. 예를 들어, 패키지 Foo의 v3이 필요한 클라이언트 라이브러리가 있고 소비자가 패키지 Foo의 v5를 사용하려는 경우, 사용자는 해당 애플리케이션을 빌드할 수 없습니다. 클라이언트 라이브러리에는 기본적으로 종속성이 없어야 합니다.

**크기**: 소비자 애플리케이션은 최대한 빨리 클라우드에 배포해야 합니다. 추가 코드(예: 종속성)를 제거하여 배포 성능을 향상시킵니다.

**라이센스**: 종속성의 라이센스 제한에 대해 알고 있어야 하며, 종속성을 사용할 때 적절한 속성과 통지를 제공하는 경우가 많습니다.

**호환성**: 의존성을 통제하지 않아야 합니다. 원래 사용법과 호환되지 않는 방향으로 발전하도록 선택할 수 있습니다.

**보안**: 종속성에서 취약성이 발견되면 취약성을 수정하기 어렵거나 시간이 걸릴 수 있습니다.

✅ **DO:** 모든 클라이언트 라이브러리에서 공통적인 기능에 대해 Azure Core 라이브러리에 의존합니다. 이 라이브러리에는 HTTP 연결, 글로벌 구성 및 자격 증명 처리를 위한 API가 포함되어 있습니다.
⛔️ **DO NOT:** 클라이언트 라이브러리 배포 패키지 내의 다른 패키지에 종속됩니다. 의존성은 아키텍처 검토를 통해 철저히 검사됩니다. 반면 빌드 종속성은 허용 가능하고 일반적으로 사용됩니다.
☑️ **SHOULD:** 다른 패키지에 종속되지 않도록 필요한 코드를 클라이언트 라이브러리에 복사하거나 링크하는 것이 좋습니다. 라이센스 계약을 위반하지 마십시오. 코드를 복제할 때 필요한 유지 관리를 고려하십시오. "조금만 베껴 쓰는 것이 조금 의존하는 것보다 낫다." (YouTube)

## 버저닝

- 일관된 버저닝은 소비자들이 라이브러리 새 버전에서 기대되는 것이 뭔지 결정할 수 있습니다. 그러나 버저닝 규칙은 언어에 관용적인 부분입이니다. 공학 시스템 릴리즈 가이드라인은 버전에서 MAJOR.MINOR.PARCH 포맷을 권유하고 있습니다.

✅ **DO:** 클라이언트 라이브러리에서 모든 항목이 변경될 때 클라이언트 라이브러리의 버전 번호를 변경합니다.
✅ **DO:** 버그를 수정할 때 패치 버전을 늘립니다.
⛔️ **DO NOT:** 패치 릴리스에 새 기능을 포함하지 마십시오.
✅ **DO:** 서비스 API 버전에 대한 지원을 추가할 때 주 버전 또는 부 버전을 증가시키거나 이전 버전과 호환되는 기능을 추가합니다.
⛔️ **DO NOT:** 급진적인 변경사항을 만들지 마세요. 변경사항이 절대적으로 필요한 경우, 변경하기 전에 아키텍처 보드에 참여해야 합니다. 중단 변경이 승인되면 주 버전을 증가합니다.
☑️ **SHOULD:** 큰 피쳐를 변경할 때 주 버전을 증가합니다.
✅ **DO:** 지원되는 특정 서비스 API 버전을 호출할 수 있는 기능을 제공합니다.

라이브러리의 특정(major.minor) 버전은 라이브러리에서 지원하는 서비스 API를 선택할 수 있습니다. 지원 창은 Microsoft 비즈니스, 개발자 및 데스크톱 시스템에 대한 고정 라이프사이클 정책에 지정된 서비스 버전(사용 가능한 경우) 이상이어야 합니다.

✅ **DO:** `semver` 버전을 사용하세요. 사용되지 않는 기능 및 플래그는 개발자에게 안정적인 대체 경로 또는 베타 경로를 제공해야 합니다.
⛔️ **DO NOT:** GA 패키지에 대한 사전 릴리스 버전 또는 추가 빌드 메타데이터가 있어야 합니다.
✅ **DO:** 베타 패키지에 1.0.0-100 형식의 사전 릴리스 버전을 지정합니다.X 여기서 X는 정수입니다. 사전 릴리스 패키지 버전에는 추가 빌드 메타데이터가 없어야 합니다.
⛔️ **DO NOT:** 베타 패키지의 경우에도 주 버전 0을 사용합니다.
✅ **DO:** 다른 npm 범위 또는 언어로 서비스에 대해 릴리스된 다른 Track 1 패키지의 가장 높은 버전 번호보다 큰 버전 번호를 선택합니다.

시맨틱 버전 지정은 일부 라이브러리의 실용적인 사양이라기보다는 고상한 이상입니다. 또한 한 사람의 벌레가 다른 사람의 주요 특징일 수도 있습니다. 패키지 작성자는 소비자에게 유용한 방법으로 semver를 따라야 합니다.

자세한 내용은 릴리스 정책을 검토하십시오.

## 패키징

✅ **DO:** Npm 패키지 소유권을 Azure 또는 마이크로소프트 조직으로 설정합니다.

### 패키지 레이아웃

- 다음 npm 패키지 파일 구조를 따르세요:

```text
azure-library
├─ README.md
├─ LICENSE
├─ dist
│  ├─ index.js
│  ├─ index.js.map
│  └─ ... *.js
│
├─ dist-esm
│  └─ lib
│    ├─ index.js
│    ├─ index.js.map
│    └─ ... *.js
│
├─ types
│  └─ service.d.ts
│
└─ package.json
```

✅ **DO:** 해당되는 경우 위 규칙을 따릅니다.

패키지에 tsconfig.json 파일을 포함합니다. 일반적으로 포함시키는 것은 유용하지만 tsconfig.json 파일은 모노레포 구조에 많이 연결되어 있으므로 개별 패키지 내부에서 읽으면 제대로 작동하지 않습니다.

## 배포

최신 npm 패키지는 다양한 사용 시나리오를 대상으로 여러 소스 배포를 제공하는 경우가 많습니다. 패키지에는 CJS 또는 UMD 빌드, ESM 빌드 및 원본 소스 파일이 포함되어야 합니다. 패키지에는 특정 사용 시나리오에 필요한 다른 소스 배포가 포함될 수 있습니다. 소스 배포를 추가로 포함할 경우 패키지 크기가 증가한다는 것이 주요 단점입니다(패키지가 클수록 CI가 더 오래 걸립니다). 그러나 성능, 호환성 및 개발자 경험 목표가 더 중요한 경우가 많습니다.

✅ **DO:** TypeScript 컴파일러 옵션 `inlineSources`를 사용하여 소스 맵 파일의 `sourcesContent`에 소스 코드를 포함하세요.

패키지의 소스 코드는 개발자가 패키지를 디버깅하는 데 도움이 됩니다. 정의로 이동은 기능 사용 방법을 확인하는 빠른 방법입니다. 호출 스택에서 유용한 이름과 읽을 수 있는 소스 코드를 보면 디버깅에 도움이 됩니다. 사용자가 망가진 코드를 풀 필요가 없기 때문에 빌드 아티팩트를 공격적으로 최적화할 수 있습니다.

✅ **DO:** 노드를 지원하려면 패키지에 CommonJS(CJS) 또는 UMD 빌드를 포함하세요.
✅ **DO:** JS 또는 UMD 모듈을 단순화하세요. 롤업은 모듈을 단순화하는데 권장됩니다.

여러 모듈을 하나의 파일로 패키징하는 프로세스를 평탄화라고 합니다. 라이브러리의 로드 시간을 크게 줄이는 데 사용됩니다. 평탄화는 Azure Functions와 같은 서비스의 콜드 스타트 시간에 측정 가능한 영향을 미칠 수 있습니다. 성능에 민감한 개발자는 애플리케이션을 직접 패키징할 가능성이 높지만, 특히 개발 중에는 더 빠른 시작이 여전히 중요합니다.

✅ **DO:** 패키지에 ESM(ECM) 빌드를 포함합니다.
⛔️ **DO NOT:** ESM 모듈을 평면화하지(flatten) 마세요.

ESM 분포는 모듈 그래프를 최적화하는 Webpack과 같은 도구에 의해 사용됩니다. 대상 런타임 버전을 지원하기 위해 "트랜스파일"되어야 합니다. Webpack 4.0 이전 버전의 Webpack은 ESM 빌드가 평평해진 경우 최적화된 번들을 더 잘 생성합니다. 하지만, 평면화하는 것은 트리를 흔드는 것과는 잘 어울리지 않습니다. 최신 버전의 Webpack은 평면화 않은 ESM 빌드를 사용할 때 더 잘 작동합니다.

⛔️ **DO NOT:** 브라우저 번들을 패키지에 포함합니다. 브라우저 번들을 발송하는 것은 사용자에게 편리하지만 몇 가지 중요한 단점도 있습니다. 예를 들어 브라우저 번들은 전체 종속성 트리를 평활화하고 종속된 모든 오픈 소스 구성 요소를 다시 배포해야 합니다. 이 작업을 수행하려면 타사 알림이 필요합니다. txt는 정확해야 하며 복잡하고 오류가 발생하기 쉽습니다. 모든 종속성의 보안 취약점을 사용하려면 브라우저 번들 서비스도 수행해야 합니다.

실제로 프로덕션 애플리케이션에서 작업하는 사용자는 번들러를 사용할 가능성이 높습니다. 게다가, 현대의 번들러는 이전의 번들에 비해 훨씬 사용하기 쉽습니다. Aure 클라이언트 라이브러리는 대부분의 인기 번들러와 함께 작동해야 합니다.

## 모듈

✅ **DO:** 상위 레벨에서 이름이 있는 `export`를 사용하세요.
⛔️ **DO NOT:** 상위 레벨에서 `default export`를 사용하지 마세요.