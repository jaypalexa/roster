# ROSTER
ROSTER (Record Of Sea Turtles Electronic Reports) collects marine turtle and holding tank data required by the [Florida Fish and Wildlife Conservation Commission](https://myfwc.com/wildlifehabitats/wildlife/sea-turtle/) (FWC).

## Live Sites

[roster.turtlegeek.com](https://roster.turtlegeek.com/)

[roster-turtlegeek.netlify.app](https://roster-turtlegeek.netlify.app/)

## TODO

| Item | Notes |
|------|-------|
| Prevent tabbing outside of modal | ??? switch to [react-modal](https://www.npmjs.com/package/react-modal) |
| Make app a basic PWA | How to force update? |
| User Authenication | [Amazon Cognito](https://aws.amazon.com/cognito/) |
| Session/Token Timeout | ??? auto-refresh |
| Multi-tenancy | ??? |
| Database | [Amazon DynamoDB](https://aws.amazon.com/dynamodb) |
| Versioning / Database migrations | ??? |
| Populate PDF forms | Some Node.js library in an [AWS Lambda](https://aws.amazon.com/lambda)? |
| Mapping | [Mapbox](https://www.mapbox.com/)? or [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)? [article](https://www.smashingmagazine.com/2020/02/javascript-maps-react-leaflet/) |
| Offline Mode | ??? send updates if any made whilst offline...how to auth? |
| Preventing Denial-of-Service attacks /excessive usage | ??? throttling |
| Counters for items on home screen and tabs | Sea Turtles > Tags, etc. |
| Filtering of tables | ??? |
| ~~Data Table~~ | https://www.npmjs.com/package/react-data-table-component |
| ~~Sea Turtles: Prompt to save changes if form is dirty and user clicks Edit/Delete or Add New button~~ | ~~Make Yes/No into Yes/No/Cancel~~ |

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

You may serve it with a static server:

  npm install -g serve
  serve -s build

Available at:  http://localhost:5000

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

### Service Workers

[Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)

[The Service Worker Lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)

[Service Worker Registration](https://developers.google.com/web/fundamentals/primers/service-workers/registration)

## Notes

[How to make react-hook-form work with multiple forms in one page?](https://stackoverflow.com/questions/60276510/how-to-make-react-hook-form-work-with-multiple-forms-in-one-page)

[Serverless Stack is a completely free resource to help you build full-stack production ready Serverless applications](https://serverless-stack.com/)
