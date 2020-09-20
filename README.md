# mean-stack

A MEAN application where users can
- Signup
- Login
- Create posts  
- Retrieve and list posts
- Edit posts
- Delete posts  

#### Authentication ####
- Only an authenticated (logged in) users are allowed to create posts.
- Users who are not authenticated (not logged in) can perform the below operations
    - View all posts
    - Login
    - Signup

#### Authorization ####
Only an authorized users are allowed to edit and delete posts. Only the creator of a post is allowed to edit or delete them.

### Architecture ###
![basic-mean-arch](/docs/images/basi-mean-arch.jpg)

### Highlights on the Angular application... ###  
- Application is broken down into separate components, logically divided by their functionalities.
- Usage of Angular CLI to generate the project, components and services  
- Usage of ```FormsModule``` and ```ReactiveFormsModule```  
[Reference for Template-Driven forms i.e. FormsModule vs Reactive Forms i.e. ReactiveFormsModule](https://www.pluralsight.com/guides/difference-between-template-driven-and-reactive-forms-angular)
- Usage of ```HttpClientModule``` to make http calls to the REST APIs  
- Usage of a few [Angular material design components](https://material.angular.io/)  
- Usage of ```rxjs``` observables to communicate changes to different components in the application using ```Subject``` and ```Subscription```
- Usage of ```rxjs``` observables pipes to transform API response
- Usage of Angular Routing
- Usage of Activated Route and ParamMap in Routing
- Usage of spinner when waiting for data on a page
- Uploading images using file picker
- Image preview and mime-type validation on client side
- Pagination using Angular Material Paginator
- Usage of local storage to store logged in user's JWT token and some additional user information
- Usage of Route guards feature of the Angular router
- Usage of HTTP request and response interceptors

CLI commands used to generate artifacts in this project [Reference](https://angular.io/cli/generate)
```
ng g component <component-name>
ng g service <service-name>
ng g interceptor <interceptor-name>
ng g guard <guard-name>
ng g module <module-name>
```

### Highlights on the Node.js/Express application... ###  

- Exposes REST APIs to retrieve, add, edit and delete posts (GET, POST, PUT, DELETE)
- Usage of ```nodemon``` to detect and publish changes during development
- Usage of ```body-parser``` to provide access to data passed within the request body
- Usage of middleware to allow cross origin requests ```CORS```
- Usage of express ```Router```
- Usage of ```multer``` to accept file input on server side [Documentation](https://github.com/expressjs/multer)
- Usage of ```mongoose``` to connect to the mongo database
- Usage of mongoose ```Schema``` to work with the collection and documents
- Usage of ```mongoose-unique-validator``` plugin to perform unique value validation
- Usage of ```bcrypt``` for encryption/hashing of data
- Usage of ```jsonwebtoken``` to create and validate JWTs

### Highlights on MongoDB... ### 

- Usage of free sandbox offering from mongodb - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). We could alternatively download and set up a mongo community database on our local machine and use that as well.
