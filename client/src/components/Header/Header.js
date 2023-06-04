import "./Header.scss";
import logo from "../../assets/logo.png";
import cx from "classnames";

const Header = ({ currPage, setCurrPage }) => {
  const changePage = (e) => {
    setCurrPage(e.target.getAttribute("data-id"));
  };

  return (
    <div className="header">
      <div className="header__logo">
        <img src={logo} alt="Логотип ПАО МАК Вымпел" />
      </div>
      <div className="header__buttons">
        <p
          className={cx("header__button", {
            "header__button-active": currPage == 0,
          })}
          onClick={changePage}
          data-id={0}
        >
          Обзор
        </p>
        <p
          className={cx("header__button", {
            "header__button-active": currPage == 1,
          })}
          onClick={changePage}
          data-id={1}
        >
          Анализ
        </p>
        <p
          className={cx("header__button", {
            "header__button-active": currPage == 2,
          })}
          onClick={changePage}
          data-id={2}
        >
          Отчётность
        </p>
      </div>
    </div>
  );
};

export default Header;
