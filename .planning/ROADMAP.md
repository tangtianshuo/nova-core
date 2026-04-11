# Roadmap: v1.2 统一日志系统

## Overview

**Milestone:** v1.2
**Goal:** 为认证系统搭建统一的日志系统，支持结构化日志、分类输出（访问/错误/审计）、日志轮转，方便问题排查和审计。
**Started:** 2026-04-11
**Previous milestone:** v1.1 (Phase 4)

---

## Phases

- [x] **Phase 5: Logger Foundation** - 统一日志门面 + 结构化JSON日志基础设施 (completed 2026-04-11)
- [x] **Phase 6: Access & Error Logging + Rotation** - HTTP访问日志、错误日志、日志轮转 (completed 2026-04-11)
- [ ] **Phase 7: Audit & Security Hardening** - 审计日志、敏感字段过滤、ELK兼容

---

## Phase Details

### Phase 5: Logger Foundation

**Goal:** 建立统一日志门面和结构化JSON日志基础设施，所有业务代码通过门面记录日志

**Depends on:** Phase 4 (v1.1完成)
**Requirements:** LOG-01, LOG-02, LOG-03, LOG-04, LOG-13
**Status:** COMPLETE
**Success Criteria** (what must be TRUE):
1. JSON格式日志输出包含 timestamp, level, message, service 四个字段
2. 环境变量 LOG_LEVEL 能控制日志级别（info/warn/error/debug生效）
3. 每个HTTP请求生成唯一 requestId，贯穿该请求所有日志条目
4. error级别日志自动包含 stack trace 便于问题排查
5. 业务代码只导入 src/lib/logger.ts，不直接依赖 pino/winston 等日志库
**Plans:** 1/1 plans complete
**Plan list:**
- [x] 05-01-PLAN.md — Logger facade + request ID middleware + app integration (COMPLETE)

---

### Phase 6: Access & Error Logging + Rotation

**Goal:** 实现HTTP访问日志、错误日志捕获和日志文件轮转

**Depends on:** Phase 5
**Requirements:** LOG-05, LOG-06, LOG-08, LOG-09
**Status:** COMPLETE
**Success Criteria** (what must be TRUE):
1. 每次HTTP请求记录 access.log，包含 method/url/status/responseTime
2. 系统错误和未捕获异常写入 error.log，与access.log分离
3. 日志文件写入 logs/ 目录，目录不存在时自动创建
4. 支持按日期分文件（每天一个日志文件）
5. 支持按大小轮转（100MB/文件），超出后生成新文件
**Plans:** 2/2 plans complete
**Plan list:**
- [x] 06-01-PLAN.md — Log streams configuration + pino-http access log middleware + app integration
- [x] 06-02-PLAN.md — Error middleware enhancement + global error handlers + app integration

---

### Phase 7: Audit & Security Hardening

**Goal:** 实现审计日志持久化和安全增强（敏感字段过滤、ELK兼容）

**Depends on:** Phase 5
**Requirements:** LOG-07, LOG-10, LOG-11, LOG-12, LOG-14
**Status:** READY TO EXECUTE
**Plans:** 1/2 plans executed
**Plan list:**
- [x] 07-01-PLAN.md — ECS format + redact config + audit logger instance (Wave 1)
- [ ] 07-02-PLAN.md — Auth/SMS controller integration + compression wrapper (Wave 2)
**Success Criteria** (what must be TRUE):
1. 审计日志记录登录成功/失败、登出、短信发送/验证事件到 audit.log
2. 访问日志、错误日志、审计日志通过不同stream写入不同文件
3. 轮转后的日志文件自动压缩为 .gz 格式
4. 日志输出时自动过滤 password, token, code, refreshToken, secret 等敏感字段
5. 日志格式包含 ELK/Splunk 兼容的标准字段（@timestamp, level, message等）

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 5. Logger Foundation | 1/1 | Complete    | 2026-04-11 |
| 6. Access & Error Logging + Rotation | 2/2 | Complete   | 2026-04-11 |
| 7. Audit & Security Hardening | 1/2 | In Progress|  |

---

## Coverage Map

| Requirement | Phase | Status |
|-------------|-------|--------|
| LOG-01 | Phase 5 | Complete |
| LOG-02 | Phase 5 | Complete |
| LOG-03 | Phase 5 | Complete |
| LOG-04 | Phase 5 | Complete |
| LOG-05 | Phase 6 | Complete |
| LOG-06 | Phase 6 | Complete |
| LOG-07 | Phase 7 | Pending (Plan 02) |
| LOG-08 | Phase 6 | Complete |
| LOG-09 | Phase 6 | Complete |
| LOG-10 | Phase 7 | Pending (Plan 02) |
| LOG-11 | Phase 7 | Pending (Plan 01) |
| LOG-12 | Phase 7 | Pending (Plan 01) |
| LOG-13 | Phase 5 | Complete |
| LOG-14 | Phase 7 | Pending (Plan 01) |

**Mapped:** 14/14 requirements
**Completed:** 9/14 requirements (LOG-01, LOG-02, LOG-03, LOG-04, LOG-05, LOG-06, LOG-08, LOG-09, LOG-13)
**Phase 7 coverage:** LOG-07, LOG-10, LOG-11, LOG-12, LOG-14 (5 requirements)

---

## Dependencies

```
Phase 5 (Foundation)
    │
    ├── Phase 6 (Access/Error + Rotation) [depends on Phase 5]
    │
    └── Phase 7 (Audit + Security) [depends on Phase 5]
```

---

*Roadmap updated: 2026-04-11*
