import { AppRouter } from "../../server/src/controllers";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

//  Initialize our client
const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/v1/trpc",
      headers: { Authorization: "TOKEN" },
    }),
  ],
});

async function main() {
  const test = await client.testIt.query();
  console.log(test);
}

main();
