# Kharj — Project Overview for Claude

## What is Kharj?

Kharj is a multi-user personal wealth management system. Users manage assets across
multiple accounts, record payments and incomes, track shared ownership, and settle
debts automatically. The name "خرج" means "expense" in Persian.

---

## Working Rules

- **Apply changes directly to the files — do not commit.** Make the edits in the working
  tree and stop there. Only run `git commit` (or push) when explicitly asked to.
  **Confirm the full absolute working directory (e.g. `pwd`) before creating or referencing
  a file, on every prompt — don't assume it from earlier in the conversation.** There are
  two near-identical workspaces on disk (`projects/kharj/` and `projects/kharj2/`), each
  containing its own `kharj/` (backend) and `kharjf/` (frontend) — it's easy to silently
  write into the wrong one.
- **Database access for testing/development:** if you need to hit the database for
  testing or local development, use the `STAGE_...` variables from `.env`
  (`STAGE_MYSQL_HOST`, `STAGE_MYSQL_PORT`, `STAGE_MYSQL_USERNAME`,
  `STAGE_MYSQL_PASSWORD`, `STAGE_MYSQL_DATABASE`) — never the plain `MYSQL_...`
  variables. `databaseConfig.development` in
  `src/common/ports/database/sequelize-cli.config.ts` (used whenever
  `appConfigs.nodeEnv === 'develop'`) already reads from `STAGE_MYSQL_*`; the plain
  `MYSQL_*` variables back `production` and point at the real database.

---

## Maintaining This File

After making any change to the project (code, schema, migrations, API routes,
conventions, tooling), update `CLAUDE.md` in the same change so it stays accurate.
Treat this file as part of the deliverable — if what you changed makes anything here
wrong or incomplete (structure, API reference, business logic, conventions), fix it.

---

## Repository Structure

This file lives inside `kharj/` — the backend repo's own root — so every path in the
**Backend** section below is relative to here, with no prefix needed. Paths under
**Frontend** live in a sibling directory one level up and reach it via `../kharjf/kharj/`.

```
kharj2/                           workspace root — NOT a git repo
├── kharj/                        Backend — NestJS API        ← git repo (this CLAUDE.md lives here)
│   └── CLAUDE.md                 this file
└── kharjf/                       Frontend workspace — not a git repo
    ├── kharj/                    Frontend — React + Vite SPA ← git repo (origin: kharj-front)
    │   └── tmp/visly/            Visly mockup PNGs (see UI Design System)
    ├── back/back.sql             SQL dump of the database
    └── visily-multiscreens/      duplicate copy of the mockup PNGs
```

**Git boundary:** there are **two independent repositories** — `kharj/` (backend, this
repo — this file is version-controlled as part of it) and `../kharjf/kharj/` (frontend,
remote `git@github.com:faridEsnaashari/kharj-front.git`). They are not submodules and
share no history; a change spanning both needs a commit in each. The workspace root and
`kharjf/` itself (the frontend workspace directory) are not repos.

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

Paths below are relative to this repo's root (`kharj/`).

```
src/
├── app.module.ts
├── app.configs.ts                      appPort, appBaseUrl
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── auth.config.ts
│   ├── dtos/
│   └── logics/
│       ├── auth.logic.ts               getToken(headers)
│       └── jwt.logic.ts                createUserToken, extractUserFromToken
├── user/
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.module.ts
│   ├── dtos/
│   └── entities/
│       ├── user.entity.ts
│       ├── user-relation.entity.ts
│       └── repositories/
│           ├── user.repository.ts
│           └── user-relation.repository.ts
├── bank/                               User-customisable banks (hybrid: general + user-defined)
│   ├── bank.controller.ts
│   ├── bank.service.ts
│   ├── bank.module.ts
│   ├── enums/
│   │   └── bank-provider.enum.ts       BankProvider { RESALAT } — SMS/xlsx parsing dispatch
│   ├── dtos/
│   │   ├── create-bank.dto.ts
│   │   └── update-bank.dto.ts
│   └── entities/
│       ├── bank.entity.ts
│       └── repositories/
│           └── bank.repository.ts
├── unit/                               User-customisable units (hybrid: general + user-defined)
│   ├── unit.controller.ts
│   ├── unit.service.ts
│   ├── unit.module.ts
│   ├── dtos/
│   │   ├── create-unit.dto.ts
│   │   └── update-unit.dto.ts
│   └── entities/
│       ├── unit.entity.ts
│       └── repositories/
│           └── unit.repository.ts
├── account/
│   ├── account.controller.ts
│   ├── account.service.ts
│   ├── account.module.ts
│   ├── dtos/
│   │   ├── create-account.dto.ts
│   │   ├── get-all-account.dto.ts
│   │   └── get-account-statistic.dto.ts
│   ├── logics/
│   │   └── account.logic.ts            groupAccountsByUnit
│   └── entities/
│       ├── account.entity.ts
│       └── repositories/
│           └── account.repository.ts
├── payment/
│   ├── payment.controller.ts
│   ├── payment.service.ts
│   ├── payment.module.ts
│   ├── dtos/
│   │   ├── craete-payment.dto.ts
│   │   ├── update-payment.dto.ts
│   │   └── get-all-payment.dto.ts
│   ├── enums/
│   │   └── payment-category.enum.ts
│   ├── logics/
│   │   ├── payment.logic.ts            selectAccountsForPayment, sortAccounts, getPrice,
│   │   │                               restoreBalance, deductBalance, hasSufficientBalance
│   │   └── payment.logic.type.ts
│   └── entities/
│       ├── payment.entity.ts
│       └── repositories/
│           └── payment.repository.ts
├── income/
│   ├── income.controller.ts
│   ├── income.service.ts
│   ├── income.module.ts
│   ├── dtos/
│   │   ├── create-income.dto.ts
│   │   ├── update-income.dto.ts
│   │   └── get-all-income.dto.ts
│   ├── enums/
│   │   └── income-category.enum.ts
│   ├── logics/
│   │   └── income.logic.ts             calculateUpdatedBalance
│   └── entities/
│       ├── income.entity.ts
│       └── repositories/
│           └── income.repository.ts
├── exchange/
│   ├── exchange.controller.ts
│   ├── exchange.service.ts
│   ├── exchange.module.ts
│   ├── dtos/
│   │   └── create-exchange.dto.ts
│   └── entities/
│       ├── exchange.entity.ts
│       └── repositories/
│           └── exchange.repository.ts
├── account-debt/
│   └── entities/
│       ├── account-debt.entity.ts
│       └── repositories/
│           └── account-debt.repository.ts
├── debt/
│   ├── debt.controller.ts
│   ├── debt.service.ts
│   ├── debt.module.ts
│   └── dtos/
│       └── get-all-debt.dto.ts
├── transaction/
│   ├── transaction.controller.ts
│   ├── transaction.service.ts
│   ├── transaction.module.ts
│   ├── dtos/
│   │   └── get-all-transactions.dto.ts
│   ├── types/
│   │   └── transaction.type.ts         Transaction = (Payment | Income) & { type }
│   └── logics/
│       └── transaction.logic.ts        mergeAndSortByDate, slicePage, fetchLimitForPage
├── uncomplete-payment/
│   ├── uncomplete-payment.controller.ts
│   ├── uncomplete-payment.service.ts
│   ├── uncomplete-payment.module.ts
│   ├── dtos/
│   ├── enums/
│   └── logics/
│       ├── resalat/
│       │   ├── convert-resalat-text.logic.ts
│       │   ├── convert-resalat-xlsx.logic.ts
│       │   └── convert-meli-text.logic.ts
│       ├── pasargad/
│       │   ├── convert-pasargad-text.logic.ts   SMS text (same 4-line shape as Resalat)
│       │   └── convert-pasargad-xlsx.logic.ts   Wepod/Pasargad "account bill" xlsx export
│       └── mely/
│           └── convert-mely-xlsx.logic.ts       Bank Mely "account turnover" xls export
├── file/
│   ├── file.controller.ts
│   ├── file.service.ts
│   ├── file.module.ts
│   └── logics/
│       └── xlsx.logic.ts
└── common/
    ├── filters/
    │   └── http-exceptions.filter.ts
    ├── gaurds/
    │   └── hasAccess.gaurd.ts          reads token → attaches req.user
    ├── interseptors/
    │   └── response.interseptor.ts     wraps all responses: { success, message, data }
    ├── pipes/
    │   └── zod-validation.pipe.ts
    ├── ports/
    │   └── database/
    │       ├── database.module.ts
    │       ├── database-connection.logger.ts   logs host:port/db once on bootstrap
    │       ├── common-repository/
    │       │   └── common-repository.ts    base CRUD + pagination + count
    │       ├── migrations/
    │       └── seeders/
    ├── tools/
    │   ├── date/
    │   │   └── date.tool.ts
    │   └── pino/
    │       ├── pino.module.ts              LoggerModule.forRoot (pino-pretty transport)
    │       ├── logger.tool.ts              Logger — structured { key, data } wrapper
    │       └── filtered-logger.tool.ts     FilteredLogger — silences RoutesResolver/
    │                                       RouterExplorer route-mapping noise at startup
    ├── types/
    │   ├── entity.type.ts              CreateEntity<T>, UpdateEntity<T>
    │   └── pagination.type.ts          Paginated<T> = { rows: T[]; count: number }
    ├── zod-schemas/
    │   ├── id.schema.ts
    │   └── date.schema.ts
    └── test-utils/
        └── mock-repository.ts          createMockRepository() for unit tests
```

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
```

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

#### Exchange (`exchange.service.ts`)

Transfers `fromAmount` out of the caller's own account and `toAmount` into a
destination account, creating a `Payment` (category `EXCHANGE`) on the source
side and an `Income` (category `EXCHANGE`) on the destination side.

- The source account is always looked up with `userId: user.id` — you can only
  exchange money out of an account **you** manage.
- The destination account is looked up with `userId: toUser` (a field on
  `CreateExchangeDto`), not `user.id` — this lets the destination account be
  managed by a different (related) user's book, as long as `ownedBy: toOwner`
  still matches. This is how a user moves money into a share they own that
  happens to live in someone else's account book.
- `toUser` is not persisted on the `exchanges` table — it's only used for the
  destination-account lookup. It's recoverable later via
  `income.account.userId` (the `Income` row's `accountId` → `Account.userId`).

#### UncompletePayments

Raw bank data (SMS text or xlsx file) is parsed into `UncompletePayment` records. The user then reviews and converts them into real `Payment` or `Income` records. Parser dispatch happens inline in `uncomplete-payment.service.ts` (`paymentText` / `uploadBandExport`) by branching on the `Bank` enum (`src/account/enums/bank.enum.ts`) — currently `RESALAT` and `PASARGAD` are wired for both, `MELY` for xlsx upload.

- **RESALAT** text: 4-line SMS (`account\namount±\nMM/DD_HH:mm\nمانده: remain`), Jalali month/day assumed current Jalali year.
  xlsx: positional `__EMPTY_N` columns (Excel export has no header names), sign of `__EMPTY_8` distinguishes payment/income.
- **PASARGAD** text: identical 4-line SMS shape to Resalat, reuses the same parsing logic.
  xlsx: Wepod "account bill" export (see `tmp/pasargad/get-account-bill.ts`) with named JSON columns — `issuanceDate` (ISO, UTC-offset — converted to `Asia/Tehran` before formatting), `amount`, `debtor` (`true` = income / balance increase, `false` = payment / outflow), `afterTxAmount` (→ `remain`), `description` (source CARD/ONLINE guessed via keyword match, else UNKNOWN).
- **MELY** xlsx: "account turnover" export, positional `__EMPTY_N` columns like Resalat but with 3 metadata rows + a Persian header row first — transaction rows are recognised by a numeric `__EMPTY` (row index). Jalali `تاریخ`+`زمان` → `paidAt`; `نوع` (`برداشت`/`واریز`) picks payment/income; comma-separated rial strings `مبلغ`/`مانده` → `amount`/`remain` via `getPrice`; source keywords matched after normalising Arabic `ي`/`ك` to Persian `ی`/`ک`.

#### Recent Activity (Transactions)

`GET /transaction/recent-activity` merges payments and incomes from all of the user's accounts, sorted by `paidAt` DESC. Since two tables are merged, pagination is done manually: fetch `page * size` from each source, merge+sort, then slice the requested page.

### API Reference

| Method | Route                          | Description                                                                                     |
| ------ | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| POST   | `/auth/signin`                 | Sign in, returns token                                                                          |
| GET    | `/user/related-user`           | Get related users                                                                               |
| GET    | `/bank`                        | List banks (general + own)                                                                      |
| GET    | `/bank/:id`                    | Get one bank                                                                                    |
| POST   | `/bank`                        | Create user bank                                                                                |
| PUT    | `/bank/:id`                    | Update own bank                                                                                 |
| DELETE | `/bank/:id`                    | Delete own bank (if unused)                                                                     |
| GET    | `/unit`                        | List units (general + own)                                                                      |
| GET    | `/unit/:id`                    | Get one unit                                                                                    |
| POST   | `/unit`                        | Create user unit                                                                                |
| PUT    | `/unit/:id`                    | Update own unit                                                                                 |
| DELETE | `/unit/:id`                    | Delete own unit (if unused)                                                                     |
| GET    | `/account`                     | List accounts (filters: ownedBy, bankId, unitId)                                                |
| GET    | `/account/statistic`           | Balance totals grouped by unit                                                                  |
| GET    | `/account/:id`                 | Get one account with owner/bank/unit info                                                       |
| POST   | `/account`                     | Create account                                                                                  |
| GET    | `/payment`                     | List payments (filters: bankId, unitId, ownedBy, category)                                      |
| POST   | `/payment`                     | Create payment (runs allocation logic)                                                          |
| PUT    | `/payment/:id`                 | Update payment (reverses + re-applies)                                                          |
| GET    | `/income`                      | List incomes (filters: bankId, unitId, ownedBy, category)                                       |
| GET    | `/income/:id`                  | Get one income                                                                                  |
| POST   | `/income`                      | Create income                                                                                   |
| PUT    | `/income/:id`                  | Update income (reverses + re-applies)                                                           |
| POST   | `/exchange`                    | Transfer between accounts (destination can be managed by a different related user via `toUser`) |
| GET    | `/debt`                        | List debts (filters: fromUserId, toUserId, bankId, unitId)                                      |
| GET    | `/transaction/recent-activity` | Merged payment+income feed                                                                      |
| GET    | `/uncomplete-payment`          | List pending imports                                                                            |
| POST   | `/uncomplete-payment/text`     | Parse SMS text                                                                                  |
| POST   | `/upload/bank-export`          | Upload xlsx statement                                                                           |
| DELETE | `/uncomplete-payment/:id`      | Delete pending import                                                                           |

### Testing

Unit tests only (services + logic files). No E2E tests.

- Test files: `*.spec.ts` co-located with the file under test
- Services are instantiated directly with `new Service(...mocks)` — no Nest testing module
- Repositories are mocked with `createMockRepository()` from `src/common/test-utils/mock-repository.ts`
- External modules (xlsx logic, resalat parsers) are mocked with `jest.mock(...)`

Run from this directory (`kharj/`):

```bash
npm test                                    # all tests
npm test -- src/unit/unit.service.spec.ts   # one file
npm test -- -t "createUnit"                 # by test name
npm run test:cov                            # with coverage
```

### Running the Backend

Run from this directory (`kharj/`):

```bash
npm run start:dev    # development with watch
npm run build        # production build
npm run start:prod   # production
```

Environment variables (`.env`):

```
# APP
APP_PORT=3000
APP_BASE_URL=http://localhost:3000
APP_MODE=develop

# MYSQL — production database (also used for the `test` Sequelize env)
MYSQL_HOST=...
MYSQL_PORT=...
MYSQL_DATABASE=...
MYSQL_USERNAME=...
MYSQL_PASSWORD=...

# STAGE MYSQL — used automatically when appConfigs.nodeEnv === 'develop';
# this is the database for local development and testing, see Working Rules above
STAGE_MYSQL_HOST=...
STAGE_MYSQL_PORT=...
STAGE_MYSQL_DATABASE=...
STAGE_MYSQL_USERNAME=...
STAGE_MYSQL_PASSWORD=...

# SECRET
JWT_SECRET_KEY=...
```

---

## Frontend

Location: `../kharjf/kharj/`

### Current Status — Active Rewrite

The frontend is **being redeveloped from scratch** against a new set of Visly UI
screens. Treat existing frontend code as provisional: it may be replaced wholesale
rather than patched. When a new screen arrives, prefer building it fresh in the
established structure over retrofitting what is already there.

### Stack

- **Framework:** React + Vite — **client-side only** (SPA, no SSR, no server runtime).
  All data comes from the backend API over HTTP.
- **Language:** JavaScript (JSX)
- **HTTP:** Axios (configured in `src/features/auth/api/api.config.js`)
- **Styling:** CSS modules per feature (`auth.css`)

### Mobile View — Frontend's Full Responsibility

The frontend is **fully responsible for the mobile view**. Every screen must be
built and verified for phone-sized viewports first — mobile is the primary
target, not an afterthought:

- The Visly mockups are phone screens; implement them at phone width
  (`--screen-max-width`, currently 412px) and let desktop centre that column on
  the dark backdrop (see `.auth-viewport` in `auth.css` for the pattern).
- No layout may require a wide viewport to function: no fixed widths beyond the
  screen column, no horizontal scrolling, no hover-only interactions —
  everything must work with touch.
- Use relative units and the spacing tokens; test any new screen at a narrow
  viewport (~360–412px) before considering it done.
- When a trade-off arises between desktop polish and mobile usability, mobile
  wins.

### Project Layout

Paths below are relative to `../kharjf/kharj/`.

```
src/
├── App.jsx                         Auth routing (signin / signup / authenticated)
├── App.css
├── main.jsx
├── index.css
├── api.config.js                   duplicate of features/auth/api/api.config.js — prefer the feature copy
├── core/                           empty placeholder
├── features/
│   ├── auth/
│   │   ├── Signin.jsx              built on shared components; signs in with `username` (API contract)
│   │   ├── Signup.jsx              built on shared components; signup API is still mocked
│   │   ├── index.js
│   │   ├── api/
│   │   │   └── api.config.js       Axios instance + token helpers
│   │   ├── constants/
│   │   │   └── authStates.js       AUTH_STATES enum { SIGNIN, SIGNUP, AUTHENTICATED }
│   │   ├── hooks/
│   │   │   └── useAuth.js          signin() (real API), signup() (mock)
│   │   └── styles/
│   │       └── auth.css            page scaffold only — all values reference tokens.css;
│   │                               controls come from shared/components
│   ├── dashboard/
│   ├── accounts/
│   ├── payments/
│   ├── inbox/
│   └── debts/
└── shared/
    ├── components/                 Design-system components (see below)
    │   ├── index.js                barrel — import from here, not from files
    │   └── icons.jsx               inline stroke icons, inherit currentColor
    ├── hooks/
    │   └── useDismiss.js           outside-click + Escape dismissal for popovers
    ├── lib/
    │   └── date.js                 dayjs + Jalali helpers
    ├── styles/
    │   ├── tokens.css              design tokens — the single source of truth
    │   └── components.css          all component styles
    └── utils/
        └── index.js                cx, splitFieldProps, toggleInArray
```

### Auth Flow

```
App mounts
  → lazy useState initializer checks localStorage for token
  → token exists   → AUTH_STATES.AUTHENTICATED → main app
  → token missing  → AUTH_STATES.SIGNIN        → <Signin />

Signin success → setAuthToken(token) → AUTH_STATES.AUTHENTICATED
Signup success → AUTH_STATES.SIGNIN  (signup API is mocked; lands on Signin)
Logout         → removeAuthToken()  → AUTH_STATES.SIGNIN

Screen switching: Signin/Signup receive onSwitchToSignup / onSwitchToSignin
from App.jsx — the "Create One Instead" / "Log In Instead" buttons.
```

### API Config (`../kharjf/kharj/src/features/auth/api/api.config.js`)

- Base URL: `VITE_API_URL` env var (default `http://localhost:3000`)
- Request interceptor: attaches `Authorization: Bearer <token>` from localStorage
- Response interceptor: on 401 → clears token → redirects to signin

### Shared Component Library

`src/shared/` holds the design system. Build screens by composing these — do not
hand-roll a button, input, or card in a feature folder.

```javascript
import {
    Button,
    Input,
    DateField,
    Card,
    Amount,
} from '../../shared/components';
```

`src/shared/styles/components.css` is imported once in `src/main.jsx`; individual
components never import CSS.

**Available:** `Button`/`IconButton` `Input`/`PasswordInput` `Textarea` `Select`
`DateField` `TimeField` `Calendar` `Field` `Form`/`FormRow` `Chip`/`ChipGroup`
`Card`(+`CardHeader`/`CardBody`/`CardFooter`) `Badge` `Section`/`SectionHeader`
`List`/`ListRow` `SegmentedControl` `Switch` `Avatar`/`AvatarStack` `ProgressBar`
`Amount` `IconTile` `Spinner`, plus the icons from `icons.jsx` and the `CALENDARS`
enum re-exported from `shared/lib/date.js`.

Source files, one concern each:

```
shared/components/Button.jsx      Button, IconButton
shared/components/Input.jsx       Input, PasswordInput, Textarea, Select, Form, FormRow
shared/components/Field.jsx       Field — label/error/aria wiring for every control
shared/components/DateField.jsx   DateField, TimeField
shared/components/Calendar.jsx    Calendar (month grid)
shared/components/Card.jsx        Card + subcomponents, IconTile
shared/components/Chip.jsx        Chip, ChipGroup, Badge
shared/components/Amount.jsx      Amount, ProgressBar
shared/components/List.jsx        Section, SectionHeader, List, ListRow
shared/components/Toggle.jsx      SegmentedControl, Switch
shared/components/Avatar.jsx      Avatar, AvatarStack
shared/components/Spinner.jsx     Spinner
shared/components/icons.jsx       stroke icons, all inherit currentColor
shared/components/primitives.jsx  INTERNAL: Control (form-control shell),
                                  Pressable (button-when-clickable) — composed by
                                  the components above, not exported from the
                                  barrel, never imported by feature code
shared/utils/index.js             cx (className joiner), splitFieldProps,
                                  toggleInArray — pure, framework-free
shared/hooks/useDismiss.js        outside-click + Escape dismissal for popovers
```

Internal conventions (hold these when adding components):

- Build className strings with `cx(...)` — never template-literal `.trim()` chains.
- A field-style component takes Field's wrapper props (label/hint/error/optional/
  required/className) and splits them off with `splitFieldProps(props)`; the
  control itself renders inside a `Control` shell.
- Anything clickable that isn't semantically a button already renders through
  `Pressable` so it becomes a real `<button>` when `onClick` is set.
- Expensive stateless instances are module-level singletons — the dayjs+jalali
  setup in `shared/lib/date.js`, the per-precision `Intl.NumberFormat` cache in
  `Amount.jsx`.

#### Rules

1. **Never hard-code a colour, radius, or spacing value.** Reference a token from
   `tokens.css`. If the value you need isn't tokenised, add the token first.
2. **Radius is semantic, not a size scale** — `--radius-input` (10px) for controls,
   `--radius-card` (16px) for cards, `--radius-pill` for chips/badges,
   `--radius-tile` for icon tiles.
3. **One `variant="primary"` Button per screen.** It is that screen's single call to
   action; everything else is `secondary`, `ghost`, or `link`.
4. **Selection has two forms** — Cards select with a blue border + tinted fill; Chips
   select with a solid blue fill. Don't mix them.
5. **Money direction is meaning.** `Amount` renders green/inbound-arrow for positive
   and red/outbound-arrow for negative. Keep the arrow — colour alone fails for
   colour-blind users. Pass `tone="neutral"` for a balance, which has no direction.
6. **Inputs compose `Field`**, which owns the label, the error message, and the
   `aria-describedby`/`aria-invalid` wiring. A new input type must use it too.
7. **Badge vs Chip:** if it responds to a click it's a `Chip`; if it's just status
   it's a `Badge`.

#### Dates and the Jalali calendar

`DateField` is deliberately **not** a native `<input type="date">` — the native control
cannot render the Persian (Jalali) calendar. It renders a custom popover `Calendar`
backed by `dayjs` + `jalali-plugin-dayjs`.

**The critical rule:** `value` and `onChange` are always **Gregorian ISO** (`YYYY-MM-DD`).
The `calendar` prop (`CALENDARS.JALALI` / `CALENDARS.GREGORIAN`) changes only what the
user sees. Calling `.format()` on a Jalali-bound dayjs instance emits Jalali digits
(`1403-03-04`) — if such a string reaches state or the API it will be silently
misread as Gregorian. `src/shared/lib/date.js` collapses through the epoch timestamp
to prevent this; any new date helper must do the same.

`TimeField` _is_ a native `<input type="time">` — time has no calendar dimension, so
the OS picker is the right control there.

### UI Design System

Designs come from Visly and are sent in as screen images. CSS class prefix: `visily-`.
Dark theme, blue accents. Screens: Signup, Signin, Dashboard, Accounts List, Account
Details, New Payment, Payment Review, Payment Result, Payments Inbox, Debts Ledger,
Profile/Settings.

#### The screens are a template, not a specification

This is the most important rule when implementing a screen from a Visly mockup.

**Follow the design for — the visual language:**

- Buttons: shape, size, radius, colours, hover/active/disabled states
- Inputs: field styling, labels, placeholders, focus and error states
- Layout: spacing, grid, alignment, card/panel structure
- Typography, colour palette, iconography

**Do _not_ copy literally — the content:**

- Field names and labels — use the real domain fields from the backend API
  (e.g. `ballance`, `ownedBy`, `unitId`), not whatever the mockup happens to show
- Which fields appear on a screen — add, remove, or reorder as the real data requires
- Screen flow and navigation between steps
- Placeholder/sample data in the mockup — it is filler, never a data contract

When the mockup and the actual API disagree, **the API wins**. Build the real
functionality and dress it in the mockup's visual style. Do not invent backend fields
to match a mockup, and do not drop a required field because the mockup omits it.

#### Mockup Files

Reference screens live in `../kharjf/kharj/tmp/visly/` as PNGs — read them directly with
the Read tool when implementing a screen:

```
visily-signup.png
visily-dashboard.png
visily-accounts-list.png
visily-account-details.png
visily-new-payment.png
visily-payment-review.png
visily-payment-result.png
visily-payments-inbox.png
visily-debts-ledger.png
visily-profile-&-settings.png
```

The same PNGs are also duplicated at `../kharjf/visily-multiscreens/`. Treat
`../kharjf/kharj/tmp/visly/` as the canonical copy.

There is no Signin mockup — derive Signin from the Signup screen's styling.

### Running the Frontend

Run from `../kharjf/kharj/`:

```bash
npm run dev      # development
npm run build    # production build
```

Environment variables (`../kharjf/kharj/.env`):

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
