import Image from "next/image";
import css from "styled-jsx/css";

export default function Footer() {
  return (
    <>
      <style jsx>{styles}</style>
      <footer>
        <a
          href="https://docs.figment.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Figment Docs
        </a>
        <a href="https://figment.io" target="_blank" rel="noopener noreferrer">
          Figment{" "}
          <span>
            <Image
              src="/figment.svg"
              alt="Figment Logo"
              width={16}
              height={16}
            />
          </span>
        </a>
      </footer>
    </>
  );
}

const styles = css`
  footer {
    width: 100%;
    font-weight: bold;
    border-top: 1px solid #eaeaea;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 40px 20px;
  }
  footer:hover {
    color: #034d76;
  }
`;
