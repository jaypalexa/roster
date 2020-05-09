import { Callback, Context, Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import jwt_decode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event: any, _context: Context, _callback: Callback) => {

  if (event.resource === '/wakeup') {
    return { statusCode: 200, body: { message: `WAKE UP at: ${new Date().toUTCString()}`}}
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const response = {
    statusCode: 200,
    body: {
      message: `TEST RESPONSE FROM roster-db-access-lambda: ${uuidv4()}`,
      input: event,
      data: {},
    },
  };


  if (event.resource.startsWith('/fetch-pdf-form')) {
    const getItemInputForFetchPdfForm: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: 'roster-table-pdf',
      Key: {
        'PK': event.pathParameters.pdfFormName
      },
    };

    response.body.data = (await ddb.get(getItemInputForFetchPdfForm).promise()).Item?.data;
    return response;
  }

  const decodedToken: any = jwt_decode(event.headers.jwt);

  const organizationId = decodedToken['custom:organizationId'];
  const tableName = `roster-table-${organizationId}`;

  switch (event.resource) {
  
    case '/organizations/{organizationId}':
      switch (event.httpMethod) {
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
        case 'GET':
          const getItemInput: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: tableName,
            Key: {
              'PK': organizationId,
              'SK': 'ORGANIZATION'
            },
          };
          response.body.data = (await ddb.get(getItemInput).promise()).Item?.data;
          break;
      
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
        case 'PUT':
          const putItem = {
            PK: organizationId,
            SK: 'ORGANIZATION',
            data: event.body
          };
          const putItemInput: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: tableName,
            Item: putItem,
            // UpdateExpression: 'set #a = :x + :y',
            // ConditionExpression: '#a < :MAX',
            // ExpressionAttributeNames: {'#a' : 'Sum'},
            // ExpressionAttributeValues: {
            //   ':x' : 20,
            //   ':y' : 45,
            //   ':MAX' : 100,
            // },
            ReturnValues: 'NONE'
          };
  
          response.body.data = (await ddb.put(putItemInput).promise());
          break;
      
        default:
          break;
      }
      break;
  
    default:
      break;
  }

  // ddb.get(params, function(err, data) {
  //   if (err) console.error(err);
  //   else     console.log(data);
  // });

  // ExpressionAttributeValues: {
  //   ':v1': {
  //       S: event.pathParameters.organizationId
  //   },
  //   ':v2': {
  //       S: 'organization'
  //   }
  // },
  // ExpressionAttributeNames: {
  //     '#PK': 'PK',
  //     '#SK': 'SK'
  // },
  // KeyConditionExpression: '#PK = :v1 and #SK = :v2'

  // body: JSON.stringify({
  //   message: `TEST RESPONSE FROM roster-db-access-lambda: ${testGuid}`,
  //   input: event,
  // }, null, 2),

  // headers: {
  //   'Access-Control-Allow-Origin': '*',
  //   'Content-Type': 'application/json',
  // },

  /*  REQUEST event from an API Gateway invocation:
    {
      "resource": "Resource path",	// ??? /root/child
      "path": "Path parameter",		// ??? /{stage}/root/child
      "httpMethod": "Incoming request's method name" // DELETE, GET, HEAD, OPTIONS, PATCH, POST, and PUT
      "headers": { "headerName": "headerValue", ... }, // {Incoming request headers}
      "queryStringParameters": {"foo": "bar", "foo2": "bar2"}	// {query string parameters}
      "pathParameters": {"foo": "bar", "foo2": "bar2"}	// {path parameters}
      "stageVariables": {Applicable stage variables}
      "requestContext": {Request context, including authorizer-returned key-value pairs}
      "body": "A JSON string of the request payload."
      "isBase64Encoded": true|false // "A boolean flag to indicate payload is Base64-encoded"
    }
  */

  /* RESPONSE FORMAT
    {
      "cookies" : ["cookie1", "cookie2"]
      "isBase64Encoded": true|false,
      "statusCode": httpStatusCode,
      "headers": { "headerName": "headerValue", ... },
      "body": "Hello from Lambda!"
    }   
  */
  
  //_callback(null, response);

  return response;
}
