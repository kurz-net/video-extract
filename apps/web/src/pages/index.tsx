import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const user = trpc.useQuery(["getUser"]);

  return (<div>

  </div>);
};

export default Home;
