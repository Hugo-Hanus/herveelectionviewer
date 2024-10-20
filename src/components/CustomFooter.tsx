import { Layout } from "antd";

const { Footer } = Layout;

function CustomFooter() {
  return (
    <Footer
      style={{
        textAlign: "center",
        bottom: 0,
        width: "100%",
      }}
    >
      <p>
        <b>
          Ce site est utilisé uniquement à des fins informatives et aucun
          bénéfice n'est réalisé sur cette application.
        </b>
        <br />
        Ce site a été crée par{" "}
        <a href="mailto:devhugoh@gmail.com?subject=À propos de Élection Viewer">
          devhugoh@gmail.com{" "}
        </a>
        bénévolement.
        <br />
        Aucun parti politique n'est mis en avant, tout est trié par ordre
        alphabétique.
        <br /> Les données sont publiques et proviennent des sites{" "}
        <a
          href="https://elections2024.wallonie.be/fr/resultats-chiffres?el=CG&id=CGM63035"
          target="_blank"
          rel="noopener noreferrer"
        >
          élections 2024
        </a>{" "}
        et{" "}
        <a
          href="https://elections2018.wallonie.be/fr/resultats-chiffres?el=CG&id=CGM63035"
          target="_blank"
          rel="noopener noreferrer"
        >
          élections 2018
        </a>{" "}
        qui sont la propriété de la <b>Wallonie et de la commune de Herve</b>.
      </p>
    </Footer>
  );
}

export default CustomFooter;
