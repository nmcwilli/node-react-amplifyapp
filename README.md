# AWS Amplify Notes App

This is a project I created as a starting point for AWS Amplify apps. It is a Notes App with a React front-end using AWS Amplify that has user authentication (Cognito) and allows users to track and store Notes. It interfaces with a GraphQL API via AppSync, which stores note data in a DynamoDB table. 

## Stack
- Front-end - React
- Back-end - Node/Express (Running in Amplify)
- API - AppSync/GraphQL w/ DynamoDB
- Static File Storage - S3

## Reference information

Update Server-side schema after making changes locally: 
```
amplify push
```

Sample GraphQL query: 
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

## Run the app in dev environment

```
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

## Launch the test runner
Launches the test runner in the interactive watch mode.
```
npm test
```

## Builds the app for production
Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!
```
npm run build
``````