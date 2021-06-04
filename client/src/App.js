import styled from "styled-components";
import "./style/main.scss";

import Users from "./components/Users/Users";

const Layout = styled.main`
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;
function App() {
  return (
    <Layout>
      <Users />
    </Layout>
  );
}

export default App;
