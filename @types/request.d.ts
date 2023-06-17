declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    export interface Request {
      context: {
        userId?: string
      }
    }
  }
}
export { }

// Could be applied like below \/

// import * as http from 'http'

// // module augmentation
// declare module 'express-serve-static-core' {
//   export interface Request extends http.IncomingMessage, Express.Request {
//     context: {
//       userId?: string
//     }
//   }
// }

// export { }
