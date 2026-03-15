# Security Policy

## Supported Versions

| Version | Supported |
|--------|-----------|
| 0.x | Yes |

## Reporting a Vulnerability

If you discover a security vulnerability in OmniVoice AI:

1. Do NOT open a public issue
2. Email security details to the maintainers
3. Include reproduction steps and impact

We aim to respond within **72 hours**.

## Security Guidelines

Developers must ensure:

- No secrets committed to repository
- API keys stored in environment variables
- Customer data protected
- Logs must not contain PII

## Dependencies

All dependencies should be regularly audited using:

npm audit
pip-audit
