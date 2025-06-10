## 1. 📋 General Concept

Creating a Corezoid process with implemented business logic:

The user must describe the business logic, specify the input parameters and what is expected as output.

The user must specify the following parameters:
- API_URL
- API_LOGIN
- API_SECRET
- WORKSPACE_ID
- ROOT_FOLDER_ID
- PROC_ID

All these parameters must be passed when calling the convctl.sh command.

---

## 2. Exporting and Analyzing the Existing Project

Before starting work, you need to export all existing project processes:

```bash
# Export processes by folder id
API_URL=<API_URL> API_LOGIN=<API_LOGIN> API_SECRET=<API_SECRET> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh fetch-folder <ROOT_FOLDER_ID> ~/repos/corezoid-doc/.processes
```
where ~/repos/corezoid-doc/.processes is the folder where all exported JSON processes of the project will be saved.

---

Then you need to analyze all exported processes in the ~/repos/corezoid-doc/.processes folder and select those that need to be used to build the logic.

## 3. 🧱 Approximate Structure of JSON Process

### 3.1 Root Object:

```json
{
  "obj_type": 1,
  "obj_id": null,
  "parent_id": null,
  "title": "Process Name",
  "description": "",
  "status": "active",
  "params": [],
  "ref_mask": true,
  "conv_type": "process",
  "scheme": {
    "nodes": [...],
    "web_settings": [[], []]
  }
}
```

👉 params - all incoming parameters that the user must pass when calling the process. More details: [process-with-parameters.md](./src/process/process-with-parameters.md)

### 3.2 🧩 Process Nodes Details

The process must contain:

1. **Start** — beginning of the process.
2. **Code Node** — setting/transforming necessary parameters (if data preparation is required).
3. **Call a Process Node** — one or more calls to other Corezoid processes that perform specific logic. Between calls, there can be any number of Code Nodes for data transformation.
4. **Reply to Process (Success)** — return a successful response.
5. **Reply to Process (Error)** — return an error in case of failure:
- Error in `Code Node`.
- Error in `API Call`.
6. **Error** — final node for errors (Each node should have its own Error node).
7. **Final** — final node for successful completion.

#### 3.2.1 Start Node

- `obj_type: 1`
- Transition (`go`) to the Code Node.

---

#### 3.2.2. Code Node (To set/transform input parameters for API Call)

- `obj_type: 0`
- Executes `api_code`.
- On error — transition to the **Reply Error from Code Node**.
- On success — transition to the **API Call**.

```json
{
  "type": "api_code",
  "lang": "js",
  "src": "data.result = 10;",
  "err_node_id": "reply-error-from-api-code"
}
```

---

#### 3.2.3. Call a Process Node

- `obj_type: 0`
- API call type: `type: "api_rpc"` (mandatory).
- The call structure must be fully configured:

```json
{
  "type": "api_rpc",
  "conv_id": 9876543,
  "err_node_id": "error_node",
  "extra": {
    "param1": "value1",
    "param2": 2
  },
  "extra_type": {
    "param1": "string",
    "param2": "number"
  },
  "group": "all",
  "user_id": 56171
}
```

---

#### 3.2.4. Reply to Process (Success)

- `obj_type: 0`
- Type: `api_rpc_reply`
- Response:

```json
{
  "type": "api_rpc_reply",
  "mode": "key_value",
  "res_data": {
    "response": "{{body}}"
  },
  "res_data_type": {
    "response": "object"
  },
  "throw_exception": false
}
```
- After a successful response — transition to the Final node.

---

#### 3.2.5. Reply to Process (Errors)

Two separate nodes:

#### For errors in Code Node

```json
{
  "type": "api_rpc_reply",
  "mode": "key_value",
  "res_data": {
    "error": "Code Node error"
  },
  "res_data_type": {
    "error": "string"
  },
  "throw_exception": true
}
```

#### For errors in API Call

```json
{
  "type": "api_rpc_reply",
  "mode": "key_value",
  "res_data": {
    "error": "API call error"
  },
  "res_data_type": {
    "error": "string"
  },
  "throw_exception": true
}
```

- Both nodes then transition to the Error node.

---

#### 3.2.6. Error Node

- `obj_type: 2`
- Typical terminator for errors without logic.

---

#### 3.2.7. Final Node

- `obj_type: 2`
- Final successful completion of the process.
- Parameter `options: {"save_task": true}`.

---

## 4. 🧱 Examples of JSON Process Structures
- [create-actors.json](../samples/create-actors.json)
- [gpt-calculator.json](../samples/gpt-calculator.json)

## 5. ⚡ Important Details

| Element | Requirement |
|:--------|:------------|
| Connections between nodes | Only through `go` |
| Mandatory error handling | Through `reply-error-from-api-code` and `reply-error-from-api-call` |
| Mandatory API call format | With fields `rfc_format`, `customize_response`, `version: 2` |
| Responses | Through `api_rpc_reply`, even for errors |

---

## 6. 📚 Documentation Links

- **Corezoid Node Types**:
  - [start-node.md](./src/nodes/start-node.md)
  - [code-node.md](./src/nodes/code-node.md)
  - [code-node-libraries.md](./src/nodes/code-node-libraries.md)
  - [call-process-node.md](./src/nodes/call-process-node.md)
  - [reply-to-process-node.md](./src/nodes/reply-to-process-node.md)
  - [end-node.md](../src/nodes/end-node.md)

- **Process Construction Rules**:
  - [process-development-guide.md](./src/process/process-development-guide.md)
  - [process-json-validation.md](./src/process/process-json-validation.md)
  - [error-handling.md](./src/process/error-handling.md)

- **Best Practices**:
  - [node-positioning-best-practices.md](./src/process/node-positioning-best-practices.md)

## 7. 🧪 Instructions: Mandatory Verification of the Result (created JSON process)

### 7.1 💾 Saving the Result

Save the process file to the following directory:

```bash
~/repos/corezoid-doc/.processes/
```

For example: `~/repos/corezoid-doc/.processes/my_api_process.json`.

---

### 7.2 🔍 Process Verification

Go to the directory with the validation script and execute the command:

```bash
API_URL=<API_URL> API_LOGIN=<API_LOGIN> API_SECRET=<API_SECRET> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh run-process <PROC_ID> ~/repos/corezoid-doc/.processes/my_api_process.json <task_data>
```

Where:

- `<task_data>` — json containing all incoming parameters.

#### Example:

```bash
API_URL=https://admin.corezoid.com API_LOGIN=123 API_SECRET=123 WORKSPACE_ID=123 ./convctl.sh run-process 123 ~/repos/corezoid-doc/.processes/my_api_process.json '{"key1":"val1"}'
```

The verification must pass successfully.