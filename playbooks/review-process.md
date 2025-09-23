# 🧩 Corezoid Process Review Playbook

## 🔄 General Algorithm

**Step 1. Load the process**

* Accept the Corezoid process JSON.
* Iterate through all nodes (`nodes`).

**Step 2. Structure analysis**

* Identify all nodes without a title.
* Collect all nodes of type `code`, `api`, `git call`.
* Detect nodes with `semaphors` (loops/timers).
* Gather all error-handling nodes.

**Step 3. Hardcode check**

* In `code` nodes → look for hardcoded values: IDs, URLs, keys.
* In `api` nodes → check URLs (should use `env_var` instead of hardcode).
* In `git call` → check if branch/tag is hardcoded.

**Step 4. Repeated logic**

* Compare nodes like `CREATE ACTOR`, `MANAGE ACCESS RULES`, etc.
* If the structure is identical → mark as duplicated logic.

**Step 5. Cycle verification**

* Detect nodes with `semaphors` type `time` or `go_if_const` that create loops.
* Check if there are exit conditions or iteration limits.

**Step 6. Node naming**

* Identify nodes with empty titles.
* Review naming quality: duplicates, vague names (`error manage access rules`).
* Recommend naming format: `Action_Object_Context` (e.g. `Create_Stream_Active`).

**Step 7. Code analysis in nodes**

### 🔹 JavaScript nodes

Check:

* Presence of `try/catch` for error handling.
* No hardcoded values (IDs, tokens, URLs).
* Safe type conversions (`parseInt`, `Number`).
* Proper formatting (camelCase, clear variable names).
* Input validation (`if (!data.var) { ... }`).
* Avoid usage of `eval`.

### 🔹 Erlang nodes

Check:

* Pattern matching: ensure all possible cases are handled.
* Use of `catch` or `case` for invalid data.
* No recursion without termination conditions.
* Error logging exists.
* Avoid unnecessary anonymous functions.

**Step 8. Error handling review**

* Every error node should have a meaningful `errorText`.
* Detect duplicated error nodes (e.g., multiple `"error manage access rules"`).
* Recommend centralizing error handling if possible.

**Step 9. Report generation**
Report format in Markdown:

```
Process: <process name>

1. Hardcode
- [ ] Node X: API key is hardcoded → move to env_var.

2. Repeated logic
- [ ] Nodes Y, Z: same structure → extract into subprocess.

3. Cycles
- [ ] Node W: no exit condition → add iteration limit.

4. Naming
- [ ] Node without name → rename to "Validate Token".
- [ ] Nodes named "error manage access rules" → make unique.

5. Code review
- [ ] JS: Node Code_123 has no try/catch → add error handling.
- [ ] Erlang: Node Code_456 recursion without condition → add termination check.
```
