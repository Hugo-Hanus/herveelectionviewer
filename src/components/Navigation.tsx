import { BookFilled, HomeFilled, ProfileFilled } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navigation() {
  type MenuItem = Required<MenuProps>["items"][number];

  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      label: "Accueil",
      key: "",
      icon: <HomeFilled />,
    },
    {
      label: "Liste électorale",
      key: "Liste électorale",
      icon: <BookFilled />,
      children: [
        {
          type: "group",
          label: "Global",
          children: [
            { label: "2018", key: "2018" },
            { label: "2024", key: "2024" },
          ],
        },
        {
          type: "group",
          label: "Parti",
          children: [
            { label: "EPH", key: "EPH" },
            { label: "HDM", key: "HDM" },
            { label: "PS", key: "PS" },
          ],
        },
      ],
    },
    {
      label: "Toutes les données",
      key: "app",
      icon: <ProfileFilled />,
    },
  ];
  const [current, setCurrent] = useState("link");

  const onClick: MenuProps["onClick"] = (e) => {
    const link = `/${e.key}`;
    setCurrent(e.key);
    if (e.key.length === 0) {
      navigate(link);
    } else {
      if (!isNaN(parseInt(e.key, 10))) {
        navigate("/Annee" + link);
      } else {
        navigate("/List" + link);
      }
    }
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
}

export default Navigation;
