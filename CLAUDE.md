`CLAUDE.md`

```markdown
# Kharj — Project Overview for Claude

## What is Kharj?

Kharj is a multi-user personal wealth management system. Users manage assets across
multiple accounts, record payments and incomes, track shared ownership, and settle
debts automatically. The name "خرج" means "expense" in Persian.

---

## Repository Structure
```

/
├── backend/ NestJS API
└── frontend/ React + Vite SPA

```

---

## Backend

### Stack
- **Framework:** NestJS
- **ORM:** Sequelize + sequelize-typescript
- **Database:** MySQL
- **Validation:** Zod (via custom `ZodValidationPipe`)
- **Auth:** JWT (custom logic, no Passport)
- **Language:** TypeScript (`strict`, `noImplicitAny: true`)
- **Testing:** Jest + ts-jest

### Project Layout

```

src/
├── app.module.ts
├── app.configs.ts appPort, appBaseUrl
├── auth/
│ ├── auth.controller.ts
│ ├── auth.service.ts
│ ├── auth.module.ts
│ ├── auth.config.ts
│ ├── dtos/
│ └── logics/
│ ├── auth.logic.ts getToken(headers)
│ └── jwt.logic.ts createUserToken, extractUserFromToken
├── user/
│ ├── user.controller.ts
│ ├── user.service.ts
│ ├── user.module.ts
│ ├── dtos/
│ └── entities/
│ ├── user.entity.ts
│ ├── user-relation.entity.ts
│ └── repositories/
│ ├── user.repository.ts
│ └── user-relation.repository.ts
├── bank/ User-customisable banks (hybrid: general + user-defined)
│ ├── bank.controller.ts
│ ├── bank.service.ts
│ ├── bank.module.ts
│ ├── enums/
│ │ └── bank-provider.enum.ts BankProvider { RESALAT } — used for SMS/xlsx parsing dispatch
│ ├── dtos/
│ │ ├── create-bank.dto.ts
│ │ └── update-bank.dto.ts
│ └── entities/
│ ├── bank.entity.ts
│ └── repositories/
│ └── bank.repository.ts
├── unit/ User-customisable units (hybrid: general + user-defined)
│ ├── unit.controller.ts
│ ├── unit.service.ts
│ ├── unit.module.ts
│ ├── dtos/
│ │ ├── create-unit.dto.ts
│ │ └── update-unit.dto.ts
│ └── entities/
│ ├── unit.entity.ts
│ └── repositories/
│ └── unit.repository.ts
├── account/
│ ├── account.controller.ts
│ ├── account.service.ts
│ ├── account.module.ts
│ ├── dtos/
│ │ ├── create-account.dto.ts
│ │ ├── get-all-account.dto.ts
│ │ └── get-account-statistic.dto.ts
│ ├── logics/
│ │ └── account.logic.ts groupAccountsByUnit
│ └── entities/
│ ├── account.entity.ts
│ └── repositories/
│ └── account.repository.ts
├── payment/
│ ├── payment.controller.ts
│ ├── payment.service.ts
│ ├── payment.module.ts
│ ├── dtos/
│ │ ├── craete-payment.dto.ts
│ │ ├── update-payment.dto.ts
│ │ └── get-all-payment.dto.ts
│ ├── enums/
│ │ └── payment-category.enum.ts
│ ├── logics/
│ │ ├── payment.logic.ts selectAccountsForPayment, sortAccounts, getPrice,
│ │ │ restoreBalance, deductBalance, hasSufficientBalance
│ │ └── payment.logic.type.ts
│ └── entities/
│ ├── payment.entity.ts
│ └── repositories/
│ └── payment.repository.ts
├── income/
│ ├── income.controller.ts
│ ├── income.service.ts
│ ├── income.module.ts
│ ├── dtos/
│ │ ├── create-income.dto.ts
│ │ ├── update-income.dto.ts
│ │ └── get-all-income.dto.ts
│ ├── enums/
│ │ └── income-category.enum.ts
│ ├── logics/
│ │ └── income.logic.ts calculateUpdatedBalance
│ └── entities/
│ ├── income.entity.ts
│ └── repositories/
│ └── income.repository.ts
├── exchange/
│ ├── exchange.controller.ts
│ ├── exchange.service.ts
│ ├── exchange.module.ts
│ ├── dtos/
│ │ └── create-exchange.dto.ts
│ └── entities/
│ ├── exchange.entity.ts
│ └── repositories/
│ └── exchange.repository.ts
├── account-debt/
│ └── entities/
│ ├── account-debt.entity.ts
│ └── repositories/
│ └── account-debt.repository.ts
├── debt/
│ ├── debt.controller.ts
│ ├── debt.service.ts
│ ├── debt.module.ts
│ └── dtos/
│ └── get-all-debt.dto.ts
├── transaction/
│ ├── transaction.controller.ts
│ ├── transaction.service.ts
│ ├── transaction.module.ts
│ ├── dtos/
│ │ └── get-all-transactions.dto.ts
│ ├── types/
│ │ └── transaction.type.ts Transaction = (Payment | Income) & { type }
│ └── logics/
│ └── transaction.logic.ts mergeAndSortByDate, slicePage, fetchLimitForPage
├── uncomplete-payment/
│ ├── uncomplete-payment.controller.ts
│ ├── uncomplete-payment.service.ts
│ ├── uncomplete-payment.module.ts
│ ├── dtos/
│ ├── enums/
│ └── logics/
│ └── resalat/
│ ├── convert-resalat-text.logic.ts
│ ├── convert-resalat-xlsx.logic.ts
│ └── convert-meli-text.logic.ts
├── file/
│ ├── file.controller.ts
│ ├── file.service.ts
│ ├── file.module.ts
│ └── logics/
│ └── xlsx.logic.ts
└── common/
├── filters/
│ └── http-exceptions.filter.ts
├── gaurds/
│ └── hasAccess.gaurd.ts reads token → attaches req.user
├── interseptors/
│ └── response.interseptor.ts wraps all responses: { success, message, data }
├── pipes/
│ └── zod-validation.pipe.ts
├── ports/
│ └── database/
│ ├── database.module.ts
│ ├── common-repository/
│ │ └── common-repository.ts base CRUD + pagination + count
│ ├── migrations/
│ └── seeders/
├── tools/
│ └── date/
│ └── date.tool.ts
├── types/
│ ├── entity.type.ts CreateEntity<T>, UpdateEntity<T>
│ └── pagination.type.ts Paginated<T> = { rows: T[]; count: number }
├── zod-schemas/
│ ├── id.schema.ts
│ └── date.schema.ts
└── test-utils/
└── mock-repository.ts createMockRepository() for unit tests

````

### Naming Conventions
- Controllers, services, modules: `kebab-case` filenames, `PascalCase` classes
- DTOs: `kebab-case` filenames, `camelCase` Zod schema export, `PascalCase` type export
- Entities: define both a plain `type` (e.g. `Account`) and a Sequelize `Model` class (e.g. `AccountModel`)
- `CreateX` and `UpdateX` types are derived from `CreateEntity<T>` / `UpdateEntity<T>` with relation fields omitted

### Entity Type Pattern

```typescript
export type Account = { id: number; userId: number; bank: Bank; ... };
export type CreateAccount = Omit<CreateEntity<Account>, 'user' | 'bank' | 'unit'>;
export type UpdateAccount = Omit<UpdateEntity<Account>, 'user' | 'bank' | 'unit'>;

@Table({ tableName: 'accounts', underscored: true })
export class AccountModel extends Model<Account, CreateAccount> implements Account { ... }
````

### Repository Pattern

Every module has a repository that extends `CommonRepository<T, TCreate, TUpdate, TModel>`.
Available methods:

- `create(data)`
- `bulkCreate(data[])`
- `findAll(conditions)`
- `findOne(conditions)` — returns `null` if not found
- `findOneById(id)`
- `findOneOrFail(conditions)` — throws if not found
- `findOneByIdOrFail(id)` — throws if not found
- `updateOneById(data, id)`
- `deleteById(id)`
- `pagination(findOptions, { page, size })` — returns `Paginated<T>`
- `count(conditions)` — returns `number`

**Rule:** never use `findOne` + manual existence check. Always use `findOneOrFail` / `findOneByIdOrFail`.

### Response Format

All responses are wrapped by the response interceptor:

```json
{ "success": true, "message": "OPERATION_DONE", "data": { ... } }
```

Paginated responses:

```json
{ "success": true, "message": "OPERATION_DONE", "data": { "rows": [...], "count": 100 } }
```

### Authentication

- `POST /auth/signin` — returns `{ token }` (no signup endpoint yet)
- Token is JWT, verified in `HasAccessGuard`, attached to `req.user`
- Every protected controller uses `@UseGuards(HasAccessGuard)`
- Token must be sent as `Authorization: Bearer <token>`

### Coding Rules (strictly enforced)

1. **No `any`** — `noImplicitAny: true`. Use `as unknown as T` when casting Sequelize include results.
2. **No inline conditions** — always use blocks:
    ```typescript
    // ✅
    if (query.bankId) {
        where.bankId = query.bankId;
    }
    // ❌
    if (query.bankId) where.bankId = query.bankId;
    ```
3. **Optional where fields** — use spread to avoid type errors:
    ```typescript
    const where: WhereOptions<Account> = {
        userId: user.id,
        ...(query.bankId ? { bankId: query.bankId } : {}),
        ...(query.unitId ? { unitId: query.unitId } : {}),
    };
    ```
4. **Logic in logic files** — any business calculation or data transformation belongs in a `logics/` file, not inline in the service.
5. **Services only** — orchestrate: call repositories, call logic functions, return results.
6. **Use `PUT` for full updates** (all fields required), `PATCH` for partial.
7. **File names in code blocks** — every filename must be in a code block for one-click copy.

### Key Business Logic

#### Banks and Units — Hybrid Model

Both banks and units follow the same pattern:

- **General** (`userId = null`) — seeded in DB, available to all users, not editable via API
- **User-defined** (`userId = <id>`) — created by the user, editable, deletable (if unused)
- `GET /bank` and `GET /unit` always return both merged for the requesting user

#### Accounts and Shared Ownership

- Each account belongs to a `userId` (the managing user) and has an `ownedBy` (the owner of that share)
- A single bank+unit combination can have multiple accounts with different `ownedBy` values — this is how shared ownership is modelled
- `priority` determines which account/share is drawn from first during a payment

#### Payment Allocation Logic (`payment.logic.ts`)

When a payment is created:

1. All accounts matching `{ userId, bankId, unitId }` are fetched, sorted by `priority`
2. `sortAccounts` moves the target owner's account to the front
3. `selectAccountsForPayment` deducts from accounts in order until the price is covered
4. If an account belonging to a different owner is used, an `AccountDebt` record is created:
    - `fromUserId` = the account owner whose balance was used
    - `toUserId` = the payment's target owner (who spent the money)

#### Update Payment

- Reverses the original amount back to the account (`restoreBalance`)
- Checks new amount fits (`hasSufficientBalance`)
- Applies new amount (`deductBalance`)
- Updates existing `AccountDebt` amount if one exists
- `bankId`, `unitId`, `ownerId` are not updatable (would require full re-allocation)

#### Update Income

- Reverses original amount from account (`calculateUpdatedBalance`)
- Re-applies new amount in the same call
- No debt logic involved

#### UncompletePayments

Raw bank data (SMS text or xlsx file) is parsed into `UncompletePayment` records. The user then reviews and converts them into real `Payment` or `Income` records. Parser dispatch is done by matching `bank.symbol` against `BankProvider` enum values (currently only `RESALAT`).

#### Recent Activity (Transactions)

`GET /transaction/recent-activity` merges payments and incomes from all of the user's accounts, sorted by `paidAt` DESC. Since two tables are merged, pagination is done manually: fetch `page * size` from each source, merge+sort, then slice the requested page.

### API Reference

| Method | Route                          | Description                                                |
| ------ | ------------------------------ | ---------------------------------------------------------- |
| POST   | `/auth/signin`                 | Sign in, returns token                                     |
| GET    | `/user/related-user`           | Get related users                                          |
| GET    | `/bank`                        | List banks (general + own)                                 |
| GET    | `/bank/:id`                    | Get one bank                                               |
| POST   | `/bank`                        | Create user bank                                           |
| PUT    | `/bank/:id`                    | Update own bank                                            |
| DELETE | `/bank/:id`                    | Delete own bank (if unused)                                |
| GET    | `/unit`                        | List units (general + own)                                 |
| GET    | `/unit/:id`                    | Get one unit                                               |
| POST   | `/unit`                        | Create user unit                                           |
| PUT    | `/unit/:id`                    | Update own unit                                            |
| DELETE | `/unit/:id`                    | Delete own unit (if unused)                                |
| GET    | `/account`                     | List accounts (filters: ownedBy, bankId, unitId)           |
| GET    | `/account/statistic`           | Balance totals grouped by unit                             |
| GET    | `/account/:id`                 | Get one account with owner/bank/unit info                  |
| POST   | `/account`                     | Create account                                             |
| GET    | `/payment`                     | List payments (filters: bankId, unitId, ownedBy, category) |
| POST   | `/payment`                     | Create payment (runs allocation logic)                     |
| PUT    | `/payment/:id`                 | Update payment (reverses + re-applies)                     |
| GET    | `/income`                      | List incomes (filters: bankId, unitId, ownedBy, category)  |
| GET    | `/income/:id`                  | Get one income                                             |
| POST   | `/income`                      | Create income                                              |
| PUT    | `/income/:id`                  | Update income (reverses + re-applies)                      |
| POST   | `/exchange`                    | Transfer between accounts                                  |
| GET    | `/debt`                        | List debts (filters: fromUserId, toUserId, bankId, unitId) |
| GET    | `/transaction/recent-activity` | Merged payment+income feed                                 |
| GET    | `/uncomplete-payment`          | List pending imports                                       |
| POST   | `/uncomplete-payment/text`     | Parse SMS text                                             |
| POST   | `/upload/bank-export`          | Upload xlsx statement                                      |
| DELETE | `/uncomplete-payment/:id`      | Delete pending import                                      |

### Testing

Unit tests only (services + logic files). No E2E tests.

- Test files: `*.spec.ts` co-located with the file under test
- Services are instantiated directly with `new Service(...mocks)` — no Nest testing module
- Repositories are mocked with `createMockRepository()` from `src/common/test-utils/mock-repository.ts`
- External modules (xlsx logic, resalat parsers) are mocked with `jest.mock(...)`

```bash
npm test                          # all tests
npm test -- src/unit/unit.service.spec.ts   # one file
npm test -- -t "createUnit"       # by test name
npm run test:cov                  # with coverage
```

### Running the Backend

```bash
npm run start:dev    # development with watch
npm run build        # production build
npm run start:prod   # production
```

Environment variables (`.env`):

```
APP_PORT=3000
APP_BASE_URL=http://localhost:3000
DB_HOST=...
DB_PORT=...
DB_NAME=...
DB_USER=...
DB_PASS=...
```

---

## Frontend

### Stack

- **Framework:** React + Vite
- **Language:** JavaScript (JSX)
- **HTTP:** Axios (configured in `src/features/auth/api/api.config.js`)
- **Styling:** CSS modules per feature (`auth.css`)

### Project Layout

```
src/
├── App.jsx                         Auth routing (signin / signup / authenticated)
├── features/
│   ├── auth/
│   │   ├── Signin.jsx
│   │   ├── Signup.jsx
│   │   ├── index.js
│   │   ├── api/
│   │   │   └── api.config.js       Axios instance + token helpers
│   │   ├── components/
│   │   │   └── AuthInput.jsx
│   │   ├── constants/
│   │   │   └── authStates.js       AUTH_STATES enum { SIGNIN, SIGNUP, AUTHENTICATED }
│   │   ├── hooks/
│   │   │   └── useAuth.js          signin() (real API), signup() (mock)
│   │   └── styles/
│   │       └── auth.css
│   ├── dashboard/
│   ├── accounts/
│   ├── payments/
│   ├── inbox/
│   └── debts/
└── shared/
    ├── components/
    └── utils/
```

### Auth Flow

```
App mounts
  → lazy useState initializer checks localStorage for token
  → token exists   → AUTH_STATES.AUTHENTICATED → main app
  → token missing  → AUTH_STATES.SIGNIN        → <Signin />

Signin success → setAuthToken(token) → AUTH_STATES.AUTHENTICATED
Logout         → removeAuthToken()  → AUTH_STATES.SIGNIN
```

### API Config (`src/features/auth/api/api.config.js`)

- Base URL: `VITE_API_URL` env var (default `http://localhost:3000`)
- Request interceptor: attaches `Authorization: Bearer <token>` from localStorage
- Response interceptor: on 401 → clears token → redirects to signin

### UI Design System

Designs come from Visly. CSS class prefix: `visily-`. Dark theme, blue accents.
Screens: Signup, Signin, Dashboard, Accounts List, Account Details, New Payment,
Payment Review, Payment Result, Payments Inbox, Debts Ledger, Profile/Settings.

The Visily designs are used as a template — layout, button styles, and input styles
are followed, but field names and flow may differ from the mockups.

### Running the Frontend

```bash
npm run dev      # development
npm run build    # production build
```

Environment variables (`.env`):

```
VITE_API_URL=http://localhost:3000
```

---

## Shared Conventions

- Amounts in the DB are stored as raw numbers (no currency formatting)
- Dates are stored as `YYYY-MM-DD HH:mm:ss` strings
- Persian (Jalali) calendar input is supported via the date tool
- `ballance` (note the spelling) is the field name used throughout — do not correct it
- Error messages are snake_case strings, e.g. `'unit-not-found'`, `'insufficient-balance'`

```

```
