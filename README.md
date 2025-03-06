# Publiko (V1)

Publiko is a web application that helps foreigners living in Poland share their personal experiences and insights. By allowing users to publish their personal stories about specific topics, Publiko fosters an informed and connected community. The platform provides secure user authentication and ensures that users can communicate with community by sharing their stories.



### Continuing Project: https://github.com/daniiar-pro/guide_in_pl

Several months ago Publiko was built by Python as an Idea, now we are on our way to implement this idea into reality! Join Us!


Note: Since this is our first release (MVP, v1), we won't  have a lot of features, you can see upcoming features that our team is working on!

### Upcomings (v2)

    1.  Allowing users to report specific posts that they found contain misinformation or policy violations. Which allows Publiko users to have trusted source of information
     
    2.  Donation: Users can donate to the author of posts if they found the author’s experience helpful. Users valuable experiences will be rewarded


## Features

- **User Management:**
  - **Sign Up:** New users can register.
  - **Login/Logout:** Registered users can securely authenticate.
- **Post Management:**
  - **Create Post:** Authenticated users can create posts about their experiences.
  - **Read Posts:** Anyone can view posts.
  - **Update/Delete Post:** Only the post author can update or delete their story.
- **tRPC Panel:**
  - An integrated panel (available in development) that makes it easy to test and interact with all API endpoints.

## Prerequisites

- Node.js (version 14 or above)
- npm

## Installation

1. **Clone the repository:**

   ```bash
   git clone <https://github.com/daniiar-pro/publiko.git>
   cd <server>

   ```

2. **Install dependencies:**

   ```bash
   npm install

   ```

3. **Run migrations to set up the database:**

   ```bash
    npm run migrate:latest

   ```

4. **Generate TypeScript types:**
   ```bash
   npm run gen:types
   ```

## Running the Application

1. **Start the development server with:**
   ```bash
    npm run  dev
   ```

- The server will launch and the tRPC Panel will be available at http://localhost:3000/api/v1/trpc-panel. Use this panel to interact with and test the API endpoints.

## Endpoints Overview

### User Endpoints

    •	Signup: Create a new account.
    •	Login: Authenticate and receive an access token.
    •	Logout: Log out (client-side token removal).

### Post Endpoints

    •	Create Post: Authenticated users can create a post (story) about their experiences.
    •	Read Posts: View posts created by users.
    •	Update/Delete Post: Only the post author can update or delete their post.

Note: Only authenticated users (with a valid token) can create, update, or delete posts. Use the tRPC Panel or your API client to test these endpoints. (Make sure to pass header with accessToken on top right of the trpcPanel, which then sees you as logged in, which makes creation, deletion of the posts available

key: Authorization

value: Bearer `access token` (When you login, endpoint will return accessToken, that starts with "eyJ"))

### Testing & Interaction

    •	API Testing:

You can use the tRPC Panel (available at /api/v1/trpc-panel) to poke endpoints, inspect responses, and simulate authentication by setting appropriate headers.


• Automated Tests:
Run the test suite with your preferred testing command (`npm run test`) to ensure everything is working as expected.

### Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for improvements and bug fixes.

