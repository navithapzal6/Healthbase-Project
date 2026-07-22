# Core reusable functionality

`core` contains application-independent functionality. UI and hospital-specific business logic must not be added here.

## validation

Common rules and the schema runner used by every form.

- Put reusable rules in `core/validation`.
- Put field combinations and feature messages beside the feature in a `validation.ts` file.
- Backend field errors can be converted with `mapServerValidationErrors`.

## forms

Small form-state helpers shared by form components.

## logger

Use `logger.child("feature-name")` at service/workspace boundaries.

Log API operations, successful mutations, warnings and caught errors. Do not log passwords, tokens, full form payloads or render events. Sensitive metadata keys are automatically redacted.
