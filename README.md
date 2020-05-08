# ROSTER (Record Of Sea Turtles Electronic Reports) 
ROSTER is a PWA ([Progressive Web App](https://web.dev/progressive-web-apps/)) for collecting and reporting on marine turtle and holding tank data required by the [Florida Fish and Wildlife Conservation Commission](https://myfwc.com/wildlifehabitats/wildlife/sea-turtle/) (FWC).

---

## Live Site

* [roster.turtlegeek.com](https://roster.turtlegeek.com/)
* [roster-turtlegeek.netlify.app](https://roster-turtlegeek.netlify.app/)

---

## Tech Stack

* [React](https://reactjs.org/) for Typescript UI framework
  * [react-router](https://www.npmjs.com/package/react-router) for client-side routing
  * [react-hook-form](https://www.npmjs.com/package/react-hook-form) for forms
  * [react-data-table-component](https://www.npmjs.com/package/react-data-table-component) for tables
  * [react-chartjs-2](https://www.npmjs.com/package/react-chartjs-2) for charts and graphs
  * [leaflet](https://www.npmjs.com/package/leaflet) and [react-leaflet](https://www.npmjs.com/package/react-leaflet) for maps
  * [react-modal](https://www.npmjs.com/package/react-modal) for modal dialogs
  * [react-toastify](https://www.npmjs.com/package/react-toastify) for toast popups
* [Bulma](https://bulma.io/) for CSS framework and components
* [Amazon Web Services](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=tier%23always-free) ("Always Free" tier *only*)
  * [Amazon Cognito](https://aws.amazon.com/cognito/) for authentication
  * ~~[Amazon S3](https://aws.amazon.com/s3/)~~ (not "Always Free" tier), 
  * ~~[Amazon API Gateway](https://aws.amazon.com/apigateway/)~~ (not "Always Free" tier),
  * [AWS Lambda](https://aws.amazon.com/lambda/) (.NET Core) for data access and PDF report generation
  * [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) for NoSQL data storage
* [Netlify](https://www.netlify.com/) for static hosting

---

## TODO

| Item | Notes |
|------|-------|
| &check; User Authenication | [Amazon Cognito](https://aws.amazon.com/cognito/) |
| &check; Graphs for Sea Turtle > Morphometrics (temperature, salinity, pH) | ??? holding-tank-temperature-graph, etc. |
| &check; Mapping | &bull; [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/) ([article](https://blog.logrocket.com/how-to-use-react-leaflet/))<br /> ~~&bull; [Mapbox](https://www.mapbox.com/)~~ |
| &check; Data tables | https://www.npmjs.com/package/react-data-table-component |
| &check; Prompt to save changes if form is dirty and user clicks Edit/Delete or Add button | ~~Make Yes/No into Yes/No/Cancel~~ |
| &check; Add a loading spinner | home-grown |
| &check; Database (multi-tenant) | &bull; [Amazon DynamoDB](https://aws.amazon.com/dynamodb)<br /> &bull; [Building a Multitenant Storage Model on AWS (PDF)](https://d0.awsstatic.com/whitepapers/Multi_Tenant_SaaS_Storage_Strategies.pdf)<br />&bull; [Best Practices for Designing and Architecting with DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html) |
| &check; Prevent tabbing outside of modal | ??? [react-modal](https://www.npmjs.com/package/react-modal) |
| &#10065; Counters for items on home screen and tabs | Sea Turtles > Tags, etc. |
| &#10065; Filtering of tables | ??? [react-data-table-component-extensions](https://www.npmjs.com/package/react-data-table-component-extensions) |
| &#10065; Populate PDF forms | Some Node.js library in an [AWS Lambda](https://aws.amazon.com/lambda)? |
| &#10065; Session/Token timeout | ??? auto-refresh |
| &#10065; Preventing denial-of-service attacks /excessive usage | ??? throttling |
| &#10065; Make app a basic PWA | ??? notify that update is available; mechanism to update to latest |
| &#10065; Offline mode | ??? send updates if any made whilst offline...how to auth? Service worker unable to distinguish different payloads when calling AWS Lambda (https://lambda.us-east-2.amazonaws.com/2015-03-31/functions/roster-api-lambda/invocations)? |
| &#10065; Poor man's caching ??? | [A guide to stale-while-revalidate data fetching with React Hooks](https://dev.to/aviaryan/a-guide-to-stale-while-revalidate-data-fetching-with-react-hooks-15do) |

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

You may serve it with a static server; available at http://localhost:5000:

    npm install -g serve
    serve -s build

### More React

* [React - Adding Custom Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
* [Keeping env variables private in React App](https://medium.com/swlh/keeping-env-variables-private-in-react-app-fa44a9b33c31)

---

## Netlify

[Build & deploy > Environment > Environment variables](https://app.netlify.com/sites/roster-turtlegeek/settings/deploys#environment)

---

## Progressive Web Applications (PWA)

[Progressive Web Applications (PWA) on iOS Provide a Rich Channel to Reach Customers Despite the Platform Limitations](https://love2dev.com/pwa/ios/)

* Because Apple assumes space on its devices is cramped, they aggressively throw unused items overboard to free up disk space. If your PWA or any website for that matter, goes unused for a few days (we think it is roughly 14 days, it is not documented) the device will remove all cached assets associated with the origin. This includes IndexedDB, service worker cache, localStorage, etc.

To be classified as a progressive web application:
* Use HTTPS
* Register a Service Worker with a fetch event handler
* Valid web manifest file with a minimal homescreen icon set (not supported by iOS)

[iOS Getting Into The PWA Space Faster Than Ever](https://aureatelabs.com/pwa/ios-getting-into-pwa-space-faster-than-ever/)
* Apple imposes the caching limit to paltry **50 Mb**, which makes heavy formatted and high definition audios and videos reload— that’s terribly frustrating. 
* Apple frees up the phone storage by removing PWAs if you are not using them for undefined time (**~14 days**). Though the web app icon will remain on the screen, clicking on it will result in re-downloading.

---

## Service Workers

* [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)
* [The Service Worker Lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)
* [Service Worker Registration](https://developers.google.com/web/fundamentals/primers/service-workers/registration)
* [How to Fix the Refresh Button When Using Service Workers](https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68)
* [serviceworker.skipWaiting #1016](https://github.com/w3c/ServiceWorker/issues/1016)
* [Provide a one-line way to listen for a waiting Service Worker #1222](https://github.com/w3c/ServiceWorker/issues/1222)
* [Provide an easier way to listen for waiting/activated/redundant Service Workers #1247](https://github.com/w3c/ServiceWorker/issues/1247)
* [Chrome Service Worker iOS Support](https://stackoverflow.com/questions/50607343/chrome-service-worker-ios-support)
* [developer.google.com - Service Workers - Overview - Prerequisites - Browser Support](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support)

---

## Amazon Web Services (AWS)

### AWS CLI

* [Download and install the AWS CLI MSI installer for Windows (64-bit)(.msi)](https://awscli.amazonaws.com/AWSCLIV2.msi)

### AWS SDK

* [AWS SDK for .NET](https://docs.aws.amazon.com/sdkfornet/v3/apidocs/Index.html)

### Application Architecture

The application architecture uses:
* [Amazon Cognito](https://aws.amazon.com/cognito/), 
* ~~[Amazon S3](https://aws.amazon.com/s3/)~~ (not "Always Free" tier), 
* ~~[Amazon API Gateway](https://aws.amazon.com/apigateway/)~~ (not "Always Free" tier),
* [AWS Lambda](https://aws.amazon.com/lambda/), 
* [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)

![AWS application architecture diagram](
https://d1.awsstatic.com/Test%20Images/Kate%20Test%20Images/Serverless_Web_App_LP_assets-16.7cbed9781201a79b9efa761807c4312e68b23485.png)

* [Build a Serverless Web Application with AWS Lambda, Amazon API Gateway, Amazon S3, Amazon DynamoDB, and Amazon Cognito](https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/)

### Amazon Cognito

* [Amazon Cognito Identity SDK for JavaScript](https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js)
* [Using Tokens with User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html)
* [Identity Management with AWS Cognito in React](https://levelup.gitconnected.com/identity-management-with-aws-cognito-in-react-dc166bd799dc)
* [Authentication for React apps using AWS Amplify and Cognito](https://blog.logrocket.com/authentication-react-apps-aws-amplify-cognito/)

#### To change a user's password and update status using:

    aws cognito-idp admin-set-user-password --profile roster-admin-user --user-pool-id <USER_POOL_ID> --region <REGION> --username <USER_NAME> --password <PASSWORD> --permanent

#### To update user attributes

    aws cognito-idp admin-update-user-attributes --profile roster-admin-user --user-pool-id <USER_POOL_ID> --region <REGION> --username <USER_NAME> --user-attributes Name="custom:CustomAttr1",Value="Purple"

### AWS Lambda (.NET Core)

* See [roster-api-lambda on GitHub](https://github.com/jaypalexa/roster-api-lambda)

### Amazon DynamoDB

* [Class: AWS.DynamoDB.DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)

* [Allow a User to Perform Any DynamoDB Actions on a Table](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/using-identity-based-policies.html)

* [How to model one-to-many relationships in DynamoDB](https://www.alexdebrie.com/posts/dynamodb-one-to-many/)

* [(Answer #2 in "3 fields composite primary key (unique item) in Dynamodb")](https://stackoverflow.com/questions/32620215/3-fields-composite-primary-key-unique-item-in-dynamodb)

----

## Notes

* [Offer a page reload for users](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users)
* [Redirecting a user to the page they requested after successful authentication with react-router-dom](https://stackoverflow.com/questions/59422159/redirecting-a-user-to-the-page-they-requested-after-successful-authentication-wi/59423442#59423442)

