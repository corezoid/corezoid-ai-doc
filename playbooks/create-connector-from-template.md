# Creating a Corezoid Connector from Template

## 1. General Concept

This playbook describes creating a Corezoid connector using the existing template `templates/connector.json`. The template provides a pre-built process structure that only requires modification of two specific nodes: "Prepare Request" and "API Call".

The user must specify the following parameters:
- API_URL
- API_TOKEN
- WORKSPACE_ID
- PROC_ID
- PROCESS_METRIC_ID
- PROJECT_ID 
- ROOT_FOLDER_ID

All these parameters must be passed when calling the convctl.sh command.

---

## 2. =� Template Structure

The template `templates/api-connector.json` contains a complete process with all necessary nodes:

1. **Start** - process entry point
2. **Prepare Request** - data preparation node (MODIFY THIS)
3. **API Call** - external API call (MODIFY THIS) 
4. **Reply** - successful response
5. **Reply Error** - error responses
6. **Final** - successful completion
7. **Error nodes** - error handling

**IMPORTANT**: Only modify the "Prepare Request" and "API Call" nodes. All other nodes should remain unchanged.

---

## 3. 🔧 Required Modifications

### 3.1 Process Parameters Configuration

**IMPORTANT**: You must configure the `params` field in the root process object to define all incoming parameters that the user should pass when calling the process.

### 3.1.1 Using Variables for API Parameters

If you need to use API parameters like `url`, `login`, `secret`, etc., you should use variables instead of hardcoding them. Variables are stored in the `.processes/variables.json` file.

**Variable naming rules:**
- Variable names can only contain lowercase letters `[a-z]`, numbers `[0-9]`, and hyphens `-`
- Variable NAME and DESCRIPTION must be at least 3 characters long
- Examples: `paypal-url`, `api-token-123`, `database-host`

**Steps for using variables:**

1. **Check if variable exists**: First, verify if the required variable already exists in `.processes/variables.json`

2. **Create new variable if needed**: If the variable doesn't exist, create it using:
   ```bash
   API_URL=<API_URL> API_TOKEN=<API_TOKEN> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh create-variable <PROJECT_ID> <ROOT_FOLDER_ID> NAME DESCRIPTION VALUE
   ```

3. **Use variable in logic**: Reference the variable in your `set_param` logic using the format:
   ```json
   "url": "{{env_var[@example-url]}}"
   ```

**Example: Adding PayPal URL variable**

1. **Check variable in `.processes/variables.json`**: Verify that `paypal-url` doesn't exist
2. **Create the variable**:
   ```bash
   API_URL=https://admin.corezoid.com API_TOKEN=123 WORKSPACE_ID=123 ./convctl.sh create-variable 123 123 paypal-url "Paypal URL" "https://www.paypal.com"
   ```
3. **Use the variable in set_param logic**:
   ```json
   {
     "type": "set_param",
     "extra": {
       "url": "{{env_var[@paypal-url]}}"
     },
     "extra_type": {
       "url": "string"
     },
     "err_node_id": "68c7d861e552e8d570a1096e"
   }
   ```

```json
{
  "obj_type": 1,
  "title": "My API Connector",
  "params": [
    {
      "descr": "Description of the field",
      "flags": [
        "required",
        "input"
      ],
      "name": "field1", // must be changed based on logic
      "regex": "",
      "regex_error_text": "",
      "type": "string"
    },
    {
      "descr": "Description of the field",
      "flags": [
        "required",
        "input"
      ],
      "name": "field2", // must be changed based on logic
      "regex": "",
      "regex_error_text": "",
      "type": "string"
    }
  ],
  "scheme": {
    "nodes": [...]
  }
}
```

👉 params - all incoming parameters that the user should pass when calling the process. More details: [process-with-parameters.md](./docs/process/process-with-parameters.md)

### 3.2 "Prepare Request" Node Modifications

In the `api_code` logic, you must set the following required fields:

```javascript
// Required fields that MUST be set:
data.url = ""; // Set the base API URL
data.pathAndQuery = ""; // Set the path and query parameters
data.requestBody = {}; // Set request body for POST/PUT methods
```

**Example for GET request:**
```javascript
data.url = "https://api.example.com";
data.pathAndQuery = "/users/" + data.userId;
data.requestBody = {}; // Empty for GET
```

**Example for POST request:**
```javascript
data.url = "https://api.example.com";
data.pathAndQuery = "/users";
data.requestBody = {
    name: data.name,
    email: data.email
};
```

### 3.3 "API Call" Node Modifications

Modify the API call configuration:

```json
{
  "condition": {
    "logics": [
      {
        "type": "api",
        "rfc_format": true,
        "format": "raw", // raw is used when the request body (raw_body field) is used,
        "content_type": "application/json",
        "method": "GET", // Change to appropriate method (GET, POST, PUT, DELETE)
        "url": "{{url}}{{pathAndQuery}}",
        "extra_headers": {
          "content-type": "application/json", // Adjust as needed
          "Authorization": "Bearer {{API_TOKEN}}" // Add auth headers if needed
        },
        "raw_body":"{{requestBody}}", // body for the request, can include dynamic references like {{requestBody}}   (For POST/PUT methods)
        "cert_pem": "",
        "max_threads": 5,
        "send_sys": false,
        "debug_info": false,
        "err_node_id": "<err_node_id>",
        "customize_response": true,
        "response": {
          "responseHeaders": "{{header}}",
          "responseBody": "{{body}}"
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

**For POST/PUT requests**, add the request body:
```json
{
  "raw_body": "{{requestBody}}",
  "format": "raw"
}
```

### 3.4 Replace PROCESS_METRIC_ID 

replace `{{PROCESS_METRIC_ID}}` from the template with the PROCESS_METRIC_ID value that was passed in the parameters

**Example:**
```
if 
  PROCESS_METRIC_ID=1234567
then 
  {{PROCESS_METRIC_ID}} -> 1234567
```

---

## 4. =� Implementation Steps

1. **Copy the template**: Start with `templates/api-connector.json`
2. **Configure parameters**: Define all incoming parameters in `params`
3. **Analyze the API**: Understand the target API structure
4. **Modify "Prepare Request"**: Set `data.url`, `data.pathAndQuery`, and `data.requestBody`
5. **Modify "API Call"**: Update method, headers, and body configuration
6. **Test the connector**: Use convctl.sh to validate

---

## 5. =� Key Requirements

| Element | Requirement                                         |
|:--------|:----------------------------------------------------|
| Template base | Must use `templates/api-connector.json`             |
| Process params | Must configure incoming parameters                  |
| Nodes to modify | Only "Prepare Request" and "API Call"               |
| Required fields | `data.url`, `data.pathAndQuery`, `data.requestBody` |
| API Call method | Must match the target API requirements              |
| Error handling | Pre-configured, do not modify                       |

---

## 6. >� Testing Instructions

After creating the connector from template:

### 6.1 =� Save the Process
Save the modified process to:
```bash
~/repos/corezoid-ai-doc/.processes/my_api_process.json
```

### 6.2 =
 Test the Process
```bash
API_URL=<API_URL> API_TOKEN=<API_TOKEN> WORKSPACE_ID=<WORKSPACE_ID> ./convctl.sh run-process <PROC_ID> ~/repos/corezoid-ai-doc/.processes/my_api_process.json <task_data>
```

**Example:**
```bash
API_URL=https://admin.corezoid.com  API_TOKEN=123 WORKSPACE_ID=123 ./convctl.sh run-process 123 ~/repos/corezoid-ai-doc/.processes/my_api_process.json '{"userId":"123"}'
```
If you receive the message "Task completed", you need to check the response from the API. If something is wrong, fix it.

---


Only focus on the API-specific logic in the two designated nodes.

---

## 8. =� Related Documentation
- [Template File](./templates/api-connector.json)
- [Node Documentation](./docs/nodes/)