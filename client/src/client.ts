import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../server/src/controllers/index";

//  Initialize our client
let authToken: string | null = null;
const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/v1/trpc",
      headers: () => ({
        Authorization: authToken ? `Bearer ${authToken}` : "",
      }),
    }),
  ],
});

// async function logOutUser() {
//   const logout = await client.user.logout.mutation();

//   return logout;
// }

async function main() {
  // const loginResponse = await client.user.login.mutation({
  //   email: "user2@gmail.com",
  //   password: "User21234",
  // });

  // authToken = loginResponse.token;
  // const testIt = await client.user.testIt.query();

  // console.log(testIt);

  // const createPost = await client.post.create.mutation({
  //   title: "Study in Poland",
  //   content: "Good education",
  // });
  // console.log(`Post has been created successfully ${createPost}`);
}

main();
