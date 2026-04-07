# ROADMAP: 用户登录与管理系统

**Version:** v1.1
**Granularity:** Coarse
**Total Phases:** 4 (cumulative)

---

## Phases

- [x] **Phase 1: 认证核心** - 用户登录、JWT令牌、密码加密、限流 (completed 2026-04-06)
- [x] **Phase 2: SMS基础设施** - 阿里云SMS SDK集成、Redis验证码存储配置 (completed 2026-04-07)
- [x] **Phase 3: SMS核心功能** - 发送验证码、登录、注册API (completed 2026-04-07)
- [ ] **Phase 4: SMS安全加固** - 60秒限流、失败锁定、审计日志 (pending)

---

## Phase Details

### Phase 2: SMS基础设施

**Goal:** 搭建SMS短信认证的技术基础

**Depends on:** Phase 1

**Requirements:** SMS-01, SMS-03, SMS-06

**Success Criteria** (what must be TRUE):
1. 阿里云SMS SDK (@alicloud/sms-sdk) 已安装并可导入使用
2. 验证码以6位随机数字生成，存储在Redis，TTL 5分钟
3. User模型增加phone字段（唯一索引），支持新用户注册
4. 短信发送日志不包含实际验证码内容（防泄露）
5. 发送响应不暴露手机号是否已注册（防用户探测）

**Plans:** 2/2 plans complete

Plans:
- [x] 02-01-PLAN.md — 依赖安装与Redis客户端
- [x] 02-02-PLAN.md — 数据库Schema扩展与SMS基础设施

---

### Phase 3: SMS核心功能

**Goal:** 实现完整的短信验证码登录与注册流程

**Depends on:** Phase 2

**Requirements:** SMS-02, SMS-04, SMS-05, SMS-08

**Success Criteria** (what must be TRUE):
1. POST /auth/sms/send 接口接受手机号并发送验证码
2. POST /auth/sms/verify 接口校验验证码并标记已使用
3. POST /auth/sms/login 接口验证码正确后发放JWT
4. POST /auth/sms/register 接口手机号+验证码注册新用户并发放JWT
5. SDK提供统一的注册与登录接口供客户端调用
6. 验证码验证成功后立即从Redis删除（单次使用）

**Plans:** 1/1 plans complete

Plans:
- [x] 03-01-PLAN.md — 短信验证码登录与注册API (completed 2026-04-07)

---

### Phase 4: SMS安全加固

**Goal:** 防止SMS轰炸攻击和验证码暴力破解

**Depends on:** Phase 3

**Requirements:** SMS-07

**Success Criteria** (what must be TRUE):
1. 同一手机号60秒内不能重复发送验证码
2. 连续5次验证失败锁定该手机号15分钟
3. 短信发送行为记录到审计日志（发送时间、手机号前3位+后1位、操作结果）
4. 系统提供短信发送统计接口（当天发送次数）

**Plans:** 1/1 plan

Plans:
- [ ] 04-01-PLAN.md — SMS安全加固 (60秒限制、失败锁定、审计日志、统计接口)

---

## Progress Table

| Phase | Plans | Status | Completed |
|-------|-------|--------|-----------|
| 1. 认证核心 | 3/3 | Complete | 2026-04-06 |
| 2. SMS基础设施 | 2/2 | Complete   | 2026-04-07 |
| 3. SMS核心功能 | 1/1 | Complete   | 2026-04-07 |
| 4. SMS安全加固 | 0/1 | Not started | — |

---

*Generated: 2026-04-07*
*Last updated: 2026-04-07 (Phase 04-01 plan created: SMS security hardening)