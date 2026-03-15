name: Bug Report
description: Report a bug in OmniVoice AI
title: "[BUG] "
labels: ["bug"]

body:
  - type: textarea
    attributes:
      label: Bug Description
      description: Describe what happened
    validations:
      required: true

  - type: textarea
    attributes:
      label: Expected Behavior
      description: What should happen instead

  - type: textarea
    attributes:
      label: Steps to Reproduce
      description: Step-by-step instructions

  - type: textarea
    attributes:
      label: Logs / Error Messages

  - type: dropdown
    attributes:
      label: Component
      options:
        - Voice Agent
        - API
        - Telephony Integration
        - CI/CD
        - Documentation
