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
- **Never kill a server you didn't start yourself** — the user may have their own
  backend/frontend running (default ports `3006`/`5173`) for their own work; killing it
  out from under them is disruptive and not yours to decide. If a default port is
  already taken, that is a signal it's probably the user's, not an obstacle to clear.
- **Run your own verification servers on different ports, and shut them down when
  done.** When you need to launch the backend or frontend to verify a change:
  - Backend: override the port, e.g. `APP_PORT=4006 npm run start:dev`.
  - Frontend: override both its own port and the backend URL it talks to, e.g.
    `VITE_API_URL=http://localhost:4006 npm run dev -- --port 4173`.
  - Kill only the PID(s) you started — note them when you launch, don't rediscover
    "whatever is on the port" later, since by then it may include the user's own
    server if you picked a port that collides.
  - **Killing only the port's listener PID is not enough for `nest start --watch`**:
    it's a supervisor process that immediately respawns a new child the moment the
    old one dies, so `lsof -ti:<port> | xargs kill` alone leaves it running under a
    new PID. Kill the actual `nest start --watch` process (its parent), e.g.:
    ```bash
    lsof -nP -iTCP:<port> -sTCP:LISTEN   # find the PID and its parent (ps -o ppid= -p <pid>)
    kill <watch-mode-parent-pid>         # then confirm the port is actually free
    ```
    Verify with `lsof` afterward — don't assume the `kill` worked.
- **Do not add comments to code — backend or frontend.** No doc comments, no inline
  explanations, no "why" notes left in the file. If something needs explaining, say it in
  the chat response, not in the source. This applies to every file, not just ones written
  from scratch — don't add a comment to an existing file you're editing either.
- **Never run database migrations or CLI commands yourself** (`sequelize-cli db:migrate`,
  `npm run commander <cmd>`, or anything else that changes schema or mutates stored
  data) — not even against the STAGE database. Write the migration/command file,
  verify it builds/compiles, and stop there; the user runs it themselves when they're
  ready. This is stricter than the general STAGE-DB-for-testing rule above: read-only
  queries and starting the app against STAGE are fine, but anything that alters
  structure or rewrites existing rows is the user's call to execute, not yours —
  they may want to review the exact change first, back up data, or time it deliberately.

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
│   │   ├── payment.logic.type.ts
│   │   └── payment-category.logic.ts   getPaymentCategoryOptions() — hardcoded
│   │                                   Record<string, CategoryOption<PaymentCategory>>,
│   │                                   e.g. gymFood: { key: PaymentCategory.GYM_FOOD,
│   │                                   value: 'gym food' }; backs GET /payment/categories
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
│   │   ├── income.logic.ts             calculateUpdatedBalance
│   │   └── income-category.logic.ts    getIncomeCategoryOptions() — hardcoded
│   │                                   Record<string, CategoryOption<IncomeCategory>>;
│   │                                   backs GET /income/categories
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
│   ├── dtos/
│   │   ├── get-all-debt.dto.ts
│   │   └── get-debt-summary.dto.ts
│   └── logics/
│       ├── debt.logic.ts               groupDebts, netDebtGroups, buildDebtSummary
│       └── debt.logic.type.ts
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
    │   ├── pagination.type.ts          Paginated<T> = { rows: T[]; count: number }
    │   └── category.type.ts            CategoryOption<T> = { key: T; value: string }
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

Paginated responses — the interceptor renames a returned `{ rows, count }` shape
to `{ rows, paginationData: { total } }` on the wire:

```json
{ "success": true, "message": "OPERATION_DONE", "data": { "rows": [...], "paginationData": { "total": 100 } } }
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
8. **Ternaries are for short, single expressions only.** A `cond ? a : b` picking
   between two simple values is fine. Once a branch needs its own statements, or
   several `cond ? a : b` entries pile up next to each other (e.g. building several
   promises to run in `Promise.all`), switch to `if`/`else` blocks that assign to a
   `let` instead — nested/stacked ternaries read fine to the person who just wrote
   them and are a lot harder for anyone else (including future-you) to scan:
    ```typescript
    // ✅ — several independent branches, each preparing its own promise
    let paymentsPromise: Promise<Payment[]> = Promise.resolve([]);
    let paymentCountPromise: Promise<number> = Promise.resolve(0);

    if (includePayments) {
        paymentsPromise = this.paymentRepository.findAll({ where: { accountId } });
        paymentCountPromise = this.paymentRepository.count({ accountId });
    }

    const [payments, paymentCount] = await Promise.all([paymentsPromise, paymentCountPromise]);

    // ❌ — same logic, but as a wall of stacked ternaries
    const [payments, paymentCount] = await Promise.all([
        includePayments ? this.paymentRepository.findAll({ where: { accountId } }) : Promise.resolve([]),
        includePayments ? this.paymentRepository.count({ accountId }) : Promise.resolve(0),
    ]);
    ```

### Key Business Logic

#### Banks and Units — Hybrid Model

Both banks and units follow the same pattern:

- **General** (`userId = null`) — seeded in DB, available to all users, not editable via API
- **User-defined** (`userId = <id>`) — created by the user, editable, deletable (if unused)
- `GET /bank` and `GET /unit` always return both merged for the requesting user (or, with
  `?userId=<id>`, merged for a related user's own book instead — see
  `UserService.resolveTargetUserId` below)

#### Accounts and Shared Ownership

- Each account belongs to a `userId` (the managing user) and has an `ownedBy` (the owner of that share)
- A single bank+unit combination can have multiple accounts with different `ownedBy` values — this is how shared ownership is modelled
- `priority` determines which account/share is drawn from first during a payment

#### Cross-Book Lookups (`UserService.resolveTargetUserId`)

`GET /account`, `GET /bank` and `GET /unit` all accept an optional `?userId=<id>` filter that
looks up that data in a *related* user's own book instead of the caller's. Each service
(`AccountService.findAllAccounts`, `BankService.findAllBanks`, `UnitService.findAllUnits`) resolves
it through the shared `UserService.resolveTargetUserId(requestedUserId, user)`:

- No `userId`, or `userId === user.id` → returns `user.id` (the normal, single-user case), no DB lookup.
- Any other `userId` → looked up in `user_relations` (`{ userId: user.id, relatedTo: userId }`); if
  no such relation exists, throws `ForbiddenException('user-not-related')` — this is what stops the
  filter from leaking an arbitrary user's account/bank/unit data.

This exists for Exchange's destination side (`CreateExchangeDto.toUser` — see below): the frontend's
Exchange page needs to resolve a destination account balance, and the bank/unit it uses, in a
different related user's book *before* submitting, not just accept an opaque id blindly. `UserService`
is exported from the `@Global()` `UserModule`, so any service can inject it directly without its
module needing to import `UserModule`.

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

Raw bank data (SMS text or xlsx file) is parsed into `UncompletePayment` records. The user then reviews and converts them into real `Payment` or `Income` records. Parser dispatch happens inline in `uncomplete-payment.service.ts` (`paymentText` / `uploadBandExport`) by branching on the bank's `symbol` (`BankProvider` enum, `src/bank/enums/bank-provider.enum.ts`) — currently `RESALAT` and `PASARGAD` are wired for both, `MELY` for xlsx upload.

xlsx upload is two calls: `POST /file/upload/bank-payment` (multipart, field name `file`) saves the file under `./uploads/bank-upload/` and returns its generated filename; that filename is then passed as `uploadedFile` to `POST /uncomplete-payments/upload/bank-export` (with `bankId`), which reads the file back off disk and parses it. There's no single combined upload+parse endpoint.

`GET /uncomplete-payments` includes each row's `account` (with nested `bank`/`unit`/`owner`) — `bank`/`unit` are needed for `PAYMENT`-type rows, since converting one calls `POST /payment` which wants `bankId`/`unitId`/`ownerId`, not `accountId`; `INCOME`-type rows already carry `accountId` directly and don't strictly need them, but they're included for both so the frontend can render "which account" uniformly. `owner` (just `id`/`name`) is included so the frontend can show whose account a pending row belongs to. Converting a pending row into a real transaction isn't a dedicated endpoint — the frontend just calls the ordinary `POST /payment` or `POST /income` (chosen by the row's `type`) with `uncompletePaymentId` set to the row's id; `GET /uncomplete-payments`' own query already excludes any row with a linked `payment`/`income` (`$payment.uncomplete_payment_id$ IS NULL AND $income.uncomplete_payment_id$ IS NULL`), so a converted row simply stops appearing — no separate "mark resolved" step.

- **RESALAT** text: 4-line SMS (`account\namount±\nMM/DD_HH:mm\nمانده: remain`), Jalali month/day assumed current Jalali year.
  xlsx: positional `__EMPTY_N` columns (Excel export has no header names), sign of `__EMPTY_8` distinguishes payment/income.
- **PASARGAD** text: identical 4-line SMS shape to Resalat, reuses the same parsing logic.
  xlsx: Wepod "account bill" export (see `tmp/pasargad/get-account-bill.ts`) with named JSON columns — `issuanceDate` (ISO, UTC-offset — converted to `Asia/Tehran` before formatting), `amount`, `debtor` (`true` = income / balance increase, `false` = payment / outflow), `afterTxAmount` (→ `remain`), `description` (source CARD/ONLINE guessed via keyword match, else UNKNOWN).
- **MELY** xlsx: "account turnover" export, positional `__EMPTY_N` columns like Resalat but with 3 metadata rows + a Persian header row first — transaction rows are recognised by a numeric `__EMPTY` (row index). Jalali `تاریخ`+`زمان` → `paidAt`; `نوع` (`برداشت`/`واریز`) picks payment/income; comma-separated rial strings `مبلغ`/`مانده` → `amount`/`remain` via `getPrice`; source keywords matched after normalising Arabic `ي`/`ك` to Persian `ی`/`ک`.

#### Recent Activity (Transactions)

`GET /transaction/recent-activity` merges payments and incomes from all of the user's accounts, sorted by `paidAt` DESC. Since two tables are merged, pagination is done manually: fetch `page * size` from each source, merge+sort, then slice the requested page. An optional `type` query param (`PAYMENT` | `INCOME`) restricts the feed to one source — the other repository is skipped entirely (no query, count resolves to `0`) rather than fetched and discarded. Optional `bankId`/`unitId`/`ownedBy` params narrow the underlying account lookup (same `accountWhere` pattern `PaymentService.getAllPayments` already uses) — this is what lets the frontend Payment page's activity list progressively narrow as the user picks a bank/unit in the create-payment form above it, and what lets the Account Details page (`bankId`+`unitId`+`ownedBy` together identify exactly one account) show only that one account's history instead of every account sharing its bank+unit.

#### Account Statistic (Home Page Unit Cards)

Two independent endpoints back the home page unit cards — kept separate rather
than one combined response, so a caller that only needs balances doesn't pay
for the weekly Payment/Income queries:

- `GET /account/static/group-by-unit` — balances only. Groups the user's
  accounts by unit (`AccountStatisticItem[]`: `unitId, unit, total,
  accountCount`), sorted by `total` descending. There is no server-side
  "top N units" concept — a `Unit` has no ordering field of its own
  (`Account.priority` is unrelated, it only orders payment allocation) — so a
  "top 5" home page just takes the first 5 of this already-sorted-by-balance
  array.
- `GET /account/static/weekly-payment-income` — `AccountWeeklyStatisticItem[]`:
  `unitId, weeklyIncome, weeklyPayment`, summing that unit's `Income`/`Payment`
  rows with `paidAt` in the last 7 days (`AccountService` also injects
  `PaymentRepository`/`IncomeRepository` for this, same cross-module pattern as
  `ExchangeService`). Every unit the user has an account in is present even
  with zero activity, so a caller can merge this with `group-by-unit` by
  `unitId` without needing a default-fill step for missing units.

Both accept the same optional `unitId` filter
(`GetAccountStatisticDto`/`getAccountStatisticDtoSchema`, shared between them).
The frontend (`features/dashboard/hooks/useDashboard.js`) calls both in
parallel and merges them client-side into the combined shape `UnitCard`
renders.

#### Debts (read-only — there is no create-debt endpoint)

`AccountDebt` rows are only ever created as a side effect of payment allocation
(see Payment Allocation Logic above) — the Debt module exists purely to list
and summarize them. Both endpoints scope to debts the requesting user is part
of (`Op.or: [{fromUserId: user.id}, {toUserId: user.id}]`) and narrow by the
underlying payment's account via the same `bankId`/`unitId` `accountWhere`
pattern used elsewhere (`DebtService.buildDebtInclude`, shared by both
methods).

- `GET /debt` — paginated, ungrouped list, ordered `createdAt` DESC. Filters:
  `fromUserId`, `toUserId` (each ANDed on top of the self-involvement scope,
  so passing one picks a specific direction), `bankId`, `unitId`.
- `GET /debt/summary` — grouped and netted. `DebtService.getDebtSummary`
  fetches *all* matching `AccountDebt` rows (no pagination — grouping needs
  the full set) via the same include tree, then hands them to
  `debt/logics/debt.logic.ts`, which is pure/framework-free like every other
  `logics/` file:
  - `groupDebts(rows, groupBy)` — sums `amount` per
    `(bank?, unit, fromUserId, toUserId)` key. `groupBy: 'bank'` keys on
    bank+unit (finer); `groupBy: 'unit'` drops bank from the key, collapsing
    debts across banks for the same unit (coarser). Query param
    `groupBy` (`GetDebtSummaryDto`), default `'bank'`.
  - `netDebtGroups(groups)` — for each `(bank?, unit)` and unordered user
    pair, nets the forward group's amount against its reverse-direction
    mirror (`amount - reverseAmount`) and emits **one** row in whichever
    direction the net lands (flips `from`/`to` if the reverse side was
    larger); a pair that nets to exactly `0` is dropped entirely rather than
    emitted as a zero-amount row.
  - `buildDebtSummary` combines both and also returns `totals: {owedToYou,
    youOwe}` — summed straight off the netted rows from the current user's
    perspective — plus the netted rows sorted by `amount` descending.
  - Old-schema note: this replaces raw SQL the user had written against the
    pre-rewrite database, which read `a.unit`/`a.bank` as plain columns
    directly on `accounts`. The current schema normalizes those into
    `Bank`/`Unit` entities reached via `accounts.bankId`/`accounts.unitId`
    foreign keys (same hybrid model as elsewhere) — `buildDebtInclude`'s
    `payment → account → bank`/`unit` include chain is the up-to-date
    equivalent of that join.

### API Reference

| Method | Route                          | Description                                                                                     |
| ------ | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| POST   | `/auth/signin`                 | Sign in, returns token                                                                          |
| GET    | `/user/related-user`           | Get related users                                                                               |
| GET    | `/bank`                        | List banks (general + own, or a related user's own book via `userId`)                           |
| GET    | `/bank/:id`                    | Get one bank                                                                                    |
| POST   | `/bank`                        | Create user bank                                                                                |
| PUT    | `/bank/:id`                    | Update own bank                                                                                 |
| DELETE | `/bank/:id`                    | Delete own bank (if unused)                                                                     |
| GET    | `/unit`                        | List units (general + own, or a related user's own book via `userId`)                           |
| GET    | `/unit/:id`                    | Get one unit                                                                                    |
| POST   | `/unit`                        | Create user unit                                                                                |
| PUT    | `/unit/:id`                    | Update own unit                                                                                 |
| DELETE | `/unit/:id`                    | Delete own unit (if unused)                                                                     |
| GET    | `/account`                     | List accounts (filters: ownedBy, bankId, unitId, userId — see Cross-Book Lookups)                |
| GET    | `/account/static/group-by-unit`       | Balance totals grouped by unit, sorted by balance desc                                    |
| GET    | `/account/static/weekly-payment-income` | Weekly income/payment totals grouped by unit (last 7 days)                              |
| GET    | `/account/:id`                 | Get one account with owner/bank/unit info                                                       |
| POST   | `/account`                     | Create account                                                                                  |
| GET    | `/payment/categories`          | Payment categories as `Record<string, CategoryOption<PaymentCategory>>` (hardcoded)             |
| GET    | `/payment`                     | List payments (filters: bankId, unitId, ownedBy, category)                                      |
| POST   | `/payment`                     | Create payment (runs allocation logic)                                                          |
| PUT    | `/payment/:id`                 | Update payment (reverses + re-applies)                                                          |
| GET    | `/income/categories`           | Income categories as `Record<string, CategoryOption<IncomeCategory>>` (hardcoded)               |
| GET    | `/income`                      | List incomes (filters: bankId, unitId, ownedBy, category)                                       |
| GET    | `/income/:id`                  | Get one income                                                                                  |
| POST   | `/income`                      | Create income                                                                                   |
| PUT    | `/income/:id`                  | Update income (reverses + re-applies)                                                           |
| POST   | `/exchange`                    | Transfer between accounts (destination can be managed by a different related user via `toUser`) |
| GET    | `/debt`                        | List debts, paginated (filters: fromUserId, toUserId, bankId, unitId)                           |
| GET    | `/debt/summary`                | Grouped + netted debt totals (filters: groupBy=`bank`\|`unit`, bankId, unitId)                  |
| GET    | `/transaction/recent-activity` | Merged payment+income feed (filters: `type` = `PAYMENT`\|`INCOME`, `bankId`, `unitId`, `ownedBy`) |
| GET    | `/uncomplete-payments`         | List pending imports (filters: bankId), includes account/bank/unit                              |
| POST   | `/uncomplete-payments/text`    | Parse SMS text into a pending import                                                             |
| POST   | `/uncomplete-payments/upload/bank-export` | Parse an already-uploaded xlsx file (`uploadedFile`) into pending imports              |
| POST   | `/file/upload/bank-payment`    | Upload the raw xlsx file (multipart, field `file`), returns the saved filename                  |
| DELETE | `/uncomplete-payments/:id`     | Delete a pending import                                                                          |

### Testing

Two layers: unit tests (services + logic files, mocked repositories) and E2E tests (real HTTP
requests against a real Nest app, real STAGE database).

#### Unit tests

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

#### E2E tests

Live in `test/`, named `*.e2e-spec.ts` (not `*.spec.ts` — a different suffix on purpose, so the
main Jest config's `testRegex` never picks these up, and vice versa: `test/jest-e2e.json`'s
`testRegex` only matches `.e2e-spec.ts$`). Run with:

```bash
npm run test:e2e   # NODE_ENV=develop jest --config ./test/jest-e2e.json --runInBand
```

`--runInBand` is required, not just a speed choice: every spec below signs in as the same fixture
"owner" STAGE user and mutates the same account/payment/income rows for that user, so running
specs concurrently would race each other.

`NODE_ENV=develop` is required — that's what makes `appConfigs.nodeEnv === 'develop'` in
`database.module.ts`, which is what points the connection at `STAGE_MYSQL_*` instead of the
production `MYSQL_*` vars (see the STAGE-DB Working Rule above). E2E tests hit the real STAGE
database and are **not** read-only — each spec creates real accounts/payments/incomes/etc. through
the real endpoints and asserts on the actual DB-backed side effects (balances, debts, remain
totals). Isolation is **self-cleanup, not transaction rollback**: nothing here wraps a spec in a
DB transaction it rolls back afterward — every spec ends with explicit `DELETE` requests (through
the same API, not direct DB access) that remove exactly what it created. A new mutating e2e test
must follow the same pattern — sign in, act, assert, then delete everything it created — or it
will leak rows into STAGE on every run.

- **`src/app.ts`** — `createApp()` (used by `src/main.ts`) now delegates the actual
  `app.useLogger`/`enableCors`/`useGlobalFilters`/`useGlobalInterceptors` wiring to an exported
  `configureApp(app)`, so E2E tests can apply the exact same middleware/filter/interceptor stack
  a real request would go through, without duplicating it or drifting out of sync.
- **`test/utils/create-test-app.ts`** — `createTestApp()`: the actual Nest E2E pattern —
  `Test.createTestingModule({ imports: [AppModule] }).compile()` then
  `moduleFixture.createNestApplication()` + `configureApp(app)` + `app.init()`. No real
  `NestFactory.create()`/`app.listen()`/TCP port at all — `supertest` talks to
  `app.getHttpServer()` directly in-process. This is deliberate, not just "the standard way":
  booting via a raw `NestFactory.create()` inside a Jest worker (as an earlier, now-deleted
  `src/e2e.spec.ts` attempt did) hit a real `TypeError: Dialect is not a constructor` from
  Sequelize — a known category of ts-jest/Sequelize module-resolution incompatibility that
  doesn't reproduce under plain `ts-node` — and NestJS's default bootstrap-failure teardown
  calls `process.exit(1)` on a fatal error, which kills the whole Jest worker outright (no test
  failure output, the run just dies). `Test.createTestingModule()` doesn't hit this.
  Also exports `e2eTestUser`: `{ owner: { name, password }, other: { name, password } }`, read
  from `E2E_TEST_USER_NAME`/`E2E_TEST_USER_PASSWORD`/`E2E_TEST_OTHER_USER_NAME`/
  `E2E_TEST_OTHER_USER_PASSWORD` — a real plaintext-password STAGE login, not a minted JWT. Specs
  authenticate by actually calling `POST /auth/signin`, the same way a real client would. The
  `owner` user is expected to already have exactly two related users set up in STAGE
  (`GET /user/related-user` returning 2 rows) — this is STAGE fixture data the tests depend on,
  not something any spec creates; `other`'s credentials exist for specs that need a second,
  independently-authenticated user rather than just a related-user id.
- **`test/utils/request.logic.ts`** — infra shared by every spec and every `logics/` file (lives
  under `utils/`, not `logics/`, precisely because it isn't domain logic). `makeAppReq(app)`
  returns a bound `makeReq` closure so callers don't have to pass `app` on every call.
  `makeReq<Res>(app, { method, baseUrl, body?, query?, token? })` wraps `supertest`, optionally
  sets `Authorization: Bearer <token>`, and returns the already-parsed `KharjResponse<Res>`
  (`{ success, message, data }`) body — callers read `.data` directly instead of unwrapping
  `.body` themselves each time.

#### The `logics/` composition pattern

Each domain gets its own `test/logics/<domain>.logic.ts` exporting a `createTest<Domain>(makeReq)`
factory. Calling the factory returns exactly `{ test, after }` — every logic file has this same
two-function shape, no more and no less:

- **`test(data)`** performs the real HTTP calls and assertions for that one domain, and returns
  whatever a later step in the same spec might need (e.g. `account.logic.ts`'s `test()` returns
  the created `Account[]`, which a payment/income/exchange spec then feeds into the next logic
  file). `data` carries everything `test()` needs explicitly — signed-in users, already-created
  accounts, config values — never re-derived, hardcoded, or read off some ambient state. This is
  what makes the files composable: a spec wires several `createTestX(makeReq)` instances together
  by passing one's return value into the next's `test()` call.
- **`after()`** always returns `Promise.all([...])` (or `.map()` over whatever was created, for a
  dynamic-length list like payments — `selectAccountsForPayment` can split one `POST /payment`
  across several `Payment` rows) of independent `DELETE` calls, never a sequential `for` loop of
  `await`s. The point isn't performance — it's that `Promise.all` kicks off every delete
  concurrently regardless of whether an earlier one throws, so one failed cleanup call doesn't
  block the others from still running. Internally each factory closures a single `created` array
  that `after()`'s cleanup list is built from — don't keep a separate `results` array alongside
  `created` purely to mirror it; that was tried and reverted as pointless duplication.
- **Every `createTestX(makeReq)` instance is created fresh per test and `test()` is called at
  most once on it.** A spec with several `it()` blocks (see `payment.e2e-spec.ts` below)
  instantiates `accountTest`/`incomeTest`/etc. in `beforeEach`, not `beforeAll` — so each test gets
  its own instance with an empty closured `created` array, and `after()` in `afterEach` cleans up
  exactly what that one test made before the next test's `beforeEach` runs. This is what lets
  `test()` just `return created;` directly, with no offset-tracking needed — a **real bug** was hit
  and fixed here: an earlier version shared one `accountTest` instance across all of
  `payment.e2e-spec.ts`'s `it()` blocks via `beforeAll`/`afterAll`, so `created` accumulated across
  calls, and `const [x] = await accountTest.test(...)` in the second `it()` silently destructured
  index `0` of the *entire cross-call history* — some earlier `it()`'s account, not the one just
  created — producing confusing arithmetic mismatches (expected balance computed from the wrong
  starting point) rather than an obvious "wrong account" failure. The fix wasn't to slice the
  return value; it was to stop sharing instances across tests at all.

Current logic files, all under `test/logics/`:

- **`auth/signin.logic.ts`** — `signinTestUsers(makeReq)`: signs in as `e2eTestUser.owner` via
  `POST /auth/signin`, fetches `GET /user/related-user`, asserts exactly 2 related users. Returns
  `{ owner, relations }` (typed as `SignedInUserTest`) — every other logic file takes this as
  its `users` parameter. `after()` is a no-op; there's nothing to sign back out of.
  **`relations.data[0]` is the signed-in `owner` themself** (this STAGE fixture's related-users
  list includes a self entry first), and `relations.data[1]` is the one real *other* related user
  — this is what makes an "account owned by the caller's own book" test possible without a
  dedicated "who am I" endpoint or decoding the JWT: use `relations.data[0].id` for `ownedBy` to
  mean "the caller themself," and `relations.data[1].id` to mean "an actual related user."
- **`account.logic.ts`** — `createTestAccount(makeReq)`: `test({ users, accounts: TestAccount[] })`
  loops over an arbitrary list of accounts to create (each with its own `ownedBy`/`userId`/
  `ballance`/`priority`/`bank.symbol`/`unit.symbol`), asserting each creation and that a duplicate
  bank+unit+owner combo is rejected. It is **not** hardcoded to exactly an "owner" and an "other"
  account — a spec that needs accounts for three related users just passes a 3-item array. Returns
  the created `Account[]` in input order (destructure by position, e.g.
  `const [ownerAccount, otherAccount] = await accountTest.test(...)`).
- **`income.logic.ts`** — `createTestIncome(makeReq)`: `test({ users, incomes: TestIncome[] })`,
  where each `TestIncome` carries its **own** `account: Account` (not one account shared across
  the whole call) — one `test()` call can fund several different accounts, including related
  users' accounts, in a single pass. Running-balance math is seeded from the `account.ballance`
  the caller already has (no extra `GET` needed just to learn the starting point), but every
  income creation is still followed by a real `GET /account/:id` to assert the persisted balance
  actually moved — seeding from trusted input and verifying against the live API are different
  concerns, both matter.
- **`payment.logic.ts`** — `test({ users, debitedAccount, creditedAccount?, payment })` reads
  balances entirely from `POST /payment`'s own response instead of any `GET /account/:id` call.
  This works because `selectAccountsForPayment` (backend `payment.logic.ts`) puts *every* account
  it considered into `selectedAccounts` — including ones it didn't actually draw from, with
  `minus: 0` — and `PaymentService.createPayment` creates a `Payment` row for each entry in that
  list, not just the ones that were debited. So when a payment is covered by pulling from a
  different owner's account, the response's `Payment[]` already contains **two** rows: one for
  `debitedAccount` (`amount` = what was actually deducted, `remain` = its new balance) and one for
  the untouched `creditedAccount` (`amount: 0`, `remain` = its unchanged balance) — both are found
  by `accountId` in the same array, no separate fetch needed for either side. `creditedAccount` is
  **optional**: pass it when the payment pulls from a different owner's account (asserts that
  payment row exists with `amount: 0`, and asserts the resulting `AccountDebt` via `GET /debt`
  using the accounts' *caller-supplied* `ownedBy` — safe to trust unlike `ballance`, since
  `ownedBy` is fixed at account-creation time and never changes); omit it when the payment is fully
  covered by `debitedAccount` itself (self-funded — no debt should exist, so nothing further to
  assert). `payment.e2e-spec.ts` covers all three shapes this allocation logic can take: pulling
  from another owner's account (debt created), the account owner paying for themself out of their
  own funded account (no debt), and a payment "for" a related user whose *own* account already
  covers it rather than needing to draw from someone else's (also no debt, but a different
  account/owner combination than the self-pay case).
- **`exchange.logic.ts`** — unlike `payment.logic.ts`, this still does `GET /account/:id` fresh
  immediately before and after the mutating call, never trusting a passed-in `Account` object's
  `ballance` for the math (the account may have been funded by an `income.logic.ts` step *after*
  it was created, so any `ballance` captured at account-creation time is stale by the time an
  exchange runs). `POST /exchange` only ever creates a single `Exchange` row describing the
  transfer itself — unlike payments, there's no per-account response row to read a resulting
  balance off of, so a fresh fetch is the only way to verify both sides actually moved by the
  right amount.
- **`uncomplete-payment.logic.ts`** — `createTestUncompletePayment(makeReq)`: `test({ users,
  bankId, text, expected })` posts to `/uncomplete-payments/text` and asserts the parsed row
  against `expected` (a `Partial<UncompletePayment>`). Converting the pending row into a real
  payment isn't this logic file's job — the spec composes `uncompletePaymentTest.test(...)` and
  `paymentTest.test(...)` itself, passing the pending row's `id` as the payment's
  `uncompletePaymentId`, mirroring how the real frontend Inbox flow works (see UncompletePayments
  above) — there is no dedicated "convert" endpoint to wrap.

**`toMatchObject` gotcha**: never spread an optional field into an expected object unconditionally
when it might be `undefined` — `{ description: payment.description }` fails against a real
response that simply omits the key, because `toMatchObject` treats an explicit `description:
undefined` in the *expected* object differently from the key being absent, even though both read
as "no description" to a human. Use `...(value ? { key: value } : {})` instead (both
`payment.logic.ts` and `income.logic.ts` do this for `description`).

**Category/type fields must use the real backend enum**, not a same-looking string literal —
`category: PaymentCategory.FOOD`, not `category: 'FOOD'`. A TS `enum` is nominally typed, so a
string literal that happens to equal an enum member's value does not structurally satisfy that
enum's type; this is Zod/DTO validation working as intended even inside a test file, and it
surfaces immediately as a compile error rather than a runtime one.

#### Spec file shape and composition order

Every `*.e2e-spec.ts` is a **synchronous** `describe(() => {...})`. Setup splits across two
scopes, and it matters which one each piece goes in: `app`/`makeReq` are expensive (a real Nest
app + STAGE DB connection) and shared by the whole file, so they live in `beforeAll`/`afterAll`.
The `createTestX(...)` instances are cheap and must be **fresh per test** — they're created in
`beforeEach` and cleaned up in `afterEach`, never `beforeAll`/`afterAll`, even when a file has only
one `it()` today:

```typescript
describe('Create Payments', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;
  let accountTest: ReturnType<typeof createTestAccount>;
  let incomeTest: ReturnType<typeof createTestIncome>;
  let paymentTest: ReturnType<typeof createTestPayment>;

  beforeAll(async () => {
    app = await createTestApp();
    makeReq = makeAppReq(app);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    accountTest = createTestAccount(makeReq);
    incomeTest = createTestIncome(makeReq);
    paymentTest = createTestPayment(makeReq);
  });

  afterEach(async () => {
    await paymentTest.after();
    await incomeTest.after();
    await accountTest.after();
  });

  it('Creates a payment that pulls from another owner and records a debt', async () => {
    const userTest = await signinTestUsers(makeReq);
    const users = await userTest.test();

    const [ownerAccount, otherAccount] = await accountTest.test({ users, accounts: [...] });
    await incomeTest.test({ users, incomes: [{ account: otherAccount.data, ... }] });
    await paymentTest.test({
      users,
      debitedAccount: otherAccount.data,
      creditedAccount: ownerAccount.data,
      payment: { ... },
    });
  });
});
```

**`describe` must never be `async`.** `describe('...', async () => { const app = await
createTestApp(); ... })` looks like it should work but doesn't — Jest collects a suite's `it()`
calls synchronously while the callback runs, so anything after the first `await` inside an async
describe body registers too late. This was found the hard way: it fails with `Returning a Promise
from "describe" is not supported. Tests must be defined synchronously.` — but only when Jest can
actually see that error. If a broken async-describe file runs alongside working suites, the
`createTestApp()` call inside it keeps executing after Jest already tore the (empty) suite down,
which throws `TypeError: Dialect is not a constructor` deep inside Sequelize — a red herring that
looks exactly like the known ts-jest/Sequelize module-resolution issue described above but is
actually just fallout from the async-describe bug, not a real module-duplication problem. If that
error ever reappears, check for an async `describe` callback before suspecting Sequelize.

**`afterEach` composition order matters and is never a single merged `Promise.all`**: call each
`.after()` sequentially, leaf entities first — payments/incomes/exchanges/pending-imports before
the accounts they reference, since deleting an account while something still points at it can fail
server-side. Only *within* one logic file's own `after()` is concurrency safe (see above), because
those deletes don't depend on each other.

**Why `beforeEach`/`afterEach`, not `beforeAll`/`afterAll`, for the `createTestX(...)`
instances.** An earlier version put them in `beforeAll` and shared one instance across every
`it()` in the file, with cleanup deferred to a single `afterAll` at the very end. Two problems
came from that, both now moot: first, the `created`-array bug described above; second, since
every `it()`'s accounts were all still alive in STAGE simultaneously (nothing gets deleted until
the whole file finishes), `payment.e2e-spec.ts`'s three `it()` blocks each had to use a different
bank (`RESALAT`, `SEPAH`, `MELY`) just to avoid colliding on `(bank, unit, ownedBy)` uniqueness and
to stop the payment-allocation endpoint from pooling one test's leftover accounts into another
test's payment. With `beforeEach`/`afterEach`, each test's accounts are deleted before the next
test's `beforeEach` even runs, so neither problem can happen — a new `it()` block never needs to
pick a bank the earlier ones haven't used. (The existing three `it()` blocks still use different
banks; that's harmless leftover specificity, not a requirement for new tests.)

**Leftover worktrees under `.claude/worktrees/` used to break `npm run test:e2e` outright** —
`test/jest-e2e.json` had no `testPathIgnorePatterns`, so it picked up any stray `*.e2e-spec.ts`
sitting inside `.claude/worktrees/*/test/` and ran those copies too, alongside the real ones in
`test/`. This wasn't just "debugging noise from inside a worktree" — a plain `npm run test:e2e`
from a completely normal main checkout would fail as long as *any* worktree anywhere under
`.claude/worktrees/` happened to contain its own `test/` copy (e.g. one left behind mid-refactor by
an unrelated session), because a stale worktree's copy can easily have a since-deleted import
(like the old `./logics/request.logic` path from before it moved to `utils/`) that fails to even
compile — `createTestApp()` then throws deep inside Sequelize with `TypeError: Dialect is not a
constructor`, which looks exactly like the known ts-jest/Sequelize module-resolution issue
described above but is unrelated. This was reproduced directly and is now fixed for good:
`test/jest-e2e.json` sets `"testPathIgnorePatterns": ["/node_modules/", "/.claude/"]`, so
worktree-nested tests are never discovered regardless of what other worktrees exist. If this error
ever reappears, first rule out both known causes before suspecting Sequelize itself: an async
`describe` callback (previous entry) or a stray worktree somehow bypassing this ignore pattern.

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

# E2E TEST — see Testing > E2E tests; must be a real STAGE user (plaintext password),
# with E2E_TEST_USER_NAME already having exactly two related users set up in STAGE
E2E_TEST_USER_NAME=...
E2E_TEST_USER_PASSWORD=...
E2E_TEST_OTHER_USER_NAME=...
E2E_TEST_OTHER_USER_PASSWORD=...
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
- **Routing:** `react-router-dom` (authenticated pages only — see Routing &
  Navigation below)
- **Styling:** CSS modules per feature (`auth.css`)

### Routing & Navigation

Auth screens (`Signin`/`Signup`) are **not** routed — `App.jsx` still gates
them with the original `AUTH_STATES` `useState` machine, unchanged. Once
`AUTH_STATES.AUTHENTICATED`, `App.jsx` mounts a `<BrowserRouter>` wrapping a
small local `AuthenticatedShell` (defined inline in `App.jsx`, not its own
file) that renders:

- the temporary logout bar (unchanged, still a stand-in for the real
  header/profile screen),
- `<Routes>` inside `<div className="app-content">` — `/` → `Dashboard`,
  `/payment` → `Payment`, `/income` → `Income`, `/exchange` → `Exchange`,
  `/inbox` → `Inbox`, `/accounts` → `Accounts`, `/debts` → `Debts`, `*` →
  redirect to `/` — there is no `/accounts/:id` route: opening one account is
  a modal (`AccountDetailsModal`) over the list, not a navigation, so it never
  needed its own URL,
- `<BottomNav tabs={NAV_TABS} />` — the persistent tab bar, shown on every
  authenticated page.

**Adding a new page**: add a `<Route>` in `AuthenticatedShell`; a page
existing doesn't automatically mean it belongs in `NAV_TABS` too — `Accounts`
is reached only via a dashboard `ActionButtons` tile, not its own tab (no
Visly mockup screen puts it in a top-level nav). Add a `NAV_TABS` entry (also
in `App.jsx`) — `{ key, label, icon, path }` — only when actually asked for
one; that's the whole integration, `BottomNav`
(`shared/components/BottomNav.jsx`) is generic and needs no changes per tab.
`NAV_TABS` currently has Home, Payment, Income, Exchange and Inbox — `Inbox`
is deliberately reachable both ways (a `NAV_TABS` tab *and* the dashboard's
"Excel Import" `ActionButtons` tile still navigate to the same `/inbox`
route); `Debts` was moved out of `NAV_TABS` into an `ActionButtons` tile
instead (see below) rather than staying a persistent tab. Profile gets added
to `NAV_TABS` the same way once that page exists — don't add placeholder tabs
for pages that don't exist yet.

**Dashboard `ActionButtons` tiles** (`features/dashboard/components/ActionButtons.jsx`):
Pay, Income, Exchange, Excel Import (→ `/inbox`), Accounts (→ `/accounts`),
Debts (→ `/debts`) — a 6th tile, wrapping to 4 + 2 in the `.dashboard-actions`
grid. Same rule as `NAV_TABS`: add a tile only when a page is meant to be
reached this way, not preemptively.

`.app-content`'s bottom padding (`src/App.css`, `--bottom-nav-height` token in
`tokens.css`) is the one place fixed-nav clearance is handled — a page's own
CSS doesn't need to account for the nav bar.

### Tooling — Lint, Format, Commit Hooks

Same setup as the backend, adapted to ESLint's flat-config format (the
frontend was already on ESLint 9; the backend predates flat config and still
uses `.eslintrc.js` — same intent, different-generation config file, don't
"fix" one to look like the other).

- **ESLint** (`eslint.config.js`) — `eslint-plugin-prettier/recommended` is
  last in the `extends` array (it must be: it turns off any earlier rule that
  would fight Prettier, then reports Prettier diffs as `prettier/prettier`
  lint errors). `no-console` is restricted to `warn`/`error`, same as the
  backend's `.eslintrc.js`. `.claude` is in `globalIgnores` alongside `dist`
  — stray content under a gitignored path (e.g. a leftover worktree) must
  never be able to fail `npm run lint`, since that script is also the
  pre-commit hook.
- **Prettier** (`.prettierrc`) — `{ singleQuote: true, trailingComma: 'all' }`,
  byte-for-byte the same config as the backend's `.prettierrc`.
- **Husky + commitlint** — `.husky/pre-commit` runs `npm run lint`,
  `.husky/commit-msg` runs `npx commitlint --edit "$1"` against
  `commitlint.config.js` (`@commitlint/config-conventional` — commit subjects
  must be Conventional Commits, e.g. `feat(dashboard): add unit cards`), same
  as the backend's `commitlint.config.ts` (`.js` here since this project has
  no `ts-node`/`tsx` to load a `.ts` config). Unlike the backend, `husky` is a
  real `devDependency` with a `"prepare": "husky"` script, so hooks are set up
  automatically by `npm install` on a fresh clone rather than needing a
  manual `npx husky` — if the backend's hook setup ever needs to survive a
  fresh clone too, give it the same `prepare` script.

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
├── App.jsx                         Auth gate (signin/signup/authenticated) + react-router-dom
│                                   for authenticated pages (see Routing & Navigation)
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
│   │   ├── Dashboard.jsx           home page content only — no header/back-button (that page
│   │   │                           template is still deferred; the BottomNav itself is app-wide
│   │   │                           chrome mounted once by App.jsx, not per-page)
│   │   ├── index.js
│   │   ├── api/
│   │   │   └── dashboard.api.js    getAccountGroupByUnit(), getAccountWeeklyPaymentIncome() —
│   │   │                           infrastructure only, no calculation/formatting (see logic/)
│   │   ├── logic/
│   │   │   └── dashboard.logic.js  domain logic — mergeGroupAndWeekly (transaction-rendering
│   │   │                           logic that used to live here moved to
│   │   │                           features/transaction/logic/transaction.logic.js once the
│   │   │                           Payment page needed the same rules)
│   │   ├── hooks/
│   │   │   └── useDashboard.js     fetches both statistic endpoints + activity (via
│   │   │                           features/transaction/api/transaction.api.js); owns the
│   │   │                           activity type filter state; delegates calculation to logic/
│   │   ├── components/
│   │   │   ├── UnitCard.jsx        balance + weekly income/payment for one unit
│   │   │   └── ActionButtons.jsx   Pay / Income / Exchange / Excel Import / Accounts / Debts
│   │   │                           tiles — `onPay` navigates to `/payment`, `onIncome` to
│   │   │                           `/income`, `onExchange` to `/exchange`, `onExcelImport` to
│   │   │                           `/inbox`, `onAccounts` to `/accounts`, `onDebts` to `/debts`;
│   │   │                           a 4-column grid (`.dashboard-actions` in dashboard.css) so
│   │   │                           the 6 tiles wrap 4 + 2
│   │   └── styles/
│   │       └── dashboard.css       horizontally-scrollable unit-card row (touch carousel,
│   │                               same pattern as the mockup's "Your Accounts" section)
│   ├── accounts/                   the dashboard's "Accounts" tile lands here — matches the
│   │   │                           Visly "Accounts List"/"Account Details" mockup screens,
│   │   │                           minus the parts that don't match the real data model (see
│   │   │                           below)
│   │   ├── Accounts.jsx            filterable, infinite-scrolling account list + a FAB that
│   │   │                           opens CreateAccountModal; tapping a row opens
│   │   │                           AccountDetailsModal over the list (not a route navigation
│   │   │                           — see hooks/ below for why)
│   │   ├── index.js
│   │   ├── api/
│   │   │   └── accounts.api.js     listAccounts({page, size, bankId, unitId, ownedBy}),
│   │   │                           getAccount(id), createAccount(dto) — distinct from
│   │   │                           shared/api/lookups.api.js's `getAccounts`, which is a
│   │   │                           size-1 "resolve the one account a Bank+Unit+Owner triple
│   │   │                           identifies" lookup for create-transaction forms, not a
│   │   │                           full paginated listing
│   │   ├── logic/
│   │   │   └── accounts.logic.js   getAccountLabel, getAccountOwnerName,
│   │   │                           isCreateAccountFormValid, buildCreateAccountPayload
│   │   ├── hooks/
│   │   │   ├── useAccountsPage.js       owns the Bank/Unit/Owner filters and, via
│   │   │   │                           shared/hooks/usePaginatedList.js, the infinite-scroll
│   │   │   │                           account list (10 at a time — changing any filter calls
│   │   │   │                           `reload()`, resetting back to page 1); also owns the
│   │   │   │                           create-account modal's form/open state and which
│   │   │   │                           account id (if any) the details modal is showing
│   │   │   └── useAccountDetailsPage.js  takes an account id and loads that one account, then
│   │   │                                its scoped activity feed — used from inside
│   │   │                                AccountDetailsModal, not a routed page; deliberately
│   │   │                                has no synchronous `setState` directly in an effect
│   │   │                                body (only inside `.then()`/`.catch()`/`.finally()`),
│   │   │                                since `eslint-plugin-react-hooks`'s
│   │   │                                `set-state-in-effect` rule flags that shape — it does
│   │   │                                NOT flag setState reached only through a function
│   │   │                                reference from another module (e.g.
│   │   │                                `usePaginatedList.js`'s `reload`/`loadMore`), only
│   │   │                                setState calls lexically inline in the effect (or in a
│   │   │                                same-file `useCallback` the effect invokes directly)
│   │   ├── components/
│   │   │   ├── AccountFilters.jsx  Bank/Unit/Owner `Select`s with a real (non-disabled) "All"
│   │   │   │                       option prepended to each options list — the shared Select's
│   │   │   │                       usual `placeholder` prop renders a *disabled* placeholder
│   │   │   │                       option, which is correct for a required create-form field
│   │   │   │                       (forces a real choice) but wrong for an optional filter
│   │   │   │                       (the user could never click back to "All" once they'd
│   │   │   │                       picked something else)
│   │   │   ├── AccountRow.jsx      a `ListRow` (bank+unit label, owner subtitle, priority
│   │   │   │                       badge + balance trailing) — safe to make the whole row
│   │   │   │                       `onClick` since, unlike inbox/'s PendingImportRow, nothing
│   │   │   │                       inside it is itself an interactive element
│   │   │   ├── CreateAccountModal.jsx  bottom-sheet-over-`useDismiss` pattern (see inbox/'s
│   │   │   │                          ConvertModal); Bank/Unit/Owner selects + initial balance
│   │   │   │                          + priority, `POST /account`
│   │   │   └── AccountDetailsModal.jsx  same bottom-sheet pattern; one account's
│   │   │                               Bank/Unit/Owner/Balance/Priority + a RecentActivityList
│   │   │                               scoped to exactly that account (via the `ownedBy`
│   │   │                               filter — see Recent Activity above); no "Owner
│   │   │                               Splits"/percentage-split UI from the mockup, since
│   │   │                               shared ownership in this app is modelled as separate
│   │   │                               sibling accounts (same bank+unit, different `ownedBy`),
│   │   │                               not a percentage split within one account row —
│   │   │                               inventing that UI would misrepresent the real data
│   │   │                               model
│   │   └── styles/
│   │       └── accounts.css        the FAB is positioned via a fixed, full-width,
│   │                               `max-width`-capped `.accounts-fab-wrapper` (exactly
│   │                               `.ui-bottom-nav`'s own centering technique) with
│   │                               `justify-content: flex-end` and `pointer-events: none`,
│   │                               and the button itself gets `pointer-events: auto` — a bare
│   │                               `position: fixed; right: var(--space-6)` on the button
│   │                               anchors to the *viewport* edge, which only matches the
│   │                               phone-width column's edge on an actual phone; on a wide
│   │                               desktop viewport (where `.accounts`'s `max-width` +
│   │                               `margin: 0 auto` centers the column) it drifts away from
│   │                               the visible content entirely
│   ├── payments/
│   │   ├── Payment.jsx             create-payment form + a live-filtered RecentActivityList
│   │   │                           (the same Bank/Unit selects double as the list's filter —
│   │   │                           no separate filter UI; capped at 5 rows)
│   │   ├── index.js
│   │   ├── logic/
│   │   │   └── payment.logic.js    isPaymentFormValid, buildCreatePaymentPayload (composes
│   │   │                           Date+Time into `paidAt`), getSelectedAccountBalance
│   │   ├── hooks/
│   │   │   └── usePaymentPage.js   loads banks/units/relatedUsers once; owns form state; looks
│   │   │                           up the selected account's balance once Bank+Unit+Owner are
│   │   │                           all picked; owns the activity list (refetches on
│   │   │                           bankId/unitId change); handles submit + refetch-after-create
│   │   │                           — `createPayment` and the Bank/Unit/Owner/Account lookups
│   │   │                           come from `shared/api/` (see below), payments/ has no
│   │   │                           `api/` folder of its own anymore
│   │   ├── components/
│   │   │   └── PaymentForm.jsx     Bank/Unit/Owner/Category/Price/Date+Time/Description
│   │   │                           fields, submit button (backend's `isFun`/`isMaman`
│   │   │                           are still required booleans on `CreatePaymentDto` —
│   │   │                           hardcoded `false` in payment.logic.js, no form control)
│   │   └── styles/
│   │       └── payment.css
│   ├── income/                     mirrors payments/ — see CreateIncomeDto (backend) for fields
│   │   ├── Income.jsx              create-income form + a live-filtered RecentActivityList,
│   │   │                           same layout/pattern as Payment.jsx (also capped at 5 rows)
│   │   ├── index.js
│   │   ├── logic/
│   │   │   └── income.logic.js     isIncomeFormValid, buildCreateIncomePayload,
│   │   │                           getSelectedAccount — unlike Payment, `CreateIncomeDto`
│   │   │                           wants `accountId` directly (income always credits exactly
│   │   │                           one account, no allocation-across-accounts logic like
│   │   │                           payment.logic.ts's selectAccountsForPayment), so the form
│   │   │                           still collects Bank/Unit/Owner to resolve which account,
│   │   │                           but the resolved account's `id` is passed into
│   │   │                           buildCreateIncomePayload separately rather than being part
│   │   │                           of the DTO shape itself
│   │   ├── hooks/
│   │   │   └── useIncomePage.js    same shape as usePaymentPage.js, keeps the whole resolved
│   │   │                           account (not just its balance) since accountId is needed
│   │   │                           at submit time; `createIncome` comes from `shared/api/`
│   │   ├── components/
│   │   │   └── IncomeForm.jsx      Bank/Unit/Owner/Category/Amount/Date+Time/Description
│   │   │                           fields, submit button
│   │   └── styles/
│   │       └── income.css
│   ├── exchange/                   mirrors payments/ — see CreateExchangeDto (backend) for fields
│   │   ├── Exchange.jsx            From/To account-transfer form + a live-filtered
│   │   │                           RecentActivityList scoped by the "From" side's Bank/Unit
│   │   │                           (capped at 5 rows)
│   │   ├── index.js
│   │   ├── api/
│   │   │   └── exchange.api.js     createExchange(dto) — kept feature-local (unlike
│   │   │                           createPayment/createIncome) since only Exchange calls it;
│   │   │                           Bank/Unit/Owner/Account lookups still come from
│   │   │                           shared/api/lookups.api.js
│   │   ├── logic/
│   │   │   └── exchange.logic.js   isExchangeFormValid, buildCreateExchangePayload,
│   │   │                           getSelectedAccount — like income.logic.js,
│   │   │                           `CreateExchangeDto` wants `fromAccountId`/`toAccountId`
│   │   │                           directly (resolved separately, no allocation logic) plus
│   │   │                           `toUser` (`form.toUserId`, the book the destination
│   │   │                           account lives in — see the Exchange and Cross-Book
│   │   │                           Lookups sections above)
│   │   ├── hooks/
│   │   │   └── useExchangePage.js  same shape as usePaymentPage.js, but resolves two accounts
│   │   │                           (`fromAccount`/`toAccount`) independently; also re-fetches
│   │   │                           `toBanks`/`toUnits` (via `lookups.api.js`'s `userId` param)
│   │   │                           whenever the "To" book (`form.toUserId`) changes, since a
│   │   │                           related user's book can have different user-defined
│   │   │                           banks/units than the caller's own — `setToUserId` (not
│   │   │                           plain `setField`) clears the now-stale
│   │   │                           toBankId/toUnitId/toOwnerId whenever the book changes
│   │   ├── components/
│   │   │   └── ExchangeForm.jsx    two `Section`s ("From"/"To"), each
│   │   │                           Bank/Unit/Owner/Balance/Amount, plus a "To"-only "Book"
│   │   │                           select (which related user's book) and a shared Date+Time
│   │   └── styles/
│   │       └── exchange.css        `.exchange-form` overrides `.ui-form`'s gap to
│   │                               `--space-7` — more breathing room between the two
│   │                               grouped Sections than a flat field stack needs
│   ├── inbox/                      the dashboard's "Excel Import" tile lands here — matches the
│   │   │                           Visly "Payments Inbox" mockup screen
│   │   ├── Inbox.jsx               a Bank filter, two import trigger buttons
│   │   │                           (`ImportTriggers`), then an infinite-scrolling "Pending
│   │   │                           Imports" list; each row's "Convert" button opens
│   │   │                           ConvertModal
│   │   ├── index.js
│   │   ├── api/
│   │   │   └── inbox.api.js        uploadBankFile(file) (multipart → `/file/upload/bank-payment`),
│   │   │                           importBankExport({bankId, uploadedFile}), importText({bankId,
│   │   │                           text}), getPendingImports({bankId, page, size}),
│   │   │                           deletePendingImport(id)
│   │   ├── logic/
│   │   │   └── inbox.logic.js      isPendingIncome, getSignedPendingAmount,
│   │   │                           getPendingAccountLabel, getPendingOwnerName,
│   │   │                           getPendingSubtitle, buildConvertInitialForm (splits
│   │   │                           `paidAt` into date/time; seeds `ownerId` from the row's
│   │   │                           account owner but it stays user-editable in the modal;
│   │   │                           `description` starts empty — it's a separate,
│   │   │                           user-authored field, not prefilled from the row's own
│   │   │                           parsed `description`, which the modal shows read-only
│   │   │                           alongside it instead, see ConvertModal.jsx below),
│   │   │                           isConvertFormValid, isConvertOwnerChanged,
│   │   │                           buildConvertPayload(row, form, resolvedAccountId) —
│   │   │                           converting isn't a dedicated endpoint (see
│   │   │                           UncompletePayments above): this builds whichever of
│   │   │                           `CreatePaymentDto`/`CreateIncomeDto` the row's `type`
│   │   │                           calls for, with `uncompletePaymentId` set. The owner is
│   │   │                           editable (not fixed to the pending row's account), which
│   │   │                           the two DTOs handle differently: `CreatePaymentDto` takes
│   │   │                           `ownerId` directly (`payment.logic.ts`'s allocation
│   │   │                           already draws from whichever of the caller's own accounts
│   │   │                           matches bankId+unitId+that owner), but `CreateIncomeDto`
│   │   │                           wants a concrete `accountId` — so when the picked owner
│   │   │                           differs from the row's original account owner
│   │   │                           (`isConvertOwnerChanged`), `useInboxPage.js` resolves the
│   │   │                           right account first via `shared/api/lookups.api.js`'s
│   │   │                           `getAccounts({bankId, unitId, ownedBy})` (same lookup
│   │   │                           every create-transaction form already uses) before
│   │   │                           building the payload; unchanged-owner conversions skip
│   │   │                           that extra call and reuse the row's own `accountId`
│   │   ├── hooks/
│   │   │   └── useInboxPage.js     owns the Bank filter (via a wrapped fetch function, same
│   │   │                           `reload()`-on-filter-change shape as
│   │   │                           accounts/hooks/useAccountsPage.js); the upload-modal and
│   │   │                           text-import-modal open/form state; the pending list via
│   │   │                           shared/hooks/usePaginatedList.js (10 at a time); and the
│   │   │                           convert modal's open row/form state — resolves the account
│   │   │                           (see inbox.logic.js above) and dispatches `createIncome`
│   │   │                           or `createPayment` (both from `shared/api/`) based on the
│   │   │                           row's `type`
│   │   ├── components/
│   │   │   ├── InboxFilters.jsx    Bank `Select` with a real "All" option (same reasoning as
│   │   │   │                       accounts/'s AccountFilters.jsx)
│   │   │   ├── ImportTriggers.jsx  two buttons ("Import File" / "Paste SMS Text") that open
│   │   │   │                       UploadFileModal / TextImportModal — replaces an earlier
│   │   │   │                       version where both forms sat always-visible on the page;
│   │   │   │                       same bottom-sheet-on-demand pattern Accounts' FAB uses
│   │   │   ├── UploadFileModal.jsx  Bank select + file input + "Import File", bottom-sheet
│   │   │   ├── TextImportModal.jsx  Bank select + Textarea + "Parse Text", bottom-sheet
│   │   │   ├── PendingImportRow.jsx  a `ListRow` (no `onClick` — it renders as a plain div)
│   │   │   │                         plus a separate action row with "Convert"/discard
│   │   │   │                         buttons; a `ListRow` with `onClick` renders as a
│   │   │   │                         `<button>` via `Pressable`, which can't contain another
│   │   │   │                         button, hence the two are kept as siblings, not nested.
│   │   │   │                         Title is always the Bank·Unit label (not the row's
│   │   │   │                         parsed `description` — a card with a real description
│   │   │   │                         but no visible bank name was confusing); subtitle packs
│   │   │   │                         description (if any) + date·time + owner name into one
│   │   │   │                         line
│   │   │   └── ConvertModal.jsx    bottom-sheet overlay (feature-local — no shared Modal
│   │   │                           primitive exists yet, and only Inbox/Accounts need one so
│   │   │                           far, each with its own tiny variant); dismissed via
│   │   │                           `shared/hooks/useDismiss.js`, same as DateField's popover.
│   │   │                           No mockup boilerplate paragraph (the Visly mockup's
│   │   │                           "Verify and categorize this parsed transaction before
│   │   │                           adding to Kharj" text doesn't correspond to anything real
│   │   │                           to show) — replaced with the row's own parsed
│   │   │                           `description`, shown read-only right under the header
│   │   │                           (`.inbox-modal__description`, own stacked-layout style —
│   │   │                           real parsed descriptions can be long paragraphs, unlike
│   │   │                           the short label+value pairs `.inbox-modal__account` was
│   │   │                           built for). Field order below that otherwise matches every
│   │   │                           other create-transaction form in this app — Owner select
│   │   │                           (editable, pre-filled from the row's account but not
│   │   │                           locked to it) before Category, then Date/Time, then a
│   │   │                           second, *editable* Description `Textarea` bound to
│   │   │                           `form.description` — this is the one `buildConvertPayload`
│   │   │                           actually sends; the read-only one up top is reference
│   │   │                           only, never submitted
│   │   └── styles/
│   │       └── inbox.css
│   ├── debts/
│   └── transaction/                 no page/route of its own — see "Feature folders without a
│       │                            page" below
│       ├── index.js                 barrel: RecentActivityList, getRecentActivity,
│       │                            ACTIVITY_FILTERS
│       ├── api/
│       │   └── transaction.api.js   getRecentActivity({ type, bankId, unitId, page, size })
│       ├── logic/
│       │   └── transaction.logic.js ACTIVITY_FILTERS + transaction-rendering rules (title,
│       │                            subtitle, signed amount, source label)
│       └── components/
│           └── RecentActivityList.jsx  filterable (All/Income/Pay) transaction list —
│                                       consumed by dashboard, payments, income, exchange and
│                                       accounts (via `../../transaction` / `../transaction`
│                                       imports, not `shared/`)
└── shared/
    ├── components/                 Design-system components (see below)
    │   ├── index.js                barrel — import from here, not from files
    │   ├── icons.jsx                inline stroke icons, inherit currentColor
    │   └── BottomNav.jsx           persistent tab bar, generic over a `tabs` prop (see
    │                               Routing & Navigation)
    ├── api/
    │   ├── lookups.api.js          getBanks({ userId }), getUnits({ userId }),
    │   │                           getRelatedUsers(), getAccounts({ bankId, unitId, ownedBy,
    │   │                           userId }) — reference-data lookups shared by every
    │   │                           create-transaction form; promoted out of
    │   │                           payments/api/payment.api.js once income/ needed the exact
    │   │                           same ones. `userId` on all three is optional and only matters for
    │   │                           exchange/'s "To" side — see Cross-Book Lookups above; every
    │   │                           other caller omits it and gets their own book, unchanged
    │   └── create-transaction.api.js  createPayment(dto), createIncome(dto) — promoted out of
    │                               payments/api/ and income/api/ once inbox/'s convert flow
    │                               needed to call both from a third feature; `createExchange`
    │                               stayed feature-local in exchange/api/ since nothing else
    │                               calls it
    ├── constants/
    │   ├── paymentCategories.js    PAYMENT_CATEGORIES — hardcoded, mirrors the backend
    │   │                           PaymentCategory enum (no categories endpoint exists; see
    │   │                           Shared Conventions for keeping these in sync); promoted out
    │   │                           of payments/constants/ once inbox/'s convert modal needed
    │   │                           it too (same graduation rule as create-transaction.api.js)
    │   └── incomeCategories.js     INCOME_CATEGORIES — same story, promoted out of
    │                               income/constants/
    ├── hooks/
    │   ├── useDismiss.js           outside-click + Escape dismissal for popovers
    │   ├── usePaginatedList.js     generic "fetch a page, accumulate rows, load more" state —
    │   │                           `{page,size} => Promise<{rows,paginationData}>` in,
    │   │                           `{rows,total,loading,loadingMore,error,hasMore,reload,
    │   │                           loadMore}` out; `reload()` resets to page 1 (call it from
    │   │                           an effect keyed on whatever filters should restart the
    │   │                           list); `loadMore()` fetches the next page and appends.
    │   │                           First used by accounts/ and inbox/'s pending list at the
    │   │                           same time, so it started in shared/ rather than one
    │   │                           feature's own hooks/
    │   └── useIntersectionLoadMore.js  returns a `ref` for a sentinel element; calls
    │                                   `onLoadMore` via `IntersectionObserver` once the
    │                                   sentinel scrolls near-into view (`rootMargin: '200px'`)
    │                                   and `hasMore && !loading` — pairs with
    │                                   usePaginatedList.js's `loadMore`/`hasMore`/`loadingMore`
    ├── lib/
    │   ├── date.js                 dayjs + Jalali helpers
    │   └── categories.js           categoriesToOptions(categories) — converts the
    │                               `{ camelKey: { key, value } }` shape the payment/income
    │                               categories API returns into the `{ value, label }[]` shape
    │                               `Select` expects
    ├── styles/
    │   ├── tokens.css              design tokens — the single source of truth
    │   └── components.css          all component styles
    └── utils/
        └── index.js                cx, splitFieldProps, toggleInArray
```

### Domain Logic vs Infrastructure (`logic/`)

Mirrors the backend's `logics/` split (`Coding Rules` #4: "any business
calculation or data transformation belongs in a logics/ file, not inline in
the service"). The frontend equivalent: a feature that has domain rules —
merging/deriving data, deciding what a value means, formatting it for
display — gets its own `logic/<feature>.logic.js`, e.g.
`features/dashboard/logic/dashboard.logic.js`.

- **`logic/` files are pure and framework-free.** Data in, data out. No
  `useState`/`useEffect`, no `axios`, no JSX, no DOM. This is what makes them
  trivial to unit test later and to reuse across components.
- **`api/` is infrastructure** — it only knows how to call an endpoint and
  unwrap the `{ success, message, data }` envelope. It must not merge,
  transform, or format the response; that's `logic/`'s job.
- **Hooks (`hooks/`) are infrastructure too** — they orchestrate: call `api/`,
  call `logic/` functions to shape the result, hold React state. Same
  division of responsibility as a NestJS service calling repositories and
  logic functions.
- **Components stay declarative** — a `.jsx` file should read as "given this
  data, render this," not compute business rules inline. If a component has a
  ternary/ helper deciding what a value *means* (not just how to lay it out),
  that's a `logic/` candidate, not a component-local helper.
- **Fixed vocabularies that don't come from the API go in `constants/`**, not
  `logic/` — e.g. `features/auth/constants/authStates.js`. Payment/income
  categories are *not* an example of this anymore (see below) — they're
  fetched from the backend, not hand-maintained.
- **Once a feature's `logic/`/`api/` is genuinely reused by a second feature,
  it graduates out of that feature's own folders** — not before (don't
  pre-promote something only one feature uses). Where it graduates *to*
  depends on what it is: `shared/` is for genuinely generic, domain-agnostic
  code (date/number formatting, the design system) that any feature could
  plausibly need; a reused *domain* concept instead gets its own feature
  folder that other features import from directly, even if it has no page of
  its own — see "Feature folders without a page" below.
  `shared/api/lookups.api.js` (`getBanks`/`getUnits`/`getRelatedUsers`/
  `getAccounts`) is the `shared/`-bound example: it started in
  `payments/api/payment.api.js`, then `income/` needed the exact same
  Bank/Unit/Owner/Account lookups, so it moved up — these lookups aren't a
  domain of their own, they're generic reference-data fetches any
  create-transaction form needs. `features/transaction/` is the other kind:
  `RecentActivityList` started as dashboard-only, then Payment/Income/
  Exchange/Accounts needed the exact same rendering rules and data fetch —
  but "recent activity" is a real domain concept (the payment+income
  transaction feed), not generic UI-kit code, so it graduated into its own
  `features/transaction/` instead of `shared/`, and every consuming feature
  imports it from there.
  `shared/api/create-transaction.api.js` (`createPayment`/`createIncome`) is
  a `shared/`-bound example too: `payments/` and `income/` each held their
  own copy until `inbox/`'s convert modal needed both create calls from a
  third feature, so it moved up — `payments/`/`income/` now have no `api/`
  folder of their own at all, only `logic/`, `hooks/`, `components/` and
  `styles/`. `exchange/api/exchange.api.js`'s `createExchange` deliberately
  did **not** graduate — nothing but `exchange/` calls it, so promoting it
  would be the "pre-promote something only one feature uses" mistake this
  rule warns against. Payment/income categories are **not** a
  constants-graduation example anymore — they were a hand-maintained
  `PAYMENT_CATEGORIES`/`INCOME_CATEGORIES` constants list at one point, but
  are now fetched from `GET /payment/categories`/`GET /income/categories`
  (backed by `src/payment/logics/payment-category.logic.ts` /
  `src/income/logics/income-category.logic.ts` on the backend) and reshaped
  by `shared/lib/categories.js`'s `categoriesToOptions`; there is no
  `shared/constants/` directory.

Not every feature needs a `logic/` folder — `auth/` doesn't have one yet
because its only domain rule (the `username`/`email` fallback in
`useAuth.js`) is a single line; add the folder once there's an actual
calculation or transformation to put in it, same as the backend only adds a
`logics/` file when a module has one.

#### Feature folders without a page

`features/` normally means "a routed page" — every other folder under
`features/` has a top-level `<Name>.jsx` wired to a `<Route>` in `App.jsx`.
`features/transaction/` is the one exception: it has no page, no route, and
no entry in `App.jsx` at all — just `api/`, `logic/`, and `components/`,
exported through its own `index.js` barrel, the same shape any other
feature's non-page folders take.

The distinction that decides whether reused code becomes a page-less feature
folder like this or graduates to `shared/` (see Domain Logic vs
Infrastructure above) is **domain-specific vs. generic**: `shared/` is for
code any feature could plausibly need regardless of what it's about (date
formatting, the design system, generic reference-data lookups). Code that
*is* a real business concept — "the payment+income transaction feed" for
`transaction/`, `RecentActivityList`, `getRecentActivity`,
`ACTIVITY_FILTERS` — stays out of `shared/` even once several features use
it, because dumping domain logic into `shared/` makes `shared/` itself
untrustworthy as "generic, safe to reuse blindly." It gets a `features/`
folder instead, and other features are allowed to import from it directly
(`import { RecentActivityList } from '../transaction'` /
`'../../transaction'` depending on depth) — the usual "features don't import
from other features, only from `shared/`" expectation doesn't apply to this
kind of folder, since it isn't a page and can't create a routing/state
coupling the way importing from another page-owning feature would.

Only create one of these when a second feature actually needs the first
feature's domain code — same promotion trigger as any other graduation, just
a different destination. Don't invent an empty `features/<domain>/` folder
speculatively.

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
   action; everything else is `secondary`, `ghost`, or `link`. `IconButton` has the
   same three variants (default `ghost`, plus `secondary` and `primary`) — the
   Accounts list's FAB (`accounts-fab`, `IconButton variant="primary"`) is the first
   `primary` `IconButton` use; the same one-per-screen restraint applies to it too.
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
npm run lint      # eslint --fix (includes the prettier/prettier rule)
npm run format    # prettier --write, for files eslint doesn't cover (e.g. CSS)
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
- Payment/income categories are **not** hand-mirrored on the frontend anymore.
  `GET /payment/categories` / `GET /income/categories` serve them from
  `src/payment/logics/payment-category.logic.ts` /
  `src/income/logics/income-category.logic.ts` — each a hardcoded
  `Record<string, { key: PaymentCategory | IncomeCategory, value: string }>`
  keyed by a camelCase name (e.g. `gymFood: { key: PaymentCategory.GYM_FOOD,
  value: 'gym food' }`). Adding a category still means editing backend code
  by hand (add the enum member *and* an entry in the logic file's returned
  object), but the frontend picks it up automatically the next time it
  fetches the list — no matching frontend file to remember to update.
