# Creating a Corezoid Connector

## 1. 📋 General Concept

Creating a Corezoid connector to an API requires a standardized process structure so that Devin AI can:

- Understand the request type,
- Process errors correctly,
- Universally receive responses from any external API.
  The user must specify the following parameters:
  - API_URL
  - API_TOKEN
  - WORKSPACE_ID
  - PROC_ID

  All these parameters must be passed when calling the convctl.sh command.

The user must also specify which incoming parameters should be in the request.
If the parameters are insufficient to call the API, it is necessary to clarify them with the user.

Each process is built as a universal pattern into which a specific URL and call parameters are inserted.

---

## 2. 📂 Process Structure

The process must contain:

1. **Start** — the beginning of the process.
2. **Code Node** — setting/transforming necessary parameters (if data preparation is required).
3. **API Call** — calling an external API.
4. **Reply to Process (Success)** — returning a successful response.
5. **Reply to Process (Error)** — returning an error in case of failure:
- Error in `Code Node`.
- Error in `API Call`.
6. **Error** — final node for errors (Each node should have its own Error node).
7. **Final** — final node for successful completion.

---

## 3. 🧱 Sample JSON Process Structure

### 4.1 Root Object:

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

👉 params - all incoming parameters that the user should pass when calling the process. More details: [process-with-parameters.md](./src/process/process-with-parameters.md)

### 4.2 🧩 Process Node Details (nodes)

#### 4.2.1 Start Node

- `obj_type: 1`
- Transition (`go`) to the Code Node.

---

#### 4.2.2 Code Node (To set/transform input parameters for API Call)

- `obj_type: 0`
- Executes `api_code`.
- On error — transition to the **Reply Error from Code Node** node.
- On success — transition to the **API Call** node.

```json
{
  "id": "<id>",
  "obj_type": 0,
  "condition": {
    "logics": [
      {
        "type": "api_code",
        "lang": "js",
        "src": "data.result = 10;",
        "err_node_id": "<error_node_id>"
      },
      {
        "type": "go",
        "to_node_id": "<next_node_id>"
      }
    ],
    "semaphors": []
  },
  "title": "Prepare Data",
  "description": "",
  "x": 984,
  "y": 216,
  "extra": "{\"modeForm\":\"expand\",\"icon\":\"\"}",
  "options": null
}
```

---

#### 4.2.3 API Call Node

- `obj_type: 0`
- API call type: `type: "api"` (mandatory).
- The call structure must be fully configured:

```json
{
  "condition": {
    "logics": [
      {
        "type": "api",
        "rfc_format": true,
        "format": "raw", // raw is used when the request body (raw_body field) is used,
        "content_type": "application/json",
        "method": "GET",
        "url": "https://example.com/your-api-endpoint",
        "extra_headers": {
          "content-type": "application/json; charset=utf-8"
        },
        "raw_body":"{{request_body}}", // body for the request, can include dynamic references like {{body}}   (For POST/PUT methods)
        "cert_pem": "",
        "max_threads": 5,
        "send_sys": false,
        "debug_info": false,
        "err_node_id": "<err_node_id>",
        "customize_response": true,
        "response": {
          "header": "{{header}}",
          "body": "{{body}}"
        },
        "response_type": {
          "header": "object",
          "body": "object"
        },
        "version": 2,
        "is_migrate": true
      },
      {
        "to_node_id": "<next_node_id>",
        "type": "go"
      }
    ],
    "semaphors": []
  },
  "description": "",
  "extra": "{\"icon\":\"\",\"modeForm\":\"expand\"}",
  "id": "<id>",
  "obj_type": 0,
  "options": "{}",
  "title": "API Call",
  "x": 300,
  "y": 100
}

```

**IMPORTANT**:
- The `url` parameter is always dynamically inserted in each new process for each new API.
- The response body processing must always be configured through `body`.

---

#### 4.2.4 Reply to Process (Success)

- `obj_type: 0`
- Type: `api_rpc_reply`
- Response:

```json
 {
  "id": "<id>",
  "obj_type": 3,
  "condition": {
    "logics": [
      {
        "type": "api_rpc_reply",
        "mode": "key_value",
        "res_data": {
          "responce": "{{body}}"
        },
        "res_data_type": {
          "responce": "object"
        },
        "throw_exception": false
      },
      {
        "type": "go",
        "to_node_id": "<next_node_id>" // to final node
      }
    ],
    "semaphors": []
  },
  "title": "Success Reply",
  "description": "",
  "x": 1288,
  "y": 1066,
  "extra": "{\"modeForm\":\"collapse\",\"icon\":\"\"}",
  "options": null
}
```
- After successful response — transition to the Final node.

---

#### 4.2.5 Reply to Process (Errors)

Two separate nodes:

#### For errors in Code Node

```json
{
  "id": "<id>",
  "obj_type": 3,
  "condition": {
    "logics": [
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
      },
      {
        "type": "go",
        "to_node_id": "<next_node_id>" // to final error node
      }
    ],
    "semaphors": []
  },
  "title": "Reply Error - Code Node",
  "description": "",
  "x": 1288,
  "y": 1066,
  "extra": "{\"modeForm\":\"collapse\",\"icon\":\"\"}",
  "options": null
}
```

#### For errors in API Call

```json
{
  "id": "<id>",
  "obj_type": 3,
  "condition": {
    "logics": [
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
      },
      {
        "type": "go",
        "to_node_id": "<next_node_id>" // to final error node
      }
    ],
    "semaphors": []
  },
  "title": "Reply Error - API Call",
  "description": "",
  "x": 1288,
  "y": 1066,
  "extra": "{\"modeForm\":\"collapse\",\"icon\":\"\"}",
  "options": null
}
```

- Both nodes then transition to the Error node.

---

#### 4.2.6 Error Node

- `obj_type: 2`
- Typical terminator for errors without logic.

---

#### 4.2.7 Final Node

- `obj_type: 2`
- Final successful completion of the process.
- Parameter `options: {"save_task": true}`.

---

## 5. ⚡ Important Details

| Element | Requirement |
|:--------|:------------|
| Connections between nodes | Only through `go` |
| Mandatory error handling | Through `reply-error-from-api-code` and `reply-error-from-api-call` |
| Mandatory API call format | With fields `rfc_format`, `customize_response`, `version: 2` |
| Responses | Through `api_rpc_reply`, even for errors |

---

## 6. 🧱 Examples of JSON Process Structures
- [api-post.json](./samples/api-post.json)

## 7. 📚 Documentation Links

- **Corezoid Node Types**:
  - [start-node.md](./src/nodes/start-node.md)
  - [code-node.md](./src/nodes/code-node.md)
  - [code-node-libraries.md](./src/nodes/code-node-libraries.md)
  - [api-call-node.md](./src/nodes/api-call-node.md)
  - [reply-to-process-node.md](./src/nodes/reply-to-process-node.md)
  - [end-node.md](./src/nodes/end-node.md)

- **Process Construction Rules**:
  - [process-development-guide.md](./src/process/process-development-guide.md)
  - [process-json-validation.md](./src/process/process-json-validation.md)
  - [error-handling.md](./src/process/error-handling.md)

- **Best Practices**:
  - [node-positioning-best-practices.md](./src/process/node-positioning-best-practices.md?ref_type=heads)
  - [common-validation-errors.md](./src/process/common-validation-errors.md)

## 8. 🧪 Instructions: Mandatory Verification of Results (created JSON process)

After generating the process in JSON format:

### 8.1 💾 Saving the Result

Save the process file to the following directory:

```bash
~/repos/corezoid-ai-doc/.processes/
```

For example: `~/repos/corezoid-ai-doc/.processes/my_api_process.json`.

---

### 8.2 🔍 Process Verification

Go to the directory with the validation script and execute the command:

```bash
API_URL=<API_URL> API_TOKEN=<API_TOKEN> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh run-process <PROC_ID> ~/repos/corezoid-ai-doc/.processes/my_api_process.json <task_data>
```

Where:

- `<task_data>` — json containing all incoming parameters.

#### Example:

```bash
API_URL=https://admin.corezoid.com API_TOKEN=123 WORKSPACE_ID=123 ./convctl.sh run-process 123 ~/repos/corezoid-ai-doc/.processes/my_api_process.json '{"key1":"val1"}'
```

The verification must pass successfully.

### 8.3 📝 convctl.sh Errors

Some errors and their solutions are provided in the document [error_explanations.md](./docs/error_explanations.md)...