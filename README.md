# Portal.just.ro Case Search

This project contains:

- A Vite + React frontend for searching Romanian court cases (dosare)
- A Node.js Express backend that proxies requests to the SOAP web service at http://portalquery.just.ro/Query.asmx?wsdl

## How to run

### 1. Start the backend

```
cd backend
node index.js
```

The backend will run on http://localhost:3001

### 2. Start the frontend

```
npm run dev
```

The frontend will run on http://localhost:5173 (default Vite port)

## Usage

- Use the frontend to search for cases by number, object, or party name.
- The frontend will call the backend, which will query the SOAP service and return results.

---

**Note:**

- Node.js 18.18+ is recommended for best compatibility.
- If you encounter engine warnings, consider upgrading Node.js.
#   p o r t a l . j u s t  
 