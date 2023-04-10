# ROSTER (Record Of Sea Turtles Electronic Reports)
ROSTER is a responsive, multi-tenant web application for collecting and reporting on marine turtle and holding tank data required by the [Florida Fish and Wildlife Conservation Commission](https://myfwc.com/wildlifehabitats/wildlife/sea-turtle/) (FWC).

---

## Live Site

* [roster.turtlegeek.com](https://roster.turtlegeek.com/)
* [roster-turtlegeek.netlify.app](https://roster-turtlegeek.netlify.app/)

---

## Tech Stack

* [React](https://reactjs.org/) - [Typescript](https://www.typescriptlang.org/) UI library
  * [react-router](https://www.npmjs.com/package/react-router) for client-side routing
  * [react-hook-form](https://www.npmjs.com/package/react-hook-form) for forms
  * [react-data-table-component](https://www.npmjs.com/package/react-data-table-component) for display tables
  * [react-chartjs-2](https://www.npmjs.com/package/react-chartjs-2) for charts and graphs
  * [leaflet](https://www.npmjs.com/package/leaflet) and [react-leaflet](https://www.npmjs.com/package/react-leaflet) for maps
  * [rxjs](https://www.npmjs.com/package/rxjs) for reactive programming using Observables
* [Material-UI](https://material-ui.com/) - React UI framework and components
  * [typeface-roboto] - Font used by Material-UI
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
| &check; Data tables | [material-table](https://material-table.com/) |
| &check;  Filtering (search) of tables | [material-table](https://material-table.com/) |
| &check; Prompt to save changes if form is dirty and user clicks Edit/Delete or Add button | ~~Make Yes/No into Yes/No/Cancel~~ |
| &check; Add a loading spinner | home-grown |
| &check; Database (multi-tenant) | &bull; [Amazon DynamoDB](https://aws.amazon.com/dynamodb)<br /> &bull; [Building a Multitenant Storage Model on AWS (PDF)](https://d0.awsstatic.com/whitepapers/Multi_Tenant_SaaS_Storage_Strategies.pdf)<br />&bull; [Best Practices for Designing and Architecting with DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html) |
| &check; Prevent tabbing outside of modal | [Material-UI](https://material-ui.com/) |
| &check; Session / Token timeout | AWS Cognito and refresh tokens (JWT) |
| &check; Material-UI or ~~Ant Design~~ instead of Bulma | [Material-UI](https://www.npmjs.com/package/@material-ui/core) / ~~[Ant Design](https://www.npmjs.com/package/antd)~~ |
| &check; Counters for items on home screen and tabs | Sea Turtles > Tags, etc. |
| &#10065; Preventing denial-of-service attacks / excessive usage | ??? throttling |
| &#10065; Offline mode | ??? send updates if any made whilst offline...how to auth? Service worker unable to distinguish different payloads when calling AWS Lambda (https://lambda.us-east-2.amazonaws.com/2015-03-31/functions/roster-api-lambda/invocations)? |
| &#10065; Poor man's caching ??? | [A guide to stale-while-revalidate data fetching with React Hooks](https://dev.to/aviaryan/a-guide-to-stale-while-revalidate-data-fetching-with-react-hooks-15do) |
| &#10065; Ability to click/tap to set map marker ??? | ??? |

### Reports - PDFs for FWC

| Report | Notes |
|--------|-------|
| &check; Marine Turtle Holding Facility Quarterly Report | [ generate \| blank ]  |
| &check; Marine Turtle Captive Facility Quarterly Report for Hatchlings | [ generate \| blank ]  |
| &check; Marine Turtle Captive Facility Quarterly Report for Washbacks | [ generate \| blank ]  |
| &check; Monitoring for Beach Restoration Projects | [ blank ]  |
| &check; Disorientation Incident Form | [ blank ]  |
| &check; Disorientation Incident Form Directions | [ blank ]  |
| &check; Educational Presentations Using Turtles | [ blank ]  |
| &check; Necropsy Report Form | [ blank ]  |
| &check; Nighttime Public Hatchling Release | [ blank ]  |
| &check; Obstructed Nesting Attempt Form | [ blank ]  |
| &check; Obstructed Nesting Attempt Form Directions | [ blank ]  |
| &check; Papilloma Documentation Form | [ blank ]  |
| &check; Public Turtle Watch Schedule Form | [ blank ]  |
| &check; Public Turtle Watch Summary Form | [ blank ]  |
| &check; Stranding and Salvage Form | [ blank ]  |
| &check; Tag Request Form | [ blank ]  |
| &check; Tagging Data Form | [ generate \| blank ]  |
| &check; Turtle Transfer Form | [ blank ]  |

### Reports - Other

| Report | Notes |
|--------|-------|
| &check; Turtle Injury Report | [ generate ]  |
| &check; Turtle Tag Report | [ generate ]  |
| &check; Hatchlings and Washbacks by County Report | [ generate ]  |

### Reports - Online PDF Editor
* [PDFescape Online PDF Editor](https://www.pdfescape.com/windows/)

---

## Available Scripts

In the project directory, you can run:

### `npm install`

Runs the initial installation of npm packages.

### `npm outdated`

Lists npm packages that are not the latest allowable version as per the `package.json` file.

### `npm update`

Updates npm packages (top-level only) to the latest allowable version as per the `package.json` file.

### `npm dedupe`

Fixes "blah cannot be used as a JSX component" errors.

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

[Free "starter" plan](https://www.netlify.com/pricing/) for hosting personal projects, hobby sites, or experiments.
* 1 team member ($15/add’l user)
* 1 concurrent build
* 100GB bandwidth/month
* 300 build minutes/month
* Continuous deployment
* Access to add-ons

[Build & deploy > Environment > Environment variables](https://app.netlify.com/sites/roster-turtlegeek/settings/deploys#environment)

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

#### To change a user's password and update status

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

### General

* [Offer a page reload for users](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users)
* [Redirecting a user to the page they requested after successful authentication with react-router-dom](https://stackoverflow.com/questions/59422159/redirecting-a-user-to-the-page-they-requested-after-successful-authentication-wi/59423442#59423442)
* [React + RxJS - Communicating Between Components with Observable & Subject](https://jasonwatmore.com/post/2019/02/13/react-rxjs-communicating-between-components-with-observable-subject)

### Hacks

* [Material-Table Mutates Item Passed Through data Prop](https://github.com/mbrn/material-table/issues/1371) - Because of this, we have to assign the data source a _copy_ of the data array rather than just assigning the array itself.
