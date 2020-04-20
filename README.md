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
| Graphs for Sea Turtle > Morphometrics (temperature, salinity, pH) | ??? |
| Mapping | [Mapbox](https://www.mapbox.com/)? or [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)? [article](https://www.smashingmagazine.com/2020/02/javascript-maps-react-leaflet/) |
| Offline Mode | ??? send updates if any made whilst offline...how to auth? |
| Preventing Denial-of-Service attacks /excessive usage | ??? throttling |
| Counters for items on home screen and tabs | Sea Turtles > Tags, etc. |
| Filtering of tables | ??? |
| ~~Data Table~~ | https://www.npmjs.com/package/react-data-table-component |
| ~~Sea Turtles: Prompt to save changes if form is dirty and user clicks Edit/Delete or Add button~~ | ~~Make Yes/No into Yes/No/Cancel~~ |

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

### PWA

[Progressive Web Applications (PWA) on iOS Provide a Rich Channel to Reach Customers Despite the Platform Limitations](https://love2dev.com/pwa/ios/)
* Because Apple assumes space on its devices is cramped, they aggressively throw unused items overboard to free up disk space. If your PWA or any website for that matter, goes unused for a few days (we think it is roughly 14 days, it is not documented) the device will remove all cached assets associated with the origin. This includes IndexedDB, service worker cache, localStorage, etc.

To be classified as a progressive web application:
* Use HTTPS
* Register a Service Worker with a fetch event handler
* Valid web manifest file with a minimal homescreen icon set (not supported by iOS)

[iOS Getting Into The PWA Space Faster Than Ever](https://aureatelabs.com/pwa/ios-getting-into-pwa-space-faster-than-ever/)
* Apple imposes the caching limit to paltry **50 Mb**, which makes heavy formatted and high definition audios and videos reload— that’s terribly frustrating. 
* Apple frees up the phone storage by removing PWAs if you are not using them for undefined time (**~14 days**). Though the web app icon will remain on the screen, clicking on it will result in re-downloading.

### Service Workers

[Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)

[The Service Worker Lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle)

[Service Worker Registration](https://developers.google.com/web/fundamentals/primers/service-workers/registration)

#### Service Worker Support

[](https://stackoverflow.com/questions/50607343/chrome-service-worker-ios-support)
[developer.google.com - Service Workers - Overview - Prerequisites - Browser Support](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support)

## Notes

[How to make react-hook-form work with multiple forms in one page?](https://stackoverflow.com/questions/60276510/how-to-make-react-hook-form-work-with-multiple-forms-in-one-page)

----

[Serverless Stack is a completely free resource to help you build full-stack production ready Serverless applications](https://serverless-stack.com/)

----

[How to Fix the Refresh Button When Using Service Workers](https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68)

[serviceworker.skipWaiting #1016](https://github.com/w3c/ServiceWorker/issues/1016)

[Provide a one-line way to listen for a waiting Service Worker #1222](https://github.com/w3c/ServiceWorker/issues/1222)

[Provide an easier way to listen for waiting/activated/redundant Service Workers #1247](https://github.com/w3c/ServiceWorker/issues/1247)

[Offer a page reload for users](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users)

----

[React Hooks: Why Do We Need useContext and How Does It Help?](https://medium.com/better-programming/react-hooks-usecontext-30eb560999f)
