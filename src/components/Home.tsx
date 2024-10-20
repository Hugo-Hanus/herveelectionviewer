import React from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import CustomFooter from "./CustomFooter";

function Home() {
  return (
    <>
      <style>
        {`
          @keyframes blinker {
            50% {
              opacity: 0;
            }
          }
          .blinking-title {
            animation: blinker 1s linear infinite;
          }
        `}
      </style>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Title
          level={1}
          className="blinking-title"
          style={{ textAlign: "center", color: "red", marginTop: "20px" }}
        >
          CE SITE EST EN DÉVELOPPEMENT
        </Title>
      </Content>
      <CustomFooter />
    </>
  );
}

export default Home;
