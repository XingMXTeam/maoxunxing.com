---
name: content-desensitization
description: Redact sensitive information from blog posts, documents, and code before publishing. Use when the user mentions "脱敏", "desensitize", "redact", "remove sensitive", "sanitize for publishing", or when preparing content for public sharing.
---

# Content Desensitization

Redact sensitive information before publishing content publicly.

## When to Use

- Preparing blog posts for public publishing
- Sanitizing code examples for sharing
- Removing internal system names from documentation
- Redacting PII from technical articles

## Core Principles

1. **Identify context** - Determine what's sensitive based on the content type and target audience
2. **Preserve meaning** - Replace with generic terms that maintain technical accuracy
3. **Be consistent** - Apply the same replacement across all language versions
4. **Show changes** - Always present a diff before applying changes

## Common Sensitive Patterns

### System & Infrastructure

| Pattern Type | Examples | Replace With |
|--------------|----------|--------------|
| Internal platform names | Custom internal platform names | "the platform" / "our platform" |
| RPC frameworks | Company-specific RPC names | "RPC" / "remote service" |
| Message queues | Internal MQ product names | "message queue" |
| Service names | Internal service identifiers | Generic service names |
| Configuration keys | Internal config namespaces | Generic config keys |

### Identifiers & Names

| Pattern Type | Examples | Replace With |
|--------------|----------|--------------|
| Topic/Queue names | Internal naming conventions | GENERIC_TOPIC / TASK_NAME |
| Consumer groups | CID_INTERNAL_NAME | CID_GENERIC_NAME |
| Package paths | com.company.internal.* | com.example.* |
| Class decorators | @InternalFramework | @GenericDecorator |
| Interface names | IInternalFramework | IGenericInterface |

### Network & Endpoints

| Pattern Type | Examples | Replace With |
|--------------|----------|--------------|
| Internal domains | internal.company.com | internal.example.com |
| API endpoints | /api/internal/* | /api/generic/* |
| IP addresses | Real internal IPs | 192.168.x.x / 10.x.x.x |
| Ports | Non-standard ports | Standard ports or generic |

### Personal Information (PII)

| Pattern Type | Replace With |
|--------------|--------------|
| Real person names | "a colleague" / "a team member" / "John Doe" |
| Email addresses | user@example.com / name@domain.com |
| Phone numbers | xxx-xxxx-xxxx (generic format) |
| Employee IDs | EMP001 / generic identifier |

### Company & Team Information

| Pattern Type | Replace With |
|--------------|--------------|
| Company names | "the company" / "our organization" |
| Team names | "the team" / "our team" |
| Department names | "the department" / "relevant team" |
| Product names (internal) | Generic product names |

## Workflow

1. **Scan content** for sensitive patterns matching categories above
2. **Ask user** if any domain-specific terms need special handling
3. **Create replacement map** showing original → replacement
4. **Present diff** to user for review
5. **Apply changes** to all language versions consistently
6. **Final check** - verify no sensitive patterns remain

## Output Format

When desensitizing, present changes in a table:

```markdown
| Original | Replaced With | Category |
|----------|---------------|----------|
| InternalPlatform | the platform | System |
| @InternalMQ | @MessageQueue | Framework |
| com.company.service | com.example.service | Package |
```

## Checklist

Before publishing, verify:
- [ ] No internal system/framework names
- [ ] No internal topic/service identifiers
- [ ] No real person names or emails
- [ ] No internal domain names or endpoints
- [ ] Company-specific terms replaced
- [ ] All language versions updated consistently
- [ ] Technical accuracy preserved
