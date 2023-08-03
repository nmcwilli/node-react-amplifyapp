# AWS Amplify Notes App

This is a project I created as a starting point for AWS Amplify apps. It is a Notes App with a React front-end using AWS Amplify that has user authentication (Cognito) and allows users to track and store Notes. 

## Stack used
- Front-end - React
- Back-end - Node/Express (Running in Amplify)
- API - GraphQL and REST
- Storage - S3

## Reference information

Update Server-side schema after making changes locally: 
```
amplify push
```

Example GraphQL query: 
```
query MyQuery { 
  listNotes(filter: { owner: { eq: "nmcwilli" } }) { 
    items { 
      id 
      image 
      name 
      updatedAt 
      owner 
    } 
  } 
}
```

### `npm start` Running the app in dev

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!