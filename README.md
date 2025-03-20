Frontend  
  
Setup and run api  
cd frontend  
npm install  
  
create .env.local and add the following env vars:  
VITE_MAPS_API_KEY=<YOUR API KEY>  
VITE_MAPS_API_ADDRESS=http://localhost:8000  
  
npm run dev  
  
Note: the api cors header sets the allowed origin as http://localhost:5173 which Vite should use by default.
